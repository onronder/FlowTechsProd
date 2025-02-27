"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/components/theme-provider'

const transformations = [
  { name: 'Order Transformation', dataSource: 'https://myshop.myshopify.com', apiList: 'Orders, Customers', lastModified: '2023-05-15', status: 'Active' },
  { name: 'Customer Insights', dataSource: 'https://insights.myshopify.com', apiList: 'Customers, Analytics', lastModified: '2023-05-10', status: 'Inactive' },
]

export function TransformationsList() {
  const { theme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Saved Transformations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Data Source</TableHead>
              <TableHead>Selected APIs</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transformations.map((transformation, index) => (
              <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">{transformation.name}</TableCell>
                <TableCell className="text-muted-foreground">{transformation.dataSource}</TableCell>
                <TableCell>{transformation.apiList}</TableCell>
                <TableCell>{transformation.lastModified}</TableCell>
                <TableCell>
                  <Badge variant={transformation.status === 'Active' ? 'default' : 'secondary'} className={`
                    ${transformation.status === 'Active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : ''}
                  `}>
                    {transformation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                  <Button variant="outline" size="sm">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

