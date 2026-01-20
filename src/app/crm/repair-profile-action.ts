'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'

export async function repairUserProfile() {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { error: 'Not authenticated' }
    }

    // Check if service role key is available
    const sKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const useAdmin = sKey && sKey.length > 50 && !sKey.includes('copy-from')
    
    const client = useAdmin ? await createAdminClient() : supabase

    // First, check if profile exists
    const { data: existingProfile, error: fetchError } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (fetchError) {
      return { error: `Failed to check profile: ${fetchError.message}` }
    }

    // If no profile exists, create one
    if (!existingProfile) {
      // First ensure a default workspace exists
      const { data: workspace, error: workspaceError } = await client
        .from('workspaces')
        .select('id')
        .eq('id', '77777777-7777-7777-7777-777777777777')
        .maybeSingle()

      if (workspaceError) {
        return { error: `Workspace check failed: ${workspaceError.message}` }
      }

      // Create default workspace if it doesn't exist
      if (!workspace) {
        const { error: createWorkspaceError } = await client
          .from('workspaces')
          .insert({
            id: '77777777-7777-7777-7777-777777777777',
            name: 'Main Startup Workspace'
          })

        if (createWorkspaceError) {
          return { error: `Failed to create workspace: ${createWorkspaceError.message}` }
        }
      }

      // Create the profile
      const { error: createProfileError } = await client
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'User',
          role: 'admin',
          workspace_id: '77777777-7777-7777-7777-777777777777'
        })

      if (createProfileError) {
        return { error: `Failed to create profile: ${createProfileError.message}` }
      }

      return { success: true, message: 'Profile created successfully' }
    }

    // If profile exists but has no workspace_id, fix it
    if (existingProfile && !existingProfile.workspace_id) {
      const { error: updateError } = await client
        .from('profiles')
        .update({ workspace_id: '77777777-7777-7777-7777-777777777777' })
        .eq('id', user.id)

      if (updateError) {
        return { error: `Failed to update profile: ${updateError.message}` }
      }

      return { success: true, message: 'Profile workspace linked successfully' }
    }

    return { success: true, message: 'Profile is already properly configured' }

  } catch (error) {
    return { 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}