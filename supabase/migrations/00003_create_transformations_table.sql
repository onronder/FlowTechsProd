-- Create transformations table
CREATE TABLE IF NOT EXISTS transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  transformation_config JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add an index on user_id to speed up user-specific queries
CREATE INDEX IF NOT EXISTS idx_transformations_user_id ON transformations(user_id);

-- Create a type for transformation status
CREATE TYPE transformation_status AS ENUM ('draft', 'active', 'paused', 'error');

-- Set up Row Level Security (RLS)
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own transformations
CREATE POLICY "Users can view own transformations" ON transformations
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own transformations
CREATE POLICY "Users can insert own transformations" ON transformations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own transformations
CREATE POLICY "Users can update own transformations" ON transformations
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own transformations
CREATE POLICY "Users can delete own transformations" ON transformations
  FOR DELETE USING (auth.uid() = user_id);

-- Create a trigger to set updated_at
CREATE OR REPLACE FUNCTION update_transformation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transformations_updated_at
BEFORE UPDATE ON transformations
FOR EACH ROW
EXECUTE FUNCTION update_transformation_updated_at();