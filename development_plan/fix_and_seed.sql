-- 1. Fix Profile SELECT Policy (Avoid recursion)
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
CREATE POLICY "Profiles are viewable by workspace members"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id -- You can always see your own profile
  OR 
  workspace_id IN (
    -- Subquery to get current user's workspace_id WITHOUT joining profiles again
    SELECT workspace_id FROM profiles WHERE id = auth.uid()
  )
);

-- 2. Ensure Insert Policies for Onboarding
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON workspaces;
CREATE POLICY "Authenticated users can create workspaces" 
ON workspaces FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable insert for users own profile" ON profiles;
CREATE POLICY "Users can create their own profile" 
ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 3. SEEDING (Run this only if you want to fix existing demo users)
-- Create a default demo workspace if it doesn't exist
INSERT INTO workspaces (id, name)
VALUES ('00000000-0000-0000-0000-000000000000', 'Demo Workspace')
ON CONFLICT (id) DO NOTHING;

-- Link ANY user that doesn't have a workspace to this Demo Workspace
-- Note: Replace 'admin@demo.com' with the IDs from your Auth dashboard if needed,
-- or just run this broad update for convenience during development:
UPDATE profiles 
SET workspace_id = '00000000-0000-0000-0000-000000000000'
WHERE workspace_id IS NULL;
