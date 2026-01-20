-- Phase 5: Tasks & Activity Logs

-- Task Status Enum
DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('Pending', 'In Progress', 'Completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Task Priority Enum
DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('Low', 'Medium', 'High');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'Pending',
    priority task_priority NOT NULL DEFAULT 'Medium',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL, -- 'customer', 'deal', 'task', 'media'
    entity_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'status_change', etc.
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Tasks
DROP POLICY IF EXISTS "tasks_workspace_select" ON tasks;
DROP POLICY IF EXISTS "Users can view tasks in their workspace" ON tasks;
CREATE POLICY "tasks_workspace_select"
ON tasks FOR SELECT
USING (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "tasks_workspace_insert" ON tasks;
DROP POLICY IF EXISTS "Users can insert tasks in their workspace" ON tasks;
CREATE POLICY "tasks_workspace_insert"
ON tasks FOR INSERT
WITH CHECK (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "tasks_workspace_update" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks in their workspace" ON tasks;
CREATE POLICY "tasks_workspace_update"
ON tasks FOR UPDATE
USING (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "tasks_workspace_delete" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks in their workspace" ON tasks;
CREATE POLICY "tasks_workspace_delete"
ON tasks FOR DELETE
USING (workspace_id = get_my_workspace());

-- RLS Policies for Activity Logs
DROP POLICY IF EXISTS "activity_logs_workspace_select" ON activity_logs;
DROP POLICY IF EXISTS "Users can view activity logs in their workspace" ON activity_logs;
CREATE POLICY "activity_logs_workspace_select"
ON activity_logs FOR SELECT
USING (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "activity_logs_workspace_insert" ON activity_logs;
DROP POLICY IF EXISTS "Users can insert activity logs in their workspace" ON activity_logs;
CREATE POLICY "activity_logs_workspace_insert"
ON activity_logs FOR INSERT
WITH CHECK (workspace_id = get_my_workspace());

-- Indexing
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_customer ON tasks(customer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal ON tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);

CREATE INDEX IF NOT EXISTS idx_activity_workspace ON activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_logs(entity_type, entity_id);

-- Trigger for tasks updated_at
DROP TRIGGER IF EXISTS on_task_updated ON tasks;
CREATE TRIGGER on_task_updated
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
