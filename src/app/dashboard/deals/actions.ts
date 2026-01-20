'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '../activity-actions'

export type DealStage = 'New' | 'Contacted' | 'Negotiation' | 'Won' | 'Lost';

export interface Deal {
    id: string;
    workspace_id: string;
    customer_id: string;
    owner_id: string;
    name: string;
    value: number;
    stage: DealStage;
    close_date?: string;
    created_at: string;
    customer?: {
        full_name: string;
        company_name: string;
    };
}

export async function getDeals() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return []

    const sKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const useAdmin = sKey && sKey.length > 50 && !sKey.includes('copy-from')
    
    if (!useAdmin) return []
    
    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('workspace_id, role')
        .eq('id', user.id)
        .single()

    if (!profile?.workspace_id) return []

    // Build query with role-based filtering
    let query = adminClient
        .from('deals')
        .select('*, customer:customers(full_name, company_name)')
        .eq('workspace_id', profile.workspace_id)
        .order('created_at', { ascending: false })

    // Team Members only see deals they own
    if (profile.role === 'team_member') {
        query = query.eq('owner_id', user.id)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching deals:', error)
        return []
    }

    return (data || []) as Deal[]
}

export async function createDeal(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('workspace_id')
        .eq('id', user.id)
        .single()

    if (!profile?.workspace_id) return { error: 'No workspace found' }

    const name = formData.get('name') as string
    const value = parseFloat(formData.get('value') as string) || 0
    const customer_id = formData.get('customer_id') as string
    const stage = (formData.get('stage') as DealStage) || 'New'
    const close_date = formData.get('close_date') as string

    const { data, error } = await adminClient
        .from('deals')
        .insert({
            workspace_id: profile.workspace_id,
            customer_id,
            owner_id: user.id,
            name,
            value,
            stage,
            close_date: close_date || null
        })
        .select()
        .single()

    if (error) return { error: error.message }

    await logActivity({
        entity_type: 'deal',
        entity_id: data.id,
        action: 'created',
        details: { name, value }
    });

    revalidatePath('/dashboard/deals')
    return { success: true }
}

export async function updateDeal(id: string, formData: FormData) {
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

    const name = formData.get('name') as string
    const value = parseFloat(formData.get('value') as string) || 0
    const customer_id = formData.get('customer_id') as string
    const stage = (formData.get('stage') as DealStage) || 'New'
    const close_date = formData.get('close_date') as string

    const { error } = await adminClient
        .from('deals')
        .update({
            name,
            value,
            customer_id,
            stage,
            close_date: close_date || null
        })
        .eq('id', id)
        .eq('workspace_id', profile.workspace_id)

    if (error) return { error: error.message }

    await logActivity({
        entity_type: 'deal',
        entity_id: id,
        action: 'updated',
        details: { name, stage }
    });

    revalidatePath('/dashboard/deals')
    return { success: true }
}

export async function deleteDeal(id: string) {
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
        .from('deals')
        .delete()
        .eq('id', id)
        .eq('workspace_id', profile.workspace_id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/deals')
    return { success: true }
}

export async function updateDealStage(dealId: string, stage: DealStage) {
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
        .from('deals')
        .update({ stage })
        .eq('id', dealId)
        .eq('workspace_id', profile.workspace_id)

    if (error) return { error: error.message }

    await logActivity({
        entity_type: 'deal',
        entity_id: dealId,
        action: 'status_change',
        details: { new_stage: stage }
    });

    revalidatePath('/dashboard/deals')
    return { success: true }
}
