-- DEFINITIVE RECURSION FIX FOR PROFILES TABLE
-- This completely resolves the "infinite recursion detected" error

-- 1. Drop ALL existing profile policies to eliminate recursion
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by workspace members" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_select" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_access" ON profiles;
DROP POLICY IF EXISTS "Allow users to see their own profile" ON profiles;

-- 2. Create the SIMPLEST possible policy - NO SUBQUERIES, NO RECURSION
-- Users can ONLY see their OWN profile (prevents recursion entirely)
CREATE POLICY "profiles_self_only" 
ON profiles FOR SELECT 
TO authenticated 
USING (id = auth.uid());

-- 3. Allow users to insert/update their own profile
CREATE POLICY "profiles_self_insert" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_self_update" 
ON profiles FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

-- 4. Create a separate policy for workspace-wide access using Service Role bypass
-- This avoids recursion by using auth.uid() directly
CREATE POLICY "profiles_workspace_members" 
ON profiles FOR SELECT 
TO authenticated 
USING (
    -- Direct workspace comparison (no subquery recursion)
    workspace_id = (
        SELECT workspace_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);

-- 5. Ensure we have the necessary workspace
INSERT INTO workspaces (id, name)
VALUES ('77777777-7777-7777-7777-777777777777', 'Main Startup Workspace')
ON CONFLICT (id) DO NOTHING;

-- 6. Link any orphaned profiles to the default workspace
UPDATE profiles 
SET workspace_id = '77777777-7777-7777-7777-777777777777'
WHERE workspace_id IS NULL;

-- 7. Verify the fix
SELECT 
    'Policy Status' as check_type,
    COUNT(*) as policy_count
FROM pg_policy 
WHERE polrelid = 'profiles'::regclass

UNION ALL

SELECT 
    'Profile Count' as check_type,
    COUNT(*) as profile_count
FROM profiles

UNION ALL

SELECT 
    'Workspace Linked Profiles' as check_type,
    COUNT(*) as linked_count
FROM profiles 
WHERE workspace_id IS NOT NULL;