-- WARNING: This will drop existing tables and data!
-- Only use for fresh setup or if you want to reset your DB.

DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Create a custom type for user roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'team_member');

-- Create workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'team_member',
  manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Workspaces
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

CREATE POLICY "workspaces_select"
ON workspaces FOR SELECT
TO authenticated
USING (id = get_my_workspace());

-- RLS Policies for Profiles
DROP POLICY IF EXISTS "profiles_self_select" ON profiles;
CREATE POLICY "profiles_self_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_workspace_select" ON profiles;
CREATE POLICY "profiles_workspace_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "profiles_self_update" ON profiles;
CREATE POLICY "profiles_self_update"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'team_member');
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new user signup (Optional: only if auth.users access is granted)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- Note: auth.users is in the auth schema, permission might vary.
-- In Supabase dashboard, this usually works.
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
