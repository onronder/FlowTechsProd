import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const recentJobs = [
  { id: 1, name: "Job 1", status: "Completed", duration: "10 days", records: 100 },
  { id: 2, name: "Job 2", status: "In Progress", duration: "5 days", records: 50 },
  { id: 3, name: "Job 3", status: "Pending", duration: "2 days", records: 20 },
]

export function JobPerformance({isDarkMode}: {isDarkMode: boolean}) {
  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
  isDarkMode 
    ? 'bg-[#2C2C3D] border-[#333333] hover:shadow-[inset_0_0_6px_rgba(58,58,75,0.2)]' 
    : 'bg-white border-[#E0E0E0] hover:shadow-[0_0_8px_rgba(0,0,0,0.1)]'
}`}>
      <CardHeader>
        <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Recent Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Records</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentJobs.map((job) => (
              <TableRow key={job.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>{job.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      job.status === "Completed"
                        ? "default"
                        : job.status === "In Progress"
                        ? "secondary"
                        : "destructive"
                    }
                    className={`
    ${job.status === "Completed"
      ? isDarkMode ? "bg-green-500 text-white" : "bg-green-100 text-green-800"
      : job.status === "In Progress"
      ? isDarkMode ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"
      : isDarkMode ? "bg-red-500 text-white" : "bg-red-100 text-red-800"
    }
  `}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>{job.duration}</TableCell>
                <TableCell>{job.records}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

