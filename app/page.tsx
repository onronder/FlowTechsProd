import { PageHeader } from "@/components/ui/page-header"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { RecentJobs } from "@/components/dashboard/recent-jobs"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { routes } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { syncUserProfile } from "@/lib/supabase/helpers"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // If user is authenticated, check if they have a profile and sync if necessary
  if (session?.user) {
    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    // If no profile exists or we have missing data, sync the profile
    if (!profile || !profile.full_name || !profile.avatar_url) {
      await syncUserProfile(supabase, session.user)
    }
  }

  // If user is not authenticated, show a landing page with sign-in options
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome to FlowTechs
          </h1>
          <p className="text-xl text-muted-foreground">
            The seamless e-commerce data integration platform for managing your product data across multiple platforms.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href={routes.auth.login}>Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={routes.auth.register}>Create Account</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-bold mb-2">Connect Sources</h3>
            <p className="text-center text-muted-foreground">
              Import products from Shopify, WooCommerce, and more with just a few clicks.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-bold mb-2">Transform Data</h3>
            <p className="text-center text-muted-foreground">
              Create custom transformations to standardize your product data.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-bold mb-2">Export Anywhere</h3>
            <p className="text-center text-muted-foreground">
              Send your transformed data to any destination platform automatically.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If user is authenticated, show the dashboard
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your data integration activities"
      />
      <MetricCards />
      <RecentJobs />
    </div>
  )
}

