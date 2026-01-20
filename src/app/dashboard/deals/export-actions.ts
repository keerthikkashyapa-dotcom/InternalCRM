'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'

export async function exportDealsFromPage() {
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
        .from('deals')
        .select(`
            name, 
            value, 
            stage, 
            close_date, 
            created_at,
            customer:customers(full_name, company_name)
        `)

    // Apply workspace filter for all roles
    query = query.eq('workspace_id', profile.workspace_id)

    // For Team Members, only show deals they own
    if (profile.role === 'team_member') {
        query = query.eq('owner_id', profile.id)
    }

    query = query.order('created_at', { ascending: false })

    const { data: deals, error } = await query

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