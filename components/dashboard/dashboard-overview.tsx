import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden shadow-card">
        <CardHeader className="bg-purple-primary/10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-purple-primary"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-purple-primary">10,234</div>
          <p className="text-xs text-muted-foreground mt-2">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden shadow-card">
        <CardHeader className="bg-orange-soft/30 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Event Count</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-orange-500"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-orange-500">536</div>
          <p className="text-xs text-muted-foreground mt-2">
            +19% from last month
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden shadow-card">
        <CardHeader className="bg-green-mint/50 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversations</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-green-500"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-500">21</div>
          <p className="text-xs text-muted-foreground mt-2">
            +201 since last hour
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden shadow-card">
        <CardHeader className="bg-blue-light/30 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Users</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-blue-500"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-blue-500">3321</div>
          <p className="text-xs text-muted-foreground mt-2">
            +180.1% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

