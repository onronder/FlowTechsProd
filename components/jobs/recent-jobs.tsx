import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const jobs = [
  { source: "Orders", startDate: "2023-11-22", duration: "00:15:30", rowsProcessed: 10345, status: "Success" },
  { source: "Products", startDate: "2023-11-22", duration: "00:10:15", rowsProcessed: 3345, status: "Success" },
  { source: "Customers", startDate: "2023-11-21", duration: "00:12:45", rowsProcessed: 1234, status: "Failed" },
] // TODO: Implement API to fetch actual recent jobs data

export function RecentJobs() {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Rows Processed</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job, index) => (
              <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">{job.source}</TableCell>
                <TableCell>{job.startDate}</TableCell>
                <TableCell>{job.duration}</TableCell>
                <TableCell>{job.rowsProcessed.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={job.status === "Success" ? "success" : "destructive"}
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      job.status === "Success" ? "bg-green-500 text-white" : ""
                    }`}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

