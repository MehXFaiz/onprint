import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Logo from '../../components/Logo'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Please enter your full name.'
    if (!email.trim()) nextErrors.email = 'Please enter your email address.'
    if (!password || password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      await register({ name, email, company, password })
      navigate('/account')
    } catch {
      setErrors({ general: 'Registration failed. Please try again.' })
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
              <UserPlus className="h-3.5 w-3.5" />
              <span>Client Registration</span>
            </div>
            <h1 className="font-display mt-2 text-2xl font-black tracking-tight text-neutral-900">
              Create Your Account
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              Instant access to custom print quotes, proof approvals, and order tracking.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {errors.general && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Al-Maktoum"
                className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
              {errors.name && <p className="mt-1 text-xs font-semibold text-[#A82F19]">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@company.ae"
                className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
              {errors.email && <p className="mt-1 text-xs font-semibold text-[#A82F19]">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Company / Brand Name (Optional)
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Dubai Creative Studio LLC"
                className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Password *
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
              {errors.password && <p className="mt-1 text-xs font-semibold text-[#A82F19]">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              icon={false}
              className="w-full justify-center mt-2 shadow-md shadow-[#A82F19]/20"
            >
              {loading ? 'Creating Account...' : 'Register Client Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs font-medium text-neutral-500 pt-6 border-t border-neutral-100">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#A82F19] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
