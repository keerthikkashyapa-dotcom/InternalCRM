import { createClient, createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({
        error: 'Not authenticated',
        authError: authError?.message
      })
    }

    // Check service role key
    const sKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const useAdmin = sKey && sKey.length > 50 && !sKey.includes('copy-from')
    
    // Try with regular client first
    const { data: profileRegular, error: profileErrorRegular } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Try with admin client
    let profileAdmin = null
    let profileErrorAdmin = null
    
    if (useAdmin) {
      try {
        const adminClient = await createAdminClient()
        const { data, error } = await adminClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        profileAdmin = data
        profileErrorAdmin = error
      } catch (e) {
        profileErrorAdmin = e instanceof Error ? e.message : 'Admin client error'
      }
    }

    return NextResponse.json({
      userId: user.id,
      userEmail: user.email,
      serviceRoleAvailable: useAdmin,
      profileRegular: {
        data: profileRegular,
        error: profileErrorRegular?.message
      },
      profileAdmin: {
        data: profileAdmin,
        error: profileErrorAdmin
      }
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}