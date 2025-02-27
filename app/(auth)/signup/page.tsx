"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/auth/auth-layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/components/theme-provider"
import { FcGoogle } from 'react-icons/fc'

export default function SignUpPage(): React.ReactElement {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, contain one uppercase letter and one number.')
      return
    }

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/login')
      } else {
        setError(data.message || 'An error occurred during sign up.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  const validateEmail = (email: string): any => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const validatePassword = (password: string): any => {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)
  }

  const handleGoogleSignUp = (): void => {
    // Implement Google OAuth2 sign up logic here
    console.log('Google sign up clicked')
  }

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Sign up to start managing your data effortlessly."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e): any => setEmail(e.target.value)}
            required
            className={isDarkMode ? 'bg-[#2C2C3D] border-[#4C4C5A] text-white' : 'bg-[#F5F5F5] border-[#E0E0E0] text-black'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e): any => setPassword(e.target.value)}
            required
            className={isDarkMode ? 'bg-[#2C2C3D] border-[#4C4C5A] text-white' : 'bg-[#F5F5F5] border-[#E0E0E0] text-black'}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className={`w-full ${
            isDarkMode
              ? 'bg-gradient-to-r from-[#BB86FC] to-[#6200EE] hover:from-[#CC99FF] hover:to-[#7357EE]'
              : 'bg-gradient-to-r from-[#6C63FF] to-[#9D50BB] hover:from-[#786EFF] hover:to-[#A673CC]'
          } text-white`}
        >
          Sign Up with Email
        </Button>
      </form>
      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          className={`w-full ${
            isDarkMode ? 'bg-[#3A3A4B] text-white hover:bg-[#4C4C5A]' : 'bg-[#E0E0E0] text-black hover:bg-[#BDBDBD]'
          }`}
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Sign Up with Google
        </Button>
      </div>
      <p className={`mt-4 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Already have an account?{' '}
        <Link href="/login" className={isDarkMode ? 'text-[#BBE1FA] hover:text-[#A0D1FF]' : 'text-[#1565C0] hover:text-[#0D47A1]'}>
          Login
        </Link>
      </p>
    </AuthLayout>
  )
}

