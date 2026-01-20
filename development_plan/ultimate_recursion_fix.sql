-- ULTIMATE RECURSION FIX (VERSION 3)
-- Run this in your Supabase SQL Editor to permanently fix the "infinite recursion" error.

-- 1. Create a helper function that bypasses RLS (SECURITY DEFINER)
-- This allows policies to look up your workspace without querying the profiles table recursively.
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

-- 2. Clean up ALL previous policies on ALL tables to ensure no leftovers
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('profiles', 'workspaces', 'customers', 'deals', 'tasks', 'activity_logs')) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- 3. Recreate clean, non-recursive SELECT policies

-- PROFILES
CREATE POLICY "profiles_select_self" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_select_workspace" ON profiles FOR SELECT TO authenticated USING (workspace_id = get_my_workspace());

-- WORKSPACES
CREATE POLICY "workspaces_select" ON workspaces FOR SELECT TO authenticated USING (id = get_my_workspace());

-- CUSTOMERS
CREATE POLICY "customers_select" ON customers FOR SELECT TO authenticated USING (workspace_id = get_my_workspace());

-- DEALS
CREATE POLICY "deals_select" ON deals FOR SELECT TO authenticated USING (workspace_id = get_my_workspace());

-- TASKS
CREATE POLICY "tasks_select" ON tasks FOR SELECT TO authenticated USING (workspace_id = get_my_workspace());

-- ACTIVITY LOGS
CREATE POLICY "activity_logs_select" ON activity_logs FOR SELECT TO authenticated USING (workspace_id = get_my_workspace());

-- 4. Recreate safe INSERT/UPDATE/DELETE policies (no subqueries)

-- PROFILES
CREATE POLICY "profiles_update_self" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_self" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- CUSTOMERS
CREATE POLICY "customers_insert" ON customers FOR INSERT TO authenticated WITH CHECK (workspace_id = get_my_workspace());
CREATE POLICY "customers_update" ON customers FOR UPDATE TO authenticated USING (workspace_id = get_my_workspace());
CREATE POLICY "customers_delete" ON customers FOR DELETE TO authenticated USING (workspace_id = get_my_workspace());

-- DEALS
CREATE POLICY "deals_insert" ON deals FOR INSERT TO authenticated WITH CHECK (workspace_id = get_my_workspace());
CREATE POLICY "deals_update" ON deals FOR UPDATE TO authenticated USING (workspace_id = get_my_workspace());
CREATE POLICY "deals_delete" ON deals FOR DELETE TO authenticated USING (workspace_id = get_my_workspace());

-- TASKS
CREATE POLICY "tasks_insert" ON tasks FOR INSERT TO authenticated WITH CHECK (workspace_id = get_my_workspace());
CREATE POLICY "tasks_update" ON tasks FOR UPDATE TO authenticated USING (workspace_id = get_my_workspace());
CREATE POLICY "tasks_delete" ON tasks FOR DELETE TO authenticated USING (workspace_id = get_my_workspace());

-- ACTIVITY LOGS
CREATE POLICY "activity_logs_insert" ON activity_logs FOR INSERT TO authenticated WITH CHECK (workspace_id = get_my_workspace());

-- WORKSPACES (Only allow insert during signup/setup)
CREATE POLICY "workspaces_insert" ON workspaces FOR INSERT TO authenticated WITH CHECK (true);
