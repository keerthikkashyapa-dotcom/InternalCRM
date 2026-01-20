-- QUICK FIX SCRIPT FOR PROFILE CONNECTION ISSUES
-- Run this in your Supabase SQL Editor

-- 1. Create the default workspace if it doesn't exist
INSERT INTO public.workspaces (id, name)
VALUES ('77777777-7777-7777-7777-777777777777', 'Main Startup Workspace')
ON CONFLICT (id) DO NOTHING;

-- 2. Create missing profiles for all auth users
-- This will create profiles for users who signed up but don't have database records
INSERT INTO public.profiles (id, email, full_name, role, workspace_id)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'User'), 
    'admin', 
    '77777777-7777-7777-7777-777777777777'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO UPDATE 
SET workspace_id = EXCLUDED.workspace_id
WHERE profiles.workspace_id IS NULL;

-- 3. Ensure all existing profiles have a workspace_id
UPDATE public.profiles 
SET workspace_id = '77777777-7777-7777-7777-777777777777'
WHERE workspace_id IS NULL;

-- 4. Verify the fix worked
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.workspace_id,
    w.name as workspace_name
FROM public.profiles p
LEFT JOIN public.workspaces w ON p.workspace_id = w.id
WHERE p.id IN (SELECT id FROM auth.users)
ORDER BY p.created_at DESC
LIMIT 10;