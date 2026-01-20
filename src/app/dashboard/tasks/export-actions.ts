'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'

export async function exportTasksFromPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Check user role and workspace
    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role, workspace_id, id')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return { error: 'Profile not found' }
    }

    // Build query based on role
    let query = adminClient
        .from('tasks')
        .select(`
            title,
            description,
            status,
            priority,
            due_date,
            created_at,
            assigned_to:profiles(full_name),
            customer:customers(full_name),
            deal:deals(name)
        `)

    // Apply workspace filter for all roles
    query = query.eq('workspace_id', profile.workspace_id)

    // For Team Members, only show tasks assigned to them
    if (profile.role === 'team_member') {
        query = query.eq('assigned_to', profile.id)
    }

    query = query.order('created_at', { ascending: false })

    const { data: tasks, error } = await query

    if (error) return { error: error.message }

    // Convert to CSV format
    const headers = ['Title', 'Description', 'Status', 'Priority', 'Due Date', 'Assigned To', 'Customer', 'Deal', 'Created At']
    const csvContent = [
        headers.join(','),
        ...(tasks || []).map(task => 
            `"${task.title || ''}","${task.description || ''}","${task.status || ''}","${task.priority || ''}","${task.due_date || ''}","${Array.isArray(task.assigned_to) && task.assigned_to[0]?.full_name || ''}","${Array.isArray(task.customer) && task.customer[0]?.full_name || ''}","${Array.isArray(task.deal) && task.deal[0]?.name || ''}","${task.created_at || ''}"`
        )
    ].join('\n')

    return { 
        success: true, 
        csv: csvContent,
        filename: `tasks-export-${new Date().toISOString().split('T')[0]}.csv`
    }
}