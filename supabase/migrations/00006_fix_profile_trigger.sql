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