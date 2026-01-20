-- MASTER REPAIR & SEED SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Create a Default Workspace if it doesn't exist
INSERT INTO public.workspaces (id, name)
VALUES ('77777777-7777-7777-7777-777777777777', 'Main Startup Workspace')
ON CONFLICT (id) DO NOTHING;

-- 2. Create missing profiles for ALL existing Auth users
-- This handles users who signed up before the onboarding logic was complete
INSERT INTO public.profiles (id, email, full_name, role, workspace_id)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Member'), 
    'admin', 
    '77777777-7777-7777-7777-777777777777'
FROM auth.users
ON CONFLICT (id) DO UPDATE 
SET workspace_id = EXCLUDED.workspace_id
WHERE profiles.workspace_id IS NULL;

-- 3. Standardize Demo Accounts (Optional but recommended)
-- This ensures 'admin@demo.com', etc., are correctly linked
UPDATE public.profiles
SET workspace_id = '77777777-7777-7777-7777-777777777777'
WHERE email IN ('admin@demo.com', 'manager@demo.com', 'member@demo.com');

-- 4. Verify RLS for Customers (Allow Insert/Select/Update)
DROP POLICY IF EXISTS "Users can insert customers for their workspace" ON customers;
CREATE POLICY "Users can insert customers for their workspace"
ON customers FOR INSERT
TO authenticated
WITH CHECK (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can view customers for their workspace" ON customers;
CREATE POLICY "Users can view customers for their workspace"
ON customers FOR SELECT
TO authenticated
USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
