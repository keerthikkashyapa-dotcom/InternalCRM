import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Check if user has permission to update manager details
        const adminClient = await createAdminClient();
        const { data: profile } = await adminClient
            .from('profiles')
            .select('workspace_id, role')
            .eq('id', user.id)
            .single();

        if (!profile?.workspace_id) {
            return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
        }

        if (profile.role !== 'admin' && profile.role !== 'manager') {
            return NextResponse.json({ error: 'Only admins or managers can update manager details' }, { status: 403 });
        }

        // Parse form data
        const formData = await request.formData();
        const managerName = formData.get('manager_name') as string;
        const managerEmail = formData.get('manager_email') as string;
        const managerPhone = formData.get('manager_phone') as string;
        const managerTitle = formData.get('manager_title') as string;
        const managerDepartment = formData.get('manager_department') as string;
        const managerLocation = formData.get('manager_location') as string;

        // Update workspace with manager details
        const { error } = await supabase
            .from('workspaces')
            .update({
                manager_name: managerName,
                manager_email: managerEmail,
                manager_phone: managerPhone,
                manager_title: managerTitle,
                manager_department: managerDepartment,
                manager_location: managerLocation
            })
            .eq('id', profile.workspace_id);

        if (error) {
            console.error('Error updating manager details:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Manager details API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const adminClient = await createAdminClient();
        const url = new URL(request.url);
        const managerId = url.searchParams.get('manager_id');

        if (managerId) {
            // Fetch specific manager details
            const { data: manager } = await adminClient
                .from('profiles')
                .select(`
                    *,
                    workspace:workspaces(name, created_at)
                `)
                .eq('id', managerId)
                .single();

            if (!manager) {
                return NextResponse.json({ error: 'Manager not found' }, { status: 404 });
            }

            return NextResponse.json(manager);
        } else {
            // Get current user's profile with manager info
            const { data: profile } = await adminClient
                .from('profiles')
                .select(`
                    *,
                    workspace:workspaces(name, created_at)
                `)
                .eq('id', user.id)
                .single();

            if (!profile) {
                return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
            }

            return NextResponse.json(profile);
        }

    } catch (error) {
        console.error('Get manager details API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}