-- Create a custom type for customer status
CREATE TYPE customer_status AS ENUM ('lead', 'active', 'closed');

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  status customer_status NOT NULL DEFAULT 'lead',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Customers
DROP POLICY IF EXISTS "customers_select" ON customers;
DROP POLICY IF EXISTS "Users can view customers in their workspace" ON customers;
CREATE POLICY "customers_select" 
ON customers FOR SELECT 
TO authenticated
USING (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "customers_insert" ON customers;
DROP POLICY IF EXISTS "Users can insert customers in their workspace" ON customers;
CREATE POLICY "customers_insert" 
ON customers FOR INSERT 
TO authenticated
WITH CHECK (workspace_id = get_my_workspace());

DROP POLICY IF EXISTS "customers_update" ON customers;
DROP POLICY IF EXISTS "Users can update customers in their workspace" ON customers;
CREATE POLICY "customers_update" 
ON customers FOR UPDATE 
TO authenticated
USING (workspace_id = get_my_workspace());

-- Indexing for performance
CREATE INDEX idx_customers_workspace ON customers(workspace_id);
CREATE INDEX idx_customers_status ON customers(status);

-- Trigger for updated_at
CREATE TRIGGER on_customer_updated
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
