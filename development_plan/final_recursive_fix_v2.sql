-- FINAL RLS RECURSION FIX (VERSION 2)
-- This script is designed to definitively solve the "infinite recursion" error.

-- 1. Create a SECURITY DEFINER function to bypass RLS
-- We use plpgsql for more robust execution and set an explicit SEARCH PATH.
CREATE OR REPLACE FUNCTION public.get_my_workspace()
RETURNS UUID 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid());
END;
$$;

-- 2. Drop ALL policies on ALL tables to start from a clean state
-- Profiles
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_access" ON profiles;
DROP POLICY IF EXISTS "profiles_workspace_select" ON profiles;
DROP POLICY IF EXISTS "profiles_individual_access" ON profiles;
DROP POLICY IF EXISTS "profiles_self_select" ON profiles;
DROP POLICY IF EXISTS "Allow users to see their own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by workspace members" ON profiles;

-- Workspaces
DROP POLICY IF EXISTS "Users can view their own workspace" ON workspaces;
DROP POLICY IF EXISTS "workspaces_select" ON workspaces;

-- Customers
DROP POLICY IF EXISTS "Users can view customers in their workspace" ON customers;
DROP POLICY IF EXISTS "customers_workspace_select" ON customers;
DROP POLICY IF EXISTS "Users can insert customers for their workspace" ON customers;
DROP POLICY IF EXISTS "customers_workspace_insert" ON customers;

-- Deals
DROP POLICY IF EXISTS "Users can view deals in their workspace" ON deals;
DROP POLICY IF EXISTS "deals_workspace_select" ON deals;

-- Tasks
DROP POLICY IF EXISTS "Users can view tasks in their workspace" ON tasks;
DROP POLICY IF EXISTS "tasks_workspace_select" ON tasks;

-- Activity Logs
DROP POLICY IF EXISTS "Users can view activity logs in their workspace" ON activity_logs;
DROP POLICY IF EXISTS "activity_logs_workspace_select" ON activity_logs;

-- 3. Recreate clean, non-recursive policies using the helper function

-- PROFILES: This is where the recursion happened.
-- Policy: You can see yourself.
CREATE POLICY "profiles_self_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Policy: You can see others in your workspace (using the function to bypass recursion).
CREATE POLICY "profiles_workspace_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());

-- WORKSPACES
CREATE POLICY "workspaces_select" 
ON workspaces FOR SELECT 
TO authenticated 
USING (id = get_my_workspace());

-- CUSTOMERS
CREATE POLICY "customers_select" 
ON customers FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());

-- DEALS
CREATE POLICY "deals_select" 
ON deals FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());

-- TASKS
CREATE POLICY "tasks_select" 
ON tasks FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());

-- ACTIVITY LOGS
CREATE POLICY "activity_logs_select" 
ON activity_logs FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());

-- 4. Ensure INSERT/UPDATE policies are also safe (no subqueries)
CREATE POLICY "profiles_self_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "customers_insert" ON customers FOR INSERT TO authenticated WITH CHECK (workspace_id = get_my_workspace());
CREATE POLICY "deals_insert" ON deals FOR INSERT TO authenticated WITH CHECK (workspace_id = get_my_workspace());
CREATE POLICY "tasks_insert" ON tasks FOR INSERT TO authenticated WITH CHECK (workspace_id = get_my_workspace());
CREATE POLICY "activity_logs_insert" ON activity_logs FOR INSERT TO authenticated WITH CHECK (workspace_id = get_my_workspace());
