'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '../dashboard/activity-actions'

export type CustomerStatus = 'lead' | 'active' | 'closed';

export interface Customer {
    id: string;
    workspace_id: string;
    full_name: string;
    email: string;
    phone?: string;
    company_name?: string;
    status: CustomerStatus;
    created_at: string;
}

export async function getCustomers() {
    const supabase = await createClient()

    // 0. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        console.error('Auth error in getCustomers:', authError)
        return []
    }

    // 1. Get user's workspace_id using Service Role client (avoiding RLS recursion)
    const sKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const useAdmin = sKey && sKey.length > 50 && !sKey.includes('copy-from')

    // DEBUG LOGS (Server Side)
    console.log('--- CRM DEBUG ---');
    console.log('User ID:', user.id);
    console.log('Using Admin Client:', useAdmin);
    if (!useAdmin) {
        console.log('Service Key Status:', sKey ? (sKey.length < 50 ? 'Too short' : 'Contains placeholder') : 'Missing');
        return []; // Return empty array if service role not available
    }

    const adminClient = await createAdminClient()

    const { data: profiles, error: profileError } = await adminClient
        .from('profiles')
        .select('workspace_id')
        .eq('id', user.id)
        .limit(1)

    if (profileError) {
        console.error('Profile Fetch Error:', profileError)
        return []
    }

    const profile = profiles?.[0];

    if (!profile) {
        console.error('Profile record missing for user:', user.id)
        return []
    }

    if (!profile.workspace_id) {
        console.error('User has profile but no workspace_id:', user.id)
        return []
    }

    // 2. Fetch customers for that workspace using Admin Client to ensure reliability
    const { data, error } = await adminClient
        .from('customers')
        .select('*')
        .eq('workspace_id', profile.workspace_id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching customers:', error)
        return []
    }

    return data
}

export async function createCustomer(formData: FormData) {
    const supabase = await createClient()

    // 0. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Not authenticated' }

    // 1. Get user's workspace_id using Service Role client (avoiding RLS recursion)
    const sKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const useAdmin = sKey && sKey.length > 50 && !sKey.includes('copy-from')
    
    if (!useAdmin) {
        return { error: 'Service Role Key not configured properly. Please contact administrator.' }
    }
    
    const adminClient = await createAdminClient()
    const { data: profiles, error: profileError } = await adminClient
        .from('profiles')
        .select('workspace_id')
        .eq('id', user.id)
        .limit(1)

    const profile = profiles?.[0];

    if (profileError || !profile) {
        const errorMsg = profileError?.message || 'Profile record missing';
        return { 
            error: `Auth Connection Error: ${errorMsg}. Please use the Profile Repair Tool or sign out and sign up again.`,
            needsProfileRepair: true
        }
    }

    if (!profile.workspace_id) {
        return { error: 'User found but no workspace is linked. Try signing up again.' }
    }

    const full_name = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const company_name = formData.get('companyName') as string
    const status = formData.get('status') as CustomerStatus
    
    const { data, error } = await adminClient
        .from('customers')
        .insert({
            workspace_id: profile.workspace_id,
            full_name,
            email,
            phone,
            company_name,
            status
        })
        .select()
        .single()

    if (error) return { error: error.message }

    await logActivity({
        entity_type: 'customer',
        entity_id: data.id,
        action: 'created',
        details: { full_name, company_name }
    });

    revalidatePath('/dashboard/customers')
    return { success: true }
}

export async function updateCustomer(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('workspace_id')
        .eq('id', user.id)
        .single()

    if (!profile?.workspace_id) return { error: 'Workspace not found' }

    const full_name = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const company_name = formData.get('companyName') as string
    const status = formData.get('status') as CustomerStatus

    const { error } = await adminClient
        .from('customers')
        .update({
            full_name,
            email,
            phone,
            company_name,
            status
        })
        .eq('id', id)
        .eq('workspace_id', profile.workspace_id) // Safety check

    if (error) return { error: error.message }

    await logActivity({
        entity_type: 'customer',
        entity_id: id,
        action: 'updated',
        details: { full_name }
    });

    revalidatePath('/dashboard/customers')
    return { success: true }
}

export async function deleteCustomer(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('workspace_id')
        .eq('id', user.id)
        .single()

    if (!profile?.workspace_id) return { error: 'Workspace not found' }

    const { error } = await adminClient
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('workspace_id', profile.workspace_id) // Safety check

    if (error) return { error: error.message }

    revalidatePath('/dashboard/customers')
    return { success: true }
}
