-- Create a custom type for deal stage
CREATE TYPE deal_stage AS ENUM ('New', 'Contacted', 'Negotiation', 'Won', 'Lost');

-- Create deals table
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  value NUMERIC(15, 2) DEFAULT 0,
  stage deal_stage NOT NULL DEFAULT 'New',
  close_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Deals
DROP POLICY IF EXISTS "deals_workspace_select" ON deals;
DROP POLICY IF EXISTS "Users can view deals in their workspace" ON deals;
CREATE POLICY "deals_workspace_select" 
ON deals FOR SELECT 
TO authenticated
USING (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "deals_workspace_insert" ON deals;
DROP POLICY IF EXISTS "Users can insert deals in their workspace" ON deals;
CREATE POLICY "deals_workspace_insert" 
ON deals FOR INSERT 
TO authenticated
WITH CHECK (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "deals_workspace_update" ON deals;
DROP POLICY IF EXISTS "Users can update deals in their workspace" ON deals;
CREATE POLICY "deals_workspace_update" 
ON deals FOR UPDATE 
TO authenticated
USING (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "deals_workspace_delete" ON deals;
DROP POLICY IF EXISTS "Users can delete deals in their workspace" ON deals;
CREATE POLICY "deals_workspace_delete" 
ON deals FOR DELETE 
TO authenticated
USING (workspace_id = get_my_workspace());

-- Indexing for performance
CREATE INDEX idx_deals_workspace ON deals(workspace_id);
CREATE INDEX idx_deals_customer ON deals(customer_id);
CREATE INDEX idx_deals_stage ON deals(stage);

-- Trigger for updated_at
CREATE TRIGGER on_deal_updated
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
