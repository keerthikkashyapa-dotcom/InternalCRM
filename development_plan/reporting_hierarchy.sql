-- Add manager_id to profiles for reporting hierarchy
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_manager ON profiles(manager_id);
