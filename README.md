# FlowTechs

A modern data integration platform that connects your e-commerce stores with various destinations, enabling seamless data flow and transformation.

![FlowTechs Dashboard](https://via.placeholder.com/800x400?text=FlowTechs+Dashboard)

## Overview

FlowTechs is a full-stack application built with Next.js, TypeScript, and Supabase that helps businesses integrate and manage their data flows between different platforms. The application allows users to:

- Connect to various data sources (currently supporting Shopify)
- Transform data using custom rules and mappings
- Send data to multiple destinations
- Monitor data flows and track performance

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI (based on Radix UI)
- **Backend**: Next.js API Routes, Supabase Functions
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Features

### Data Sources

- Connect to Shopify stores via OAuth
- View and manage connected data sources
- Monitor connection status and sync history

### Data Transformations

- Create custom data transformation rules
- Map fields between sources and destinations
- Apply filters and conditions to data flows

### Destinations

- Configure multiple data destinations
- Support for various storage and analytics platforms
- Manage destination connections and credentials

### User Management

- User authentication and authorization
- Profile management
- Role-based access control

### Analytics & Monitoring

- Track data flow performance
- Monitor errors and failures
- View data processing metrics

## Project Structure

```
├── app/                  # Next.js app directory (App Router)
│   ├── (auth)/           # Authentication routes
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── sources/          # Sources management
│   ├── destinations/     # Destinations management
│   ├── settings/         # User settings
│   └── transformations/  # Data transformations
├── components/           # React components
│   ├── ui/               # UI components (Shadcn)
│   ├── dashboard/        # Dashboard components
│   ├── sources/          # Source-related components
│   └── transformations/  # Transformation components
├── lib/                  # Utility functions and shared code
│   ├── supabase/         # Supabase client and helpers
│   ├── context/          # React context providers
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── styles/               # Global styles
├── supabase/             # Supabase migrations and config
└── scripts/              # Utility scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Shopify Partner account (for Shopify integration)

### Environment Setup

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and fill in the required values:

```
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Shopify OAuth
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_REDIRECT_URI=http://localhost:3000/api/shopify/callback

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Database Setup

The project uses Supabase for database and authentication. The database schema is defined in the `supabase/migrations` directory.

To set up the database:

1. Create a new Supabase project
2. Run the migrations in the `supabase/migrations` directory
3. Update your `.env.local` file with the Supabase credentials

## Shopify Integration

FlowTechs integrates with Shopify using their OAuth flow and GraphQL API. To set up Shopify integration:

1. Create a Shopify Partner account
2. Create a new app in the Shopify Partner dashboard
3. Configure the app with the redirect URI: `{your_domain}/api/shopify/callback`
4. Add the API key and secret to your `.env.local` file

For more details, see the [Shopify Integration Guide](docs/shopify-integration.md).

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the established project structure
- Use React functional components with hooks
- Ensure proper typing for all functions and components

### State Management

- Use React Context for global state
- Use React Query for server state
- Keep component state local when possible

### UI Components

- Use the existing UI components from the `components/ui` directory
- Follow the established design patterns
- Ensure all components are responsive and accessible

## Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the environment variables
3. Deploy the application

## License

[MIT](LICENSE)

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com).