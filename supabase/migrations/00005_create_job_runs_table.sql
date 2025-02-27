-- Create job_runs table
CREATE TABLE IF NOT EXISTS job_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transformation_id UUID REFERENCES transformations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued',
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  rows_processed INTEGER,
  logs TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_job_runs_user_id ON job_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_job_runs_transformation_id ON job_runs(transformation_id);
CREATE INDEX IF NOT EXISTS idx_job_runs_status ON job_runs(status);

-- Create a type for job status
CREATE TYPE job_status AS ENUM ('queued', 'running', 'completed', 'failed', 'cancelled');

-- Set up Row Level Security (RLS)
ALTER TABLE job_runs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own job runs
CREATE POLICY "Users can view own job runs" ON job_runs
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own job runs
CREATE POLICY "Users can insert own job runs" ON job_runs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own job runs
CREATE POLICY "Users can update own job runs" ON job_runs
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own job runs
CREATE POLICY "Users can delete own job runs" ON job_runs
  FOR DELETE USING (auth.uid() = user_id);

-- Create a trigger to set updated_at
CREATE OR REPLACE FUNCTION update_job_run_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_runs_updated_at
BEFORE UPDATE ON job_runs
FOR EACH ROW
EXECUTE FUNCTION update_job_run_updated_at();