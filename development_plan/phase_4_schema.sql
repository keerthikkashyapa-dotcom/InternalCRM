-- Create media_attachments table
CREATE TABLE IF NOT EXISTS media_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in Supabase Storage
  file_type TEXT,
  file_size BIGINT,
  uploader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE media_attachments ENABLE ROW LEVEL SECURITY;

-- Policies for media_attachments
DROP POLICY IF EXISTS "Users can view attachments in their workspace" ON media_attachments;
CREATE POLICY "media_workspace_select"
ON media_attachments FOR SELECT
TO authenticated
USING (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "Users can insert attachments in their workspace" ON media_attachments;
CREATE POLICY "media_workspace_insert"
ON media_attachments FOR INSERT
TO authenticated
WITH CHECK (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "Users can delete attachments in their workspace" ON media_attachments;
CREATE POLICY "media_workspace_delete"
ON media_attachments FOR DELETE
TO authenticated
USING (workspace_id = get_my_workspace());

-- Indexing
CREATE INDEX IF NOT EXISTS idx_media_workspace ON media_attachments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_media_customer ON media_attachments(customer_id);
CREATE INDEX IF NOT EXISTS idx_media_deal ON media_attachments(deal_id);
