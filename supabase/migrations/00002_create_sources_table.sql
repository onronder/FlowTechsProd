-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  credentials JSONB NOT NULL,
  connection_status TEXT NOT NULL DEFAULT 'pending',
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add an index on user_id to speed up user-specific queries
CREATE INDEX IF NOT EXISTS idx_sources_user_id ON sources(user_id);

-- Create a type for source types
CREATE TYPE source_type AS ENUM ('shopify', 'woocommerce', 'bigcommerce', 'custom');

-- Set up Row Level Security (RLS)
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own sources
CREATE POLICY "Users can view own sources" ON sources
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own sources
CREATE POLICY "Users can insert own sources" ON sources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own sources
CREATE POLICY "Users can update own sources" ON sources
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own sources
CREATE POLICY "Users can delete own sources" ON sources
  FOR DELETE USING (auth.uid() = user_id);

-- Create a trigger to set updated_at
CREATE OR REPLACE FUNCTION update_source_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sources_updated_at
BEFORE UPDATE ON sources
FOR EACH ROW
EXECUTE FUNCTION update_source_updated_at();