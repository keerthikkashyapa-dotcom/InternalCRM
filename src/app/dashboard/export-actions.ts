'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function exportCustomers() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Check if user is admin
    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role, workspace_id')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        return { error: 'Admin access required' }
    }

    // Fetch all customers for this workspace
    const { data: customers, error } = await adminClient
        .from('customers')
        .select('full_name, email, phone, company_name, status, created_at')
        .eq('workspace_id', profile.workspace_id)
        .order('created_at', { ascending: false })

    if (error) return { error: error.message }

    // Convert to CSV format
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Created At']
    const csvContent = [
        headers.join(','),
        ...(customers || []).map(customer => 
            `"${customer.full_name || ''}","${customer.email || ''}","${customer.phone || ''}","${customer.company_name || ''}","${customer.status || ''}","${customer.created_at || ''}"`
        )
    ].join('\n')

    return { 
        success: true, 
        csv: csvContent,
        filename: `customers-export-${new Date().toISOString().split('T')[0]}.csv`
    }
}

export async function exportDeals() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Check if user is admin
    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role, workspace_id')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        return { error: 'Admin access required' }
    }

    // Fetch all deals for this workspace with customer info
    const { data: deals, error } = await adminClient
        .from('deals')
        .select(`
            name, 
            value, 
            stage, 
            close_date, 
            created_at,
            customer:customers(full_name, company_name)
        `)
        .eq('workspace_id', profile.workspace_id)
        .order('created_at', { ascending: false })

    if (error) return { error: error.message }

    // Convert to CSV format
    const headers = ['Deal Name', 'Value', 'Stage', 'Close Date', 'Customer Name', 'Customer Company', 'Created At']
    const csvContent = [
        headers.join(','),
        ...(deals || []).map(deal => 
            `"${deal.name || ''}",${deal.value || 0},"${deal.stage || ''}","${deal.close_date || ''}","${Array.isArray(deal.customer) && deal.customer[0]?.full_name || ''}","${Array.isArray(deal.customer) && deal.customer[0]?.company_name || ''}","${deal.created_at || ''}"`
        )
    ].join('\n')

    return { 
        success: true, 
        csv: csvContent,
        filename: `deals-export-${new Date().toISOString().split('T')[0]}.csv`
    }
}

export async function exportTasks() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Check if user is admin
    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role, workspace_id')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        return { error: 'Admin access required' }
    }

    // Fetch all tasks for this workspace with related info
    const { data: tasks, error } = await adminClient
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
        .eq('workspace_id', profile.workspace_id)
        .order('created_at', { ascending: false })

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