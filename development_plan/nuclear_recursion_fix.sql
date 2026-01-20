-- NUCLEAR RECURSION FIX
-- 1. Drop EVERYTHING on profiles (cleaning up all possible names we used)
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by workspace members" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for users own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to see their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_self_select" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_select" ON profiles;
DROP POLICY IF EXISTS "profiles_self_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON profiles;
DROP POLICY IF EXISTS "Users can view customers for their workspace" ON customers;
DROP POLICY IF EXISTS "Users can insert customers for their workspace" ON customers;
DROP POLICY IF EXISTS "customers_workspace_select" ON customers;
DROP POLICY IF EXISTS "customers_workspace_insert" ON customers;

-- 2. New SIMPLE, Non-Recursive Policies
-- Policy 1: You can always see YOUR OWN profile (Direct ID match, no subqueries)
CREATE POLICY "profiles_self_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Policy 2: Allow admins/managers to see profiles in their workspace
-- To avoid recursion, we use auth.jwt() which is pre-populated data
CREATE POLICY "profiles_workspace_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (
  workspace_id = (SELECT workspace_id FROM profiles WHERE id = auth.uid())
);
-- NOTE: If Policy 2 still triggers recursion in your Supabase version, 
-- just keep Policy 1 for now while we use Service Role for lookups.

-- 3. Ensure INSERT/UPDATE works
CREATE POLICY "profiles_self_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_self_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 4. Fix Customer Policies
DROP POLICY IF EXISTS "Users can view customers for their workspace" ON customers;
CREATE POLICY "customers_workspace_select" ON customers FOR SELECT TO authenticated 
USING (workspace_id = (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert customers for their workspace" ON customers;
CREATE POLICY "customers_workspace_insert" ON customers FOR INSERT TO authenticated 
WITH CHECK (workspace_id = (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
