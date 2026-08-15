import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Logo from '../../components/Logo'
import { Lock, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuth, DEMO_USERS } from '../../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDemoFill = (type) => {
    const demo = DEMO_USERS.find((u) => u.role === type)
    if (demo) {
      setEmail(demo.email)
      setPassword(demo.password)
    }
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
      if (loggedUser.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/account')
      }
    } catch {
      setError('Invalid email or password.')
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
              Access your print quotes, order tracking, and administrative dashboard.
            </p>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#A82F19]" />
                Demo Credentials (1-Click Fill)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-2.5 text-left text-xs font-semibold text-neutral-800 transition-all hover:border-[#A82F19] hover:bg-red-50/30"
              >
                <div>
                  <div className="font-bold text-neutral-900">Admin Account</div>
                  <div className="text-[10px] text-neutral-500">admin@onprint.ae</div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#A82F19]" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('customer')}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-2.5 text-left text-xs font-semibold text-neutral-800 transition-all hover:border-[#A82F19] hover:bg-red-50/30"
              >
                <div>
                  <div className="font-bold text-neutral-900">Client Account</div>
                  <div className="text-[10px] text-neutral-500">client@onprint.ae</div>
                </div>
                <UserCheck className="h-3.5 w-3.5 text-[#A82F19]" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Password
                </label>
              </div>
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

          <div className="mt-6 text-center text-xs font-medium text-neutral-500 pt-6 border-t border-neutral-100">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#A82F19] hover:underline">
              Create Client Account
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
