-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  destination_type TEXT NOT NULL,
  connection_config JSONB NOT NULL,
  connection_status TEXT NOT NULL DEFAULT 'pending',
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add an index on user_id to speed up user-specific queries
CREATE INDEX IF NOT EXISTS idx_destinations_user_id ON destinations(user_id);

-- Create a type for destination types
CREATE TYPE destination_type AS ENUM ('shopify', 'postgres', 'mysql', 'bigquery', 'snowflake', 'csv', 'api_endpoint');

-- Set up Row Level Security (RLS)
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own destinations
CREATE POLICY "Users can view own destinations" ON destinations
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own destinations
CREATE POLICY "Users can insert own destinations" ON destinations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own destinations
CREATE POLICY "Users can update own destinations" ON destinations
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own destinations
CREATE POLICY "Users can delete own destinations" ON destinations
  FOR DELETE USING (auth.uid() = user_id);

-- Create a trigger to set updated_at
CREATE OR REPLACE FUNCTION update_destination_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_destinations_updated_at
BEFORE UPDATE ON destinations
FOR EACH ROW
EXECUTE FUNCTION update_destination_updated_at();