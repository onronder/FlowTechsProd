import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const scheduledApis = [
  { source: 'Shop', date: '2018/12/12', lastRun: '2023/11/22', lastDate: '2023/11/22' },
  { source: 'Orders', date: '2018/12/12', lastRun: '2023/11/22', lastDate: '2023/11/22' },
]

export function ScheduledApis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled APIs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Last Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledApis.map((api, index) => (
              <TableRow key={index}>
                <TableCell>{api.source}</TableCell>
                <TableCell>{api.date}</TableCell>
                <TableCell>{api.lastRun}</TableCell>
                <TableCell>{api.lastDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

