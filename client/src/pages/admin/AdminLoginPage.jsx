import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react'
import { useAuth, DEMO_USERS } from '../../context/AuthContext'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [email, setEmail] = useState('admin@onprint.ae')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        setError('Access denied. Administrator privileges required.')
      }
    } catch {
      setError('Invalid admin credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-8 shadow-2xl">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <Logo variant="light" size="md" />
          </Link>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <ShieldCheck className="h-4 w-4" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="font-display mt-2 text-2xl font-black tracking-tight text-white">
            Staff Portal Login
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Sign in to manage product uploads, inventory, and order dispatch.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-white focus:border-[#A82F19] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-white focus:border-[#A82F19] focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            icon={false}
            className="w-full justify-center mt-2 shadow-md shadow-[#A82F19]/30"
          >
            {loading ? 'Authenticating...' : 'Sign In as Admin'}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-neutral-800/80 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}
