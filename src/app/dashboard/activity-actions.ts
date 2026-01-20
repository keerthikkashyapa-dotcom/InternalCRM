'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'

export async function logActivity(data: {
    entity_type: 'customer' | 'deal' | 'task' | 'media';
    entity_id: string;
    action: 'created' | 'updated' | 'deleted' | 'status_change' | 'uploaded';
    details?: any;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get workspace_id
    const adminClient = await createAdminClient();
    const { data: profile } = await adminClient
        .from('profiles')
        .select('workspace_id')
        .eq('id', user.id)
        .single();

    if (!profile?.workspace_id) return;

    await adminClient.from('activity_logs').insert({
        workspace_id: profile.workspace_id,
        user_id: user.id,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        action: data.action,
        details: data.details
    });
}
