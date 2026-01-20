'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const adminClient = await createAdminClient()
    const { data: profile, error } = await adminClient
        .from('profiles')
        .select('*, workspace:workspaces(name)')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile with admin client:', error)
        return null
    }

    return profile
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const full_name = formData.get('fullName') as string

    const { error } = await supabase
        .from('profiles')
        .update({ full_name })
        .eq('id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function changePassword(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) return { error: error.message }

    return { success: true }
}

export async function updateWorkspace(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Use admin client to bypass RLS recursion if needed, 
    // but profiles table should have workspace_id.
    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('workspace_id, role')
        .eq('id', user.id)
        .single()

    if (!profile?.workspace_id) return { error: 'No workspace found' }
    if (profile.role !== 'admin' && profile.role !== 'manager') {
        return { error: 'Only admins or managers can update workspace settings' }
    }

    const name = formData.get('workspaceName') as string

    const { error } = await supabase
        .from('workspaces')
        .update({ name })
        .eq('id', profile.workspace_id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/settings')
    return { success: true }
}
