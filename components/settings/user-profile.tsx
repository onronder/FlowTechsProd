"use client"

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function UserProfile() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/placeholder.svg?height=100&width=100',
  })
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated user info to your backend
    console.log('User info updated:', user)
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
  isDarkMode 
    ? 'bg-[#2C2C3D] border-[#333333] hover:shadow-[inset_0_0_6px_rgba(58,58,75,0.2)]' 
    : 'bg-white border-[#E0E0E0] hover:shadow-[0_0_8px_rgba(0,0,0,0.1)]'
}`}>
      <CardHeader>
        <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <Button variant="outline" className={`${
  isDarkMode 
    ? 'text-white hover:bg-[#3A3A4B]' 
    : 'text-black hover:bg-[#E0E0E0]'
}`}>Change Avatar</Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className={`${
    isDarkMode
      ? 'bg-[#2C2C3B] text-white border-[#3A3A4B] focus:border-[#6366F1] placeholder-[#6C727C]'
      : 'bg-white text-black border-[#E0E0E0] focus:border-[#1565C0] placeholder-[#BDBDBD]'
  }`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              className={`${
    isDarkMode
      ? 'bg-[#2C2C3B] text-white border-[#3A3A4B] focus:border-[#6366F1] placeholder-[#6C727C]'
      : 'bg-white text-black border-[#E0E0E0] focus:border-[#1565C0] placeholder-[#BDBDBD]'
  }`}
            />
          </div>
          <Button type="submit" className={`${
  isDarkMode
    ? 'bg-[#2196F3] text-white hover:bg-[#1E88E5]'
    : 'bg-[#1565C0] text-white hover:bg-[#0D47A1]'
}`}>Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  )
}

