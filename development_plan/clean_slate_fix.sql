-- EMERGENCY CLEAN SLATE FIX
-- 1. Remove all complex profile policies
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by workspace members" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for users own profile" ON profiles;

-- 2. Add the SINGLE simplest policy to allow you to see YOURSELF
-- This is what the 'Add Customer' button needs to find your workspace
CREATE POLICY "Allow users to see their own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 3. Ensure you can also UPDATE your own profile (for onboarding)
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Allow users to update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- 4. Create a shared workspace if none exists
INSERT INTO workspaces (id, name)
VALUES ('99999999-9999-9999-9999-999999999999', 'Shared Team Workspace')
ON CONFLICT (id) DO NOTHING;

-- 5. LINK ALL USERS TO THE SHARED WORKSPACE
-- This is the most important part to fix the "No workspace found" error!
UPDATE profiles 
SET workspace_id = '99999999-9999-9999-9999-999999999999'
WHERE workspace_id IS NULL;
