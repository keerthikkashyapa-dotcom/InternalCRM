'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'

export async function exportCustomersFromPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Check user role and workspace
    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role, workspace_id')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return { error: 'Profile not found' }
    }

    // Build query based on role
    let query = adminClient
        .from('customers')
        .select('full_name, email, phone, company_name, status, created_at')

    // Apply workspace filter for all roles
    query = query.eq('workspace_id', profile.workspace_id)

    // For Team Members, apply additional filtering if needed (currently all customers in workspace are visible)
    
    query = query.order('created_at', { ascending: false })

    const { data: customers, error } = await query

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