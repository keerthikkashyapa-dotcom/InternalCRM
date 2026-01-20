'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'

export async function getTeamHierarchy() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('workspace_id, role')
        .eq('id', user.id)
        .single()

    if (!profile?.workspace_id) return []

    // Only Admins and Managers can see full team hierarchy
    if (profile.role === 'team_member') return []

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

    // Managers cannot see Admins
    if (profile.role === 'manager') {
        query = query.neq('role', 'admin')
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching team hierarchy:', error)
        return []
    }

    return data || []
}

export async function getDashboardStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Get workspace_id
    const adminClient = await createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('workspace_id, role')
        .eq('id', user.id)
        .single()

    if (!profile?.workspace_id) return null

    const workspaceId = profile.workspace_id

    // 1. Total Customers - Using adminClient to bypass RLS
    const { count: customerCount } = await adminClient
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)

    // 2. Active Deals (Not Won/Lost) - Role-based filtering
    let dealsQuery = adminClient
        .from('deals')
        .select('*, customer:customers(full_name, company_name)')
        .eq('workspace_id', workspaceId)

    // Team Members only see deals they own
    if (profile.role === 'team_member') {
        dealsQuery = dealsQuery.eq('owner_id', user.id)
    }

    const { data: deals } = await dealsQuery

    const activeDeals = deals?.filter(d => d.stage !== 'Won' && d.stage !== 'Lost') || []
    const totalDealValue = deals?.reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 0
    const activeDealValue = activeDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 0

    // 3. Pending Tasks - Role-based filtering
    let tasksQuery = adminClient
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)
        .neq('status', 'Completed')

    // Team Members only see tasks assigned to them
    if (profile.role === 'team_member') {
        tasksQuery = tasksQuery.eq('assigned_to', user.id)
    }

    const { count: pendingTasks } = await tasksQuery

    // 4. Deals by Stage (for chart) - Role-based filtering already applied to deals
    const stages = ['New', 'Contacted', 'Negotiation', 'Won', 'Lost']
    const dealsByStage = stages.map(stage => ({
        name: stage,
        value: deals?.filter(d => d.stage === stage).length || 0,
        amount: deals?.filter(d => d.stage === stage).reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 0,
        deals: deals?.filter(d => d.stage === stage).map(d => ({
            id: d.id,
            name: d.name,
            value: d.value,
            customer: d.customer
        })) || []
    }))

    // 5. Recent Activity - Using adminClient to bypass RLS
    const { data: activities } = await adminClient
        .from('activity_logs')
        .select('*, user:profiles!user_id(full_name)')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(10)

    // 6. Team Productivity (Tasks completed per user)
    // Admin sees everyone, Manager sees everyone except other Admins, Team Member sees only themselves
    let teamQuery = adminClient
        .from('profiles')
        .select('id, full_name, role, tasks:tasks!assigned_to(id, status)')
        .eq('workspace_id', workspaceId)

    if (profile.role === 'manager') {
        teamQuery = teamQuery.neq('role', 'admin')
    } else if (profile.role === 'team_member') {
        teamQuery = teamQuery.eq('id', user.id)
    }

    const { data: teamProductivity } = await teamQuery

    const productivity = teamProductivity?.map(member => ({
        id: member.id,
        name: member.full_name,
        role: member.role,
        completed: (member.tasks as any[]).filter(t => t.status === 'Completed').length,
        total: (member.tasks as any[]).length
    })) || []

    return {
        totalCustomers: customerCount || 0,
        activeDealsCount: activeDeals.length,
        totalDealValue,
        activeDealValue,
        pendingTasksCount: pendingTasks || 0,
        dealsByStage,
        recentActivities: activities || [],
        teamProductivity: productivity,
        role: profile.role,
        userId: user.id
    }
}
