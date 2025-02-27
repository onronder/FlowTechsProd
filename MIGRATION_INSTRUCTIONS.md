# Fix for Database Profile Creation Error

## The Problem

The "Database error saving new user" error occurs because the default Supabase trigger for creating user profiles is failing. This trigger is executed when a new user signs up through OAuth (like Google authentication).

## The Solution

We need to manually run the migration SQL code in your Supabase dashboard to fix this issue.

### Steps to Run the Migration

1. Log in to your Supabase dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Navigate to your project
3. Click on "SQL Editor" in the left sidebar
4. Click on "New Query"
5. Copy and paste the following SQL code:

```sql
-- Disable the problematic trigger that's causing the "Database error saving new user" error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Make sure the profiles table has a proper insert policy - check if it exists first
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles'
    AND policyname = 'Allow anyone to insert profiles'
  ) THEN
    -- Create the policy without the IF NOT EXISTS clause (not supported)
    CREATE POLICY "Allow anyone to insert profiles" ON public.profiles
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Make sure profiles can be inserted programmatically
-- This allows our application code to create profiles directly
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Update the profiles schema to make the email field nullable
-- This avoids issues with empty email values from some OAuth providers
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;

-- Check and clean up any duplicate triggers
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    DROP TRIGGER on_auth_user_created ON auth.users;
  END IF;
END $$;

-- For safety, also keep the function definition but improve it for future use
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only try to insert if not already exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = new.id) THEN
    -- Insert with proper null handling and coalesce for potential missing metadata fields
    INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at)
    VALUES (
      new.id,
      COALESCE(new.email, ''),
      COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
      COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
      COALESCE(new.created_at, NOW())
    );
  END IF;
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the transaction
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

6. Click "Run" to execute the SQL
7. You should see a message indicating the query was executed successfully
8. Restart your application's development server

## What This Migration Does

1. **Disables the problematic trigger** that's causing the database error
2. **Adds a proper policy** to allow profile creation from the application code
3. **Makes the email field nullable** in case a user authenticates with a provider that doesn't supply an email
4. **Updates the function definition** to properly handle edge cases for future use

Once you've applied this migration, the application code will handle profile creation rather than relying on the database trigger, which should resolve the error.