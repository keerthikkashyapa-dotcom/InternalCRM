'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect(`/login?message=${error.message}`)
    }

    return redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const workspaceName = formData.get('workspaceName') as string
    const role = formData.get('role') as string || 'admin'

    const supabase = await createClient()

    // 1. Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (signUpError) {
        return redirect(`/signup?message=${signUpError.message}`)
    }

    if (data.user) {
        // 2. Create the Workspace using Admin Client to bypass RLS during setup
        const adminClient = await createAdminClient()

        // 3. Setup the Profile FIRST using Upsert (This will be linked to the user)
        // Add a small delay to ensure auth.user is fully propagated in Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { error: profileError } = await adminClient
            .from('profiles')
            .upsert({
                id: data.user.id,
                full_name: fullName,
                email: email,
                role: role,
            })

        if (profileError) {
            console.error('Profile setup error:', profileError)
            return redirect(`/signup?message=Failed to setup profile: ${profileError.message}`)
        }

        // 4. Create the Workspace
        const { data: workspace, error: workspaceError } = await adminClient
            .from('workspaces')
            .insert({ name: workspaceName })
            .select()
            .single()

        if (workspaceError) {
            console.error('Workspace creation error:', workspaceError)
            return redirect(`/signup?message=Failed to create workspace: ${workspaceError.message}`)
        }

        // 5. Update Profile with workspace_id
        await adminClient
            .from('profiles')
            .update({ workspace_id: workspace.id })
            .eq('id', data.user.id)
    }

    return redirect('/login?message=Check your email to confirm your account')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/')
}

export async function requestPasswordReset(formData: FormData) {
    const email = (formData.get('email') as string)?.trim()
    const supabase = await createClient()
    const headerList = await headers()
    const origin = headerList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
        return redirect(`/forgot-password?message=${error.message}`)
    }

    return redirect('/forgot-password?message=Password reset link sent to your email')
}

export async function updatePassword(formData: FormData) {
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: password,
    })

    if (error) {
        return redirect(`/reset-password?message=${error.message}`)
    }

    return redirect('/login?message=Password updated successfully. Please sign in.')
}
