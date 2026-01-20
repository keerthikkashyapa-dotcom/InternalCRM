-- RLS RECURSION NUCLEAR FIX V2
-- Run this in your Supabase SQL Editor to resolve "infinite recursion" on profiles

-- 1. Create the helper function with SECURITY DEFINER
-- This allows the function to bypass RLS when looking up the workspace_id
CREATE OR REPLACE FUNCTION get_my_workspace()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT workspace_id FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2. Drop EVERY POSSIBLE policy on profiles to start clean
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_access" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_select" ON profiles;
DROP POLICY IF EXISTS "profiles_individual_access" ON profiles;
DROP POLICY IF EXISTS "profiles_self_select" ON profiles;
DROP POLICY IF EXISTS "Allow users to see their own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by workspace members" ON profiles;

-- 3. Re-create clean, non-recursive policies
-- Always allow users to see their own data directly
CREATE POLICY "profiles_self_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Use the security-defined function for workspace-wide visibility
CREATE POLICY "profiles_workspace_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());

-- 4. Clean up other tables too
-- Customers
DROP POLICY IF EXISTS "Users can view customers in their workspace" ON customers;
DROP POLICY IF EXISTS "customers_workspace_select" ON customers;
CREATE POLICY "customers_workspace_select" ON customers FOR SELECT TO authenticated USING (workspace_id = get_my_workspace());

-- Deals
DROP POLICY IF EXISTS "Users can view deals in their workspace" ON deals;
DROP POLICY IF EXISTS "deals_workspace_select" ON deals;
CREATE POLICY "deals_workspace_select" ON deals FOR SELECT TO authenticated USING (workspace_id = get_my_workspace());

-- Tasks
DROP POLICY IF EXISTS "Users can view tasks in their workspace" ON tasks;
DROP POLICY IF EXISTS "tasks_workspace_select" ON tasks;
CREATE POLICY "tasks_workspace_select" ON tasks FOR SELECT TO authenticated USING (workspace_id = get_my_workspace());

-- Workspaces
DROP POLICY IF EXISTS "Users can view their own workspace" ON workspaces;
DROP POLICY IF EXISTS "workspaces_select" ON workspaces;
CREATE POLICY "workspaces_select" ON workspaces FOR SELECT TO authenticated USING (id = get_my_workspace());
