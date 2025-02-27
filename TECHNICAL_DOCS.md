# FlowTechs Technical Documentation

## Architecture Overview

FlowTechs is built on a modern web stack with a focus on performance, scalability, and developer experience. The application follows a client-server architecture with a Next.js frontend and Supabase backend.

### System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  Next.js    │────▶│  Supabase   │────▶│ PostgreSQL  │
│  Frontend   │     │  Backend    │     │ Database    │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  Shopify    │     │  Auth       │     │  Storage    │
│  API        │     │  Service    │     │  Service    │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Frontend Architecture

The frontend is built with Next.js 14 using the App Router architecture. It follows a component-based approach with a clear separation of concerns:

- **Pages**: Defined in the `app` directory, following Next.js 14 App Router conventions
- **Components**: Reusable UI components in the `components` directory
- **Hooks**: Custom React hooks for state management and data fetching
- **Context**: Global state management using React Context API
- **Utilities**: Helper functions and shared code

### Backend Architecture

The backend is primarily built on Supabase, which provides:

- **Database**: PostgreSQL database for storing application data
- **Authentication**: User authentication and authorization
- **Storage**: File storage for user uploads
- **Functions**: Serverless functions for custom backend logic

Additionally, we use Next.js API routes for custom server-side logic that needs to interact with external APIs or perform operations that can't be handled directly by Supabase.

### Data Flow

1. **User Authentication**: Users authenticate via Supabase Auth
2. **Data Source Connection**: Users connect to data sources (e.g., Shopify)
3. **Data Fetching**: Application fetches data from connected sources
4. **Data Transformation**: Data is transformed according to user-defined rules
5. **Data Storage**: Transformed data is stored in the database
6. **Data Destination**: Data is sent to configured destinations

## Database Schema

### Core Tables

#### `profiles`
- `id`: UUID (primary key, references auth.users.id)
- `email`: TEXT (not null)
- `full_name`: TEXT
- `display_name`: TEXT
- `avatar_url`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

#### `sources`
- `id`: UUID (primary key)
- `user_id`: UUID (references profiles.id)
- `name`: TEXT (not null)
- `source_type`: source_type ENUM ('shopify', 'woocommerce', 'bigcommerce', 'custom')
- `connection_status`: TEXT
- `credentials`: JSONB
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `last_sync_at`: TIMESTAMP

#### `transformations`
- `id`: UUID (primary key)
- `user_id`: UUID (references profiles.id)
- `name`: TEXT (not null)
- `description`: TEXT
- `source_id`: UUID (references sources.id)
- `transformation_rules`: JSONB
- `status`: transformation_status ENUM ('draft', 'active', 'paused', 'error')
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

#### `destinations`
- `id`: UUID (primary key)
- `user_id`: UUID (references profiles.id)
- `name`: TEXT (not null)
- `destination_type`: destination_type ENUM ('shopify', 'postgres', 'mysql', 'bigquery', 'snowflake', 'csv', 'api_endpoint')
- `credentials`: JSONB
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

#### `job_runs`
- `id`: UUID (primary key)
- `user_id`: UUID (references profiles.id)
- `transformation_id`: UUID (references transformations.id)
- `status`: job_status ENUM ('queued', 'running', 'completed', 'failed', 'cancelled')
- `start_time`: TIMESTAMP
- `end_time`: TIMESTAMP
- `logs`: JSONB
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Database Triggers

The database includes several triggers for automatic operations:

1. `update_profile_updated_at`: Updates the `updated_at` timestamp when a profile is modified
2. `handle_new_user`: Creates a profile entry when a new user is created in auth.users
3. Similar update triggers for sources, transformations, destinations, and job_runs tables

## Authentication Flow

FlowTechs uses Supabase Authentication with the following flows:

### Email/Password Authentication

1. User enters email and password
2. Frontend sends credentials to Supabase Auth
3. Supabase validates credentials and returns a JWT
4. JWT is stored in cookies for subsequent requests
5. User is redirected to the dashboard

### OAuth Authentication (Google)

1. User clicks "Sign in with Google"
2. User is redirected to Google's OAuth consent screen
3. After consent, Google redirects back to the application with an auth code
4. Supabase exchanges the auth code for tokens
5. User is redirected to the dashboard

## Shopify Integration

The Shopify integration uses Shopify's OAuth flow and GraphQL API:

### OAuth Flow

1. User enters their Shopify store URL
2. Application redirects to Shopify's authorization page
3. User approves the application
4. Shopify redirects back with an authorization code
5. Application exchanges the code for an access token
6. Access token is stored in the database for future API calls

### API Integration

- **GraphQL API**: Used for fetching products, orders, and other data
- **REST API**: Used for specific operations not available in GraphQL
- **Webhooks**: Used for real-time updates from Shopify

## Development Guidelines

### Code Organization

- **Feature-based organization**: Group related components, hooks, and utilities by feature
- **Shared components**: Common UI components in `components/ui`
- **Type safety**: Use TypeScript interfaces and types for all data structures

### State Management

- **Server state**: Use React Query for data fetching and caching
- **UI state**: Use React's useState and useReducer for component-level state
- **Global state**: Use React Context for application-wide state

### Error Handling

- **API errors**: Handle and display user-friendly error messages
- **Error boundaries**: Use React Error Boundaries to catch and handle UI errors
- **Logging**: Log errors to the console in development and to a monitoring service in production

### Performance Optimization

- **Code splitting**: Use dynamic imports to split code into smaller chunks
- **Memoization**: Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders
- **Image optimization**: Use Next.js Image component for optimized images
- **Lazy loading**: Load components and data only when needed

## Deployment Strategy

FlowTechs is deployed on Vercel with the following strategy:

### Environments

- **Development**: Local development environment
- **Staging**: Deployed from the `develop` branch for testing
- **Production**: Deployed from the `main` branch

### CI/CD Pipeline

1. **Linting and Type Checking**: Run ESLint and TypeScript checks
2. **Testing**: Run unit and integration tests
3. **Build**: Build the application
4. **Deploy**: Deploy to the appropriate environment

### Environment Variables

Environment variables are managed in Vercel's dashboard and are specific to each environment.

## Security Considerations

- **Authentication**: Secure authentication via Supabase Auth
- **Authorization**: Row-level security in Supabase for data access control
- **API Security**: Validate and sanitize all user inputs
- **HTTPS**: Enforce HTTPS for all communications
- **Content Security Policy**: Restrict resource loading to trusted sources
- **Sensitive Data**: Encrypt sensitive data in the database

## Monitoring and Logging

- **Error Tracking**: Capture and report frontend and backend errors
- **Performance Monitoring**: Track application performance metrics
- **User Analytics**: Monitor user behavior and feature usage
- **Audit Logging**: Log security-relevant events for audit purposes

## Future Enhancements

- **Additional Data Sources**: Support for more e-commerce platforms
- **Advanced Transformations**: More complex data transformation capabilities
- **Workflow Automation**: Automated workflows based on data changes
- **AI-Powered Insights**: Machine learning for data analysis and recommendations
- **Mobile App**: Native mobile application for on-the-go management

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Check browser cookies and local storage
   - Verify Supabase configuration

2. **API Connection Failures**
   - Check network connectivity
   - Verify API credentials
   - Check for rate limiting

3. **Data Synchronization Problems**
   - Verify source connection status
   - Check transformation rules for errors
   - Review job run logs

### Debugging Tools

- Browser DevTools for frontend debugging
- Supabase Dashboard for database and auth debugging
- Next.js error overlay for runtime errors
- Custom logging utilities for application-specific debugging