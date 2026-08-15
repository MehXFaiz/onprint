import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Logo from '../../components/Logo'
import { Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    try {
      const loggedUser = await login(email, password)
      if (loggedUser && (loggedUser.role === 'admin' || loggedUser.role === 'ADMINISTRATOR')) {
        navigate('/admin')
      } else {
        navigate('/account')
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-16 sm:py-24 bg-neutral-50/50 min-h-[calc(100vh-200px)] flex items-center">
      <Container className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-xl sm:p-10">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
              <Lock className="h-3.5 w-3.5" />
              <span>Portal Sign In</span>
            </div>
            <h1 className="font-display mt-2 text-2xl font-black tracking-tight text-neutral-900">
              Welcome Back
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              Sign in to your ONPRINT account.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none focus:ring-1 focus:ring-[#A82F19]"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-[#A82F19] focus:outline-none focus:ring-1 focus:ring-[#A82F19]"
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              icon={false}
              className="w-full justify-center mt-2 shadow-md shadow-[#A82F19]/20"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
