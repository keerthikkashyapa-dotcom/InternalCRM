-- ULTIMATE RECURSION-FREE FIX FOR PROFILES TABLE
-- This guarantees zero recursion by using only self-access policies

-- 1. NUKE ALL existing profile policies (complete reset)
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by workspace members" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_select" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_access" ON profiles;
DROP POLICY IF EXISTS "profiles_self_only" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_members" ON profiles;
DROP POLICY IF EXISTS "Allow users to see their own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_self_select" ON profiles;
DROP POLICY IF EXISTS "profiles_individual_access" ON profiles;

-- 2. CREATE ONLY SELF-ACCESS POLICIES (Absolutely No Recursion Possible)
-- Users can ONLY access their own profile record
CREATE POLICY "profiles_can_see_self" 
ON profiles FOR SELECT 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "profiles_can_insert_self" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_can_update_self" 
ON profiles FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "profiles_can_delete_self" 
ON profiles FOR DELETE 
TO authenticated 
USING (id = auth.uid());

-- 3. Create workspace if it doesn't exist
INSERT INTO workspaces (id, name)
VALUES ('77777777-7777-7777-7777-777777777777', 'Main Startup Workspace')
ON CONFLICT (id) DO NOTHING;

-- 4. Fix any profiles missing workspace linkage
UPDATE profiles 
SET workspace_id = '77777777-7777-7777-7777-777777777777'
WHERE workspace_id IS NULL 
OR workspace_id NOT IN (SELECT id FROM workspaces);

-- 5. Verify the complete fix worked
SELECT 
    'Applied Policies' as metric,
    COUNT(*) as count
FROM pg_policy 
WHERE polrelid = 'profiles'::regclass

UNION ALL

SELECT 
    'Total Profiles' as metric,
    COUNT(*) as count
FROM profiles

UNION ALL

SELECT 
    'Properly Linked Profiles' as metric,
    COUNT(*) as count
FROM profiles 
WHERE workspace_id IN (SELECT id FROM workspaces)

UNION ALL

SELECT 
    'Orphaned Profiles' as metric,
    COUNT(*) as count
FROM profiles 
WHERE workspace_id IS NULL 
OR workspace_id NOT IN (SELECT id FROM workspaces);

-- 6. Test policy functionality (should return your profile only)
-- Uncomment and run this with your actual user ID:
-- SELECT * FROM profiles WHERE id = auth.uid();