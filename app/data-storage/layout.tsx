import { ReactNode } from 'react'

export default function DataStorageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Data Storage</h1>
      {children}
    </div>
  )
}

