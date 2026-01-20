'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTeamDetails() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'AUTH_REQUIRED' }

    // Get current user's role and workspace
    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('workspace_id, role')
        .eq('id', user.id)
        .single()

    if (!profile) {
        console.error('No profile found for current user:', user.id)
        return { error: 'PROFILE_MISSING', userId: user.id }
    }

    if (!profile.workspace_id) {
        console.error('Profile has no workspace_id:', user.id)
        return { error: 'WORKSPACE_MISSING', userId: user.id }
    }

    if (profile.role === 'team_member') return { error: 'ACCESS_DENIED' }

    let query = adminClient
        .from('profiles')
        .select(`
            *,
            tasks:tasks!assigned_to(count),
            deals:deals!owner_id(count),
            manager:profiles!manager_id(full_name, role)
        `)
        .eq('workspace_id', profile.workspace_id)
        .order('role', { ascending: true })

    // Debugging: Log the query parameters
    console.log('Fetching team for workspace:', profile.workspace_id)

    // Managers cannot see Admins
    if (profile.role === 'manager') {
        query = query.neq('role', 'admin')
    }

    const { data, error } = await query

    if (error) {
        console.warn('Complex team query failed (possibly missing tables), falling back to simple query:', error.message)
        // Try simple query without the counts and without the manager relationship
        const { data: simpleData, error: simpleError } = await adminClient
            .from('profiles')
            .select(`*`)
            .eq('workspace_id', profile.workspace_id)
            .order('role', { ascending: true })
        
        if (simpleError) {
            console.error('Error fetching basic team details:', simpleError)
            return { error: 'FETCH_FAILED' }
        }
        return { team: simpleData, role: profile.role }
    }

    console.log(`Found ${data?.length || 0} team members for workspace ${profile.workspace_id}`)
    return { team: data, role: profile.role }
}

export async function repairWorkspace() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const adminClient = await createAdminClient()
    
    // 1. Create a workspace
    const { data: workspace, error: wsError } = await adminClient
        .from('workspaces')
        .insert({ name: 'My New Workspace' })
        .select()
        .single()
    
    if (wsError) return { error: wsError.message }

    // 2. Upsert profile
    const { error: pError } = await adminClient
        .from('profiles')
        .upsert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || 'Admin',
            role: 'admin',
            workspace_id: workspace.id
        })
    
    if (pError) return { error: pError.message }

    revalidatePath('/dashboard/team')
    return { success: true }
}

export async function assignManager(memberId: string, managerId: string | null) {
    const adminClient = await createAdminClient()
    const { error } = await adminClient
        .from('profiles')
        .update({ manager_id: managerId })
        .eq('id', memberId)

    if (error) {
        console.error('Error assigning manager:', error)
        return { error: error.message }
    }

    return { success: true }
}

export async function addTeamMember(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const adminClient = await createAdminClient()
    const { data: adminProfile } = await adminClient
        .from('profiles')
        .select('workspace_id, role')
        .eq('id', user.id)
        .single()

    if (!adminProfile) {
        return { error: 'Admin profile not found. Please log out and sign up again.' }
    }

    if (!adminProfile.workspace_id) {
        return { error: 'Your account is not associated with a workspace.' }
    }

    if (adminProfile.role !== 'admin' && adminProfile.role !== 'manager') {
        return { error: 'Unauthorized' }
    }

    const email = formData.get('email') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as string
    const password = formData.get('password') as string
    const managerId = formData.get('managerId') as string

    console.log('Attempting to create team member:', email, 'in workspace:', adminProfile.workspace_id)

    // 1. Create User in Auth
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
    })

    if (authError) {
        console.error('Auth user creation error:', authError)
        return { error: authError.message }
    }

    console.log('Auth user created successfully:', authUser.user.id)

    // 2. Create Profile linked to this workspace
    // Add a small delay to ensure auth.user is fully propagated in Supabase
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { error: profileError } = await adminClient
        .from('profiles')
        .upsert({
            id: authUser.user.id,
            workspace_id: adminProfile.workspace_id,
            role,
            full_name: fullName,
            email,
            manager_id: managerId === 'none' ? null : managerId
        })

    if (profileError) {
        console.error('Profile creation error details:', profileError)
        // Cleanup auth user if profile creation fails
        await adminClient.auth.admin.deleteUser(authUser.user.id)
        return { error: `Failed to create profile: ${profileError.message}` }
    }

    console.log('Successfully created team member profile for:', email, 'ID:', authUser.user.id)

    revalidatePath('/dashboard/team')
    return { success: true }
}
