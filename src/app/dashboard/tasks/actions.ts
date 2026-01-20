'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '../activity-actions'

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
    id: string;
    workspace_id: string;
    customer_id?: string;
    deal_id?: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigned_to?: string;
    due_date?: string;
    created_at: string;
    assignee?: {
        full_name: string;
    };
}

export interface ActivityLog {
    id: string;
    workspace_id: string;
    user_id: string;
    entity_type: string;
    entity_id: string;
    action: string;
    details: any;
    created_at: string;
    user?: {
        full_name: string;
    };
}

// Internal helper to get workspace_id
async function getWorkspaceId(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const adminClient = await createAdminClient();
    const { data: profile } = await adminClient
        .from('profiles')
        .select('workspace_id')
        .eq('id', user.id)
        .single();

    return profile?.workspace_id;
}

export async function getTasks(filters?: { customerId?: string; dealId?: string; assignedToMe?: boolean }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const workspace_id = await getWorkspaceId(supabase);
    if (!workspace_id) return [];

    const adminClient = await createAdminClient();
    
    // Get user's role for filtering
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    let query = adminClient
        .from('tasks')
        .select('*, assignee:profiles(full_name)')
        .eq('workspace_id', workspace_id);

    if (filters?.customerId) query = query.eq('customer_id', filters.customerId);
    if (filters?.dealId) query = query.eq('deal_id', filters.dealId);
    if (filters?.assignedToMe) query = query.eq('assigned_to', user.id);
    
    // Team Members only see tasks assigned to them (unless explicitly filtered)
    if (profile?.role === 'team_member' && !filters?.assignedToMe) {
        query = query.eq('assigned_to', user.id);
    }

    const { data, error } = await query.order('due_date', { ascending: true, nullsFirst: false });

    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }

    return data as Task[];
}

export async function createTask(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const workspace_id = await getWorkspaceId(supabase);
    if (!workspace_id) return { error: 'Workspace not found' };

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as TaskPriority;
    const customer_id = formData.get('customer_id') as string;
    const deal_id = formData.get('deal_id') as string;
    const assigned_to = formData.get('assigned_to') as string;
    const due_date = formData.get('due_date') as string;

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient.from('tasks').insert({
        workspace_id,
        title,
        description,
        priority,
        customer_id: customer_id || null,
        deal_id: deal_id || null,
        assigned_to: assigned_to || user.id,
        due_date: due_date || null
    }).select().single();

    if (error) return { error: error.message };

    // Log activity
    await logActivity({
        entity_type: 'task',
        entity_id: data.id,
        action: 'created',
        details: { title }
    });

    revalidatePath('/dashboard/tasks');
    return { success: true };
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
    const supabase = await createClient();
    const workspace_id = await getWorkspaceId(supabase);
    if (!workspace_id) return { error: 'Workspace not found' };

    const adminClient = await createAdminClient();
    const { error } = await adminClient
        .from('tasks')
        .update({ status })
        .eq('id', id)
        .eq('workspace_id', workspace_id);

    if (error) return { error: error.message };

    await logActivity({
        entity_type: 'task',
        entity_id: id,
        action: 'status_change',
        details: { new_status: status }
    });

    revalidatePath('/dashboard/tasks');
    return { success: true };
}

export async function deleteTask(id: string) {
    const supabase = await createClient();
    const workspace_id = await getWorkspaceId(supabase);
    if (!workspace_id) return { error: 'Workspace not found' };

    const adminClient = await createAdminClient();
    const { error } = await adminClient
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('workspace_id', workspace_id);

    if (error) return { error: error.message };

    revalidatePath('/dashboard/tasks');
    return { success: true };
}

export async function getActivityTimeline(customerId: string) {
    const supabase = await createClient();
    const workspace_id = await getWorkspaceId(supabase);
    if (!workspace_id) return [];

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient
        .from('activity_logs')
        .select('*, user:profiles!user_id(full_name)')
        .eq('workspace_id', workspace_id)
        .eq('entity_id', customerId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching timeline:', error);
        return [];
    }

    return data as ActivityLog[];
}

export async function getTeamMembers() {
    const supabase = await createClient();
    const workspaceId = await getWorkspaceId(supabase);
    if (!workspaceId) return [];

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient
        .from('profiles')
        .select('id, full_name, role, email')
        .eq('workspace_id', workspaceId)
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Error fetching team members:', error);
        return [];
    }

    return data;
}
