-- Add Insert policy for Workspaces
-- Using a permissive policy for now to allow signup flow to create the workspace
CREATE POLICY "Enable insert for authenticated users only" 
ON workspaces FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Add Update policy for Workspaces (if needed)
CREATE POLICY "Users can update their own workspace"
ON workspaces FOR UPDATE
USING (id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- Add Insert policy for Profiles
-- This allows the server action to create the profile after signup
CREATE POLICY "Enable insert for users own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Add Update policy for Profiles (ensure it's robust)
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
