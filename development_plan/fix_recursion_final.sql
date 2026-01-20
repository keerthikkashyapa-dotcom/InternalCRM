-- RLS Recursion Fix
-- This script creates a security-defined function to fetch workspace ID,
-- breaking the infinite recursion loop in the profiles table.

-- 1. Create a helper function that bypasses RLS
CREATE OR REPLACE FUNCTION get_my_workspace()
RETURNS UUID AS $$
  SELECT workspace_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 2. Update Profiles Policies
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_access" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_select" ON profiles;
DROP POLICY IF EXISTS "profiles_individual_access" ON profiles;
DROP POLICY IF EXISTS "profiles_self_select" ON profiles;

-- Users can always see their own profile
CREATE POLICY "profiles_self_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Users can see others in the same workspace (via the function)
CREATE POLICY "profiles_workspace_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());

-- 3. Update Workspaces Policies
DROP POLICY IF EXISTS "Users can view their own workspace" ON workspaces;
DROP POLICY IF EXISTS "workspaces_select" ON workspaces;
CREATE POLICY "workspaces_select" 
ON workspaces FOR SELECT 
TO authenticated 
USING (id = get_my_workspace());

-- 4. Update Customers Policies
DROP POLICY IF EXISTS "Users can view customers for their workspace" ON customers;
DROP POLICY IF EXISTS "customers_workspace_select" ON customers;
CREATE POLICY "customers_workspace_select" 
ON customers FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());

-- 5. Update Tasks Policies
DROP POLICY IF EXISTS "Users can view tasks in their workspace" ON tasks;
DROP POLICY IF EXISTS "tasks_workspace_select" ON tasks;
CREATE POLICY "tasks_workspace_select" 
ON tasks FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());

-- 6. Update Activity Logs Policies
DROP POLICY IF EXISTS "Users can view activity logs in their workspace" ON activity_logs;
DROP POLICY IF EXISTS "activity_logs_workspace_select" ON activity_logs;
CREATE POLICY "activity_logs_workspace_select" 
ON activity_logs FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());
