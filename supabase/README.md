# FlowTechs Supabase Integration

This directory contains everything needed to set up and configure Supabase for the FlowTechs application. Supabase provides the authentication, database, and storage solutions for our application.

## What is Supabase?

[Supabase](https://supabase.com/) is an open-source Firebase alternative that provides:

- PostgreSQL Database
- Authentication with multiple providers
- Storage for files and assets
- Realtime subscriptions
- Edge Functions

## Setup Guides

Follow these guides in order to set up the complete Supabase integration:

1. [Database Migrations Setup](./APPLY_MIGRATIONS.md) - Apply the database schema and RLS policies
2. [Google OAuth Configuration](./GOOGLE_OAUTH_SETUP.md) - Set up Google sign-in
3. [Integration Testing](./TESTING_GUIDE.md) - Test that everything is working correctly

## Database Schema

The FlowTechs application uses the following tables in Supabase:

- **profiles** - User profile information
- **sources** - Data sources configured by users (e.g., Shopify, WooCommerce)
- **transformations** - Data transformations configured by users
- **destinations** - Output destinations where transformed data is sent
- **job_runs** - Records of transformation job runs

Each table is protected with Row Level Security (RLS) policies to ensure users can only access their own data.

## Authentication

We use Supabase Auth for:

- Email/password authentication
- Google OAuth (social login)
- Session management
- Password reset functionality

## API Endpoints

All API endpoints that interact with Supabase are in the `/app/api` directory. These endpoints handle:

- User profile management
- CRUD operations for sources, transformations, and destinations
- Job execution and status monitoring

## Environment Variables

The following environment variables need to be set in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## Supabase Client Usage

There are two Supabase clients set up in the codebase:

1. **Client-side client** - `/lib/supabase/client.ts` - Used for browser-based operations
2. **Server-side client** - `/lib/supabase/server.ts` - Used for server-side operations in API routes

## Middleware

The application uses Next.js middleware (`/middleware.ts`) to:

- Validate authentication sessions
- Protect routes that require authentication
- Redirect unauthenticated users to the login page
- Refresh sessions automatically

## Getting Help

If you encounter issues with the Supabase integration:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the troubleshooting sections in our guides
3. Consult the [Supabase Community Forum](https://github.com/supabase/supabase/discussions)