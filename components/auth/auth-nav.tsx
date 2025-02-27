import Link from 'next/link'
import { routes } from '@/lib/routes'

export function AuthNav({ isLogin = true }) {
  return (
    <div className="text-center text-sm">
      {isLogin ? (
        <>
          Don't have an account?{' '}
          <Link href={routes.auth.register} className="underline">
            Sign up
          </Link>
        </>
      ) : (
        <>
          Already have an account?{' '}
          <Link href={routes.auth.login} className="underline">
            Sign in
          </Link>
        </>
      )}
    </div>
  )
}