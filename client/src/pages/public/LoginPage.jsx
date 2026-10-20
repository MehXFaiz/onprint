import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Logo from '../../components/Logo'
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFillAdmin = () => {
    setEmail('admin@onprint.ae')
    setPassword('admin123')
    setError('')
  }

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
    <div className="py-16 sm:py-24 bg-[#101C35] min-h-[calc(100vh-200px)] flex items-center">
      <Container className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[#263654] bg-[#1B2943] p-8 shadow-2xl sm:p-10 text-[#F5F1E8]">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D6BC8A]">
              <Lock className="h-3.5 w-3.5" />
              <span>Portal Sign In</span>
            </div>
            <h1 className="font-display mt-2 text-2xl font-black tracking-tight text-[#F5F1E8]">
              Welcome Back
            </h1>
            <p className="mt-1 text-xs text-[#A0AEC0]">
              Sign in to your ONPRINT account or administrative portal.
            </p>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 rounded-2xl border border-[#263654] bg-[#101C35] p-3.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#D6BC8A] mb-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#D6BC8A]" />
                Admin Credentials (1-Click Fill)
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillAdmin}
              className="flex w-full items-center justify-between rounded-xl border border-[#263654] bg-[#1B2943] p-2.5 text-left text-xs font-semibold text-[#F5F1E8] transition-all hover:border-[#D6BC8A] hover:bg-[#1B2C4D] cursor-pointer"
            >
              <div>
                <div className="font-bold text-[#F5F1E8]">admin@onprint.ae</div>
                <div className="text-[10px] text-[#A0AEC0]">Password: admin123</div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#D6BC8A]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs font-semibold text-red-300">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="mt-2 w-full rounded-xl border border-[#263654] bg-[#101C35] px-3.5 py-2.5 text-sm text-[#F5F1E8] placeholder-slate-500 focus:border-[#D6BC8A] focus:outline-none focus:ring-1 focus:ring-[#D6BC8A]"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8]">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-[#263654] bg-[#101C35] px-3.5 py-2.5 text-sm text-[#F5F1E8] placeholder-slate-500 focus:border-[#D6BC8A] focus:outline-none focus:ring-1 focus:ring-[#D6BC8A]"
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              icon={false}
              className="w-full justify-center mt-2 shadow-md shadow-[#D6BC8A]/20 font-bold"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
