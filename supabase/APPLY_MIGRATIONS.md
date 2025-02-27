# Applying Database Migrations to Supabase

This guide explains how to apply our database migrations to your Supabase project.

## Option 1: Using the Supabase SQL Editor (Recommended for first-time setup)

1. Log in to your Supabase dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Select your FlowTechs project
3. Navigate to the SQL Editor in the left sidebar
4. Click "New Query" to create a new SQL query
5. Copy the content of each migration file and execute them in order

Here are the SQL statements to run (you can copy and paste these directly):

```sql
-- From supabase/migrations/00_create_profiles_table.sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Set up trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- From supabase/migrations/01_create_sources_table.sql
CREATE TYPE source_type AS ENUM ('shopify', 'woocommerce', 'bigcommerce', 'custom');
CREATE TYPE source_status AS ENUM ('active', 'inactive', 'error');

CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type source_type NOT NULL,
  credentials JSONB NOT NULL,
  status source_status DEFAULT 'inactive',
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
CREATE POLICY "Users can view their own sources" ON sources
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sources" ON sources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sources" ON sources
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sources" ON sources
  FOR DELETE USING (auth.uid() = user_id);

-- Set up trigger for updated_at
CREATE TRIGGER update_sources_updated_at
BEFORE UPDATE ON sources
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- From supabase/migrations/02_create_transformations_table.sql
CREATE TYPE transformation_type AS ENUM ('product', 'order', 'customer', 'custom');
CREATE TYPE transformation_status AS ENUM ('active', 'inactive', 'error');

CREATE TABLE IF NOT EXISTS transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type transformation_type NOT NULL,
  config JSONB NOT NULL,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  status transformation_status DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
CREATE POLICY "Users can view their own transformations" ON transformations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transformations" ON transformations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transformations" ON transformations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transformations" ON transformations
  FOR DELETE USING (auth.uid() = user_id);

-- Set up trigger for updated_at
CREATE TRIGGER update_transformations_updated_at
BEFORE UPDATE ON transformations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- From supabase/migrations/03_create_destinations_table.sql
CREATE TYPE destination_type AS ENUM ('shopify', 'woocommerce', 'bigcommerce', 'csv', 'json', 'custom');
CREATE TYPE destination_status AS ENUM ('active', 'inactive', 'error');

CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type destination_type NOT NULL,
  credentials JSONB NOT NULL,
  status destination_status DEFAULT 'inactive',
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
CREATE POLICY "Users can view their own destinations" ON destinations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own destinations" ON destinations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own destinations" ON destinations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own destinations" ON destinations
  FOR DELETE USING (auth.uid() = user_id);

-- Set up trigger for updated_at
CREATE TRIGGER update_destinations_updated_at
BEFORE UPDATE ON destinations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- From supabase/migrations/04_create_job_runs_table.sql
CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS job_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transformation_id UUID REFERENCES transformations(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  status job_status DEFAULT 'pending',
  result JSONB,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE job_runs ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
CREATE POLICY "Users can view their own job runs" ON job_runs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job runs" ON job_runs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update any job run" ON job_runs
  FOR UPDATE USING (true);
```

## Option 2: Using the Supabase CLI (Advanced)

If you prefer using the CLI, follow these steps:

1. Install the Supabase CLI if you haven't already:
```bash
npm install -g supabase
```

2. Log in to Supabase:
```bash
supabase login
```

3. Link your project (replace with your project ID):
```bash
supabase link --project-ref <YOUR_PROJECT_ID>
```

4. Push the migrations:
```bash
supabase db push
```

## After Running Migrations

Once the migrations are successfully applied, verify that the tables have been created:

1. In the Supabase dashboard, navigate to the "Table Editor" in the left sidebar
2. You should see the following tables:
   - `profiles`
   - `sources`
   - `transformations`
   - `destinations`
   - `job_runs`

## Troubleshooting

- If you encounter errors with the enum types, make sure each type is created only once.
- If a table already exists, the CREATE TABLE statement will be skipped due to the IF NOT EXISTS clause.
- For any other issues, check the SQL error message for details on what went wrong.

## Next Steps

After applying the migrations, you should:

1. [Configure Google OAuth](#google-oauth-setup) in your Supabase project
2. Test the authentication flows in your application
3. Create some test data to verify the data models work correctly