-- Add manager fields to workspaces table
ALTER TABLE workspaces 
ADD COLUMN IF NOT EXISTS manager_name TEXT,
ADD COLUMN IF NOT EXISTS manager_email TEXT,
ADD COLUMN IF NOT EXISTS manager_phone TEXT,
ADD COLUMN IF NOT EXISTS manager_title TEXT DEFAULT 'Manager',
ADD COLUMN IF NOT EXISTS manager_department TEXT DEFAULT 'Operations',
ADD COLUMN IF NOT EXISTS manager_location TEXT DEFAULT 'Head Office';

-- Update existing workspaces with default manager info from admin users
UPDATE workspaces 
SET 
    manager_name = COALESCE(manager_name, (
        SELECT full_name 
        FROM profiles 
        WHERE workspace_id = workspaces.id 
        AND role = 'admin' 
        LIMIT 1
    )),
    manager_email = COALESCE(manager_email, (
        SELECT email 
        FROM profiles 
        WHERE workspace_id = workspaces.id 
        AND role = 'admin' 
        LIMIT 1
    ))
WHERE manager_name IS NULL OR manager_email IS NULL;