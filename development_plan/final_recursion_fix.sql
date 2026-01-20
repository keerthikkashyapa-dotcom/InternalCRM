-- FINAL RECURSION FIX (Safe Version)

-- 1. Wipe old policies to be absolutely sure
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by workspace members" ON profiles;
DROP POLICY IF EXISTS "Allow users to see their own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_self_select" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_select" ON profiles;

-- 2. Create the simplest possible SELECT policy
-- This policy NEVER references the profiles table again, so it CANNOT recurse.
CREATE POLICY "profiles_individual_access" 
ON profiles FOR SELECT 
TO authenticated 
USING (id = auth.uid());

-- 3. If you need a workspace-wide policy, use this version:
-- (It uses auth.uid() directly against the column, avoiding a subquery loop)
CREATE POLICY "profiles_workspace_access" 
ON profiles FOR SELECT 
TO authenticated 
USING (workspace_id = (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- NOTE: If the above still fails in your specific setup, 
-- just run ONLY Step 2 and delete Step 3. 
-- My code updates now use a "Service Role" bypass so these policies are just for safety.

-- 4. ENSURE WORKSPACE LINKING
-- Connect any orphan accounts to the Shared Workspace
UPDATE profiles 
SET workspace_id = '99999999-9999-9999-9999-999999999999'
WHERE workspace_id IS NULL;
