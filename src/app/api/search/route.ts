import { createClient, createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
    if (query.trim().length === 0) {
      return NextResponse.json({ results: [] })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's workspace
    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
      .from('profiles')
      .select('workspace_id, role')
      .eq('id', user.id)
      .single()

    if (!profile?.workspace_id) {
      return NextResponse.json({ results: [] })
    }

    const workspaceId = profile.workspace_id
    const normalizedQuery = query.toLowerCase().trim()

    // Search customers
    const { data: customers } = await adminClient
      .from('customers')
      .select('id, full_name, email, company_name, phone')
      .eq('workspace_id', workspaceId)
      .or(`full_name.ilike.%${normalizedQuery}%,email.ilike.%${normalizedQuery}%,company_name.ilike.%${normalizedQuery}%`)
      .limit(5)

    // Search deals
    let dealsQuery = adminClient
      .from('deals')
      .select('id, name, value, stage, customer:customers(full_name, company_name)')
      .eq('workspace_id', workspaceId)
      .or(`name.ilike.%${normalizedQuery}%`)
      .limit(5)

    // Team Members only see deals they own
    if (profile.role === 'team_member') {
      dealsQuery = dealsQuery.eq('owner_id', user.id)
    }

    const { data: deals } = await dealsQuery

    // Search tasks (only for authorized users)
    let taskQuery = adminClient
      .from('tasks')
      .select('id, title, description, status, priority, assigned_to:profiles!inner(full_name), customer:customers(full_name), deal:deals(name)')
      .eq('workspace_id', workspaceId)
      .or(`title.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%`)

    // Apply role-based filtering
    if (profile.role === 'team_member') {
      taskQuery = taskQuery.eq('assigned_to.id', user.id)
    } else if (profile.role === 'manager') {
      // Managers can see tasks in their workspace (already filtered by workspace_id)
    }

    const { data: tasks } = await taskQuery.limit(5)

    // Format results
    const results = [
      ...(customers || []).map(customer => ({
        id: customer.id,
        type: 'customer' as const,
        title: customer.full_name,
        subtitle: customer.company_name || 'No company',
        description: `${customer.email}${customer.phone ? ` • ${customer.phone}` : ''}`,
        url: `/dashboard/customers?view=${customer.id}`
      })),
      ...(deals || []).map(deal => ({
        id: deal.id,
        type: 'deal' as const,
        title: deal.name,
        subtitle: Array.isArray(deal.customer) && deal.customer[0]?.full_name ? `Customer: ${deal.customer[0].full_name}` : 'No customer',
        description: `$${deal.value?.toLocaleString() || '0'} • ${deal.stage}`,
        url: `/dashboard/deals?view=${deal.id}`
      })),
      ...(tasks || []).map(task => ({
        id: task.id,
        type: 'task' as const,
        title: task.title,
        subtitle: Array.isArray(task.customer) && task.customer[0]?.full_name ? `Customer: ${task.customer[0].full_name}` : Array.isArray(task.deal) && task.deal[0]?.name ? `Deal: ${task.deal[0].name}` : 'Unlinked task',
        description: `${task.status} • ${task.priority} priority${Array.isArray(task.assigned_to) && task.assigned_to[0]?.full_name ? ` • Assigned to ${task.assigned_to[0].full_name}` : ''}`,
        url: `/dashboard/tasks?view=${task.id}`
      }))
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}