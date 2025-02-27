"use client"

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from 'lucide-react'

interface FileData {
  fileName: string
  fileSize: string
  creationDate: string
  latestDownloadDate: string
  downloadUrl: string
}

const mockData: FileData[] = [
  { fileName: "orders_20241111.csv", fileSize: "12 KB", creationDate: "2024-11-11", latestDownloadDate: "2024-11-15", downloadUrl: "https://example.com/files/orders_20241111.csv" },
  { fileName: "customers_20241023.csv", fileSize: "34 KB", creationDate: "2024-10-23", latestDownloadDate: "2024-11-01", downloadUrl: "https://example.com/files/customers_20241023.csv" },
  { fileName: "inventory_20241020.csv", fileSize: "56 KB", creationDate: "2024-10-20", latestDownloadDate: "2024-11-10", downloadUrl: "https://example.com/files/inventory_20241020.csv" },
  { fileName: "products_20241105.csv", fileSize: "28 KB", creationDate: "2024-11-05", latestDownloadDate: "2024-11-12", downloadUrl: "https://example.com/files/products_20241105.csv" },
  { fileName: "sales_20241101.csv", fileSize: "45 KB", creationDate: "2024-11-01", latestDownloadDate: "2024-11-14", downloadUrl: "https://example.com/files/sales_20241101.csv" },
  { fileName: "analytics_20241110.csv", fileSize: "67 KB", creationDate: "2024-11-10", latestDownloadDate: "2024-11-16", downloadUrl: "https://example.com/files/analytics_20241110.csv" },
]

export function DataStorageContent() {
  const [files, setFiles] = useState<FileData[]>(mockData)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      isDarkMode 
        ? 'bg-[#2C2C3D] border-[#333333] hover:shadow-[inset_0_0_6px_rgba(58,58,75,0.2)]' 
        : 'bg-white border-[#E0E0E0] hover:shadow-[0_0_8px_rgba(0,0,0,0.1)]'
    }`}>
      <CardHeader>
        <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Stored Files</CardTitle>
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <Table>
            <TableHeader className={isDarkMode ? 'bg-[#2C2C3D]' : 'bg-[#F5F5F5]'}>
              <TableRow>
                <TableHead className={isDarkMode ? 'text-white' : 'text-black'}>File Name</TableHead>
                <TableHead className={isDarkMode ? 'text-white' : 'text-black'}>File Size</TableHead>
                <TableHead className={isDarkMode ? 'text-white' : 'text-black'}>Creation Date</TableHead>
                <TableHead className={isDarkMode ? 'text-white' : 'text-black'}>Latest Download Date</TableHead>
                <TableHead className={isDarkMode ? 'text-white' : 'text-black'}>Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file, index) => (
                <TableRow 
                  key={index}
                  className={`transition-all duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-[#3A3A4B] hover:shadow-[inset_0_0_6px_rgba(255,255,255,0.1)]' 
                      : 'hover:bg-gray-50 hover:shadow-[0_0_6px_rgba(0,0,0,0.1)]'
                  }`}
                >
                  <TableCell className={isDarkMode ? 'text-white' : 'text-black'}>{file.fileName}</TableCell>
                  <TableCell className={isDarkMode ? 'text-white' : 'text-black'}>{file.fileSize}</TableCell>
                  <TableCell className={isDarkMode ? 'text-white' : 'text-black'}>{file.creationDate}</TableCell>
                  <TableCell className={isDarkMode ? 'text-white' : 'text-black'}>{file.latestDownloadDate}</TableCell>
                  <TableCell>
                    <a 
                      href={file.downloadUrl} 
                      download 
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        isDarkMode 
                          ? 'text-white hover:bg-[#3A3A4B]' 
                          : 'text-black hover:bg-gray-200'
                      }`}
                      aria-label={`Download ${file.fileName}`}
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className={`text-center py-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            No files available for download.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

