import { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Logo from '../../components/Logo'
import { Lock } from 'lucide-react'

const initialForm = { email: '', password: '' }

export default function LoginPage() {
  const [values, setValues] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(false)

  function handleChange(field) {
    return (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!values.email.trim()) nextErrors.email = 'Please enter your email address.'
    if (!values.password) nextErrors.password = 'Please enter your password.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setNotice(true)
  }

  return (
    <div className="py-16 sm:py-24">
      <Container className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-10">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
              <Lock className="h-3.5 w-3.5" />
              <span>Customer Portal Sign In</span>
            </div>
            <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight text-primary">Welcome Back</h1>
            <p className="mt-1 text-xs text-secondary">Manage your print quotes, artwork files, and order dispatches.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-primary">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={values.email}
                onChange={handleChange('email')}
                aria-invalid={Boolean(errors.email)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
              />
              {errors.email && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-primary">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={values.password}
                onChange={handleChange('password')}
                aria-invalid={Boolean(errors.password)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
              />
              {errors.password && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.password}</p>}
            </div>

            {notice && (
              <div className="rounded-xl border border-accent/20 bg-accent-soft p-3.5 text-xs font-medium text-primary text-center">
                Account sign-in is currently being integrated into our portal backend.
              </div>
            )}

            <Button type="submit" variant="accent" size="lg" icon={false} className="w-full justify-center">
              Sign In to Account
            </Button>
          </form>

          <div className="mt-8 text-center text-xs font-medium text-secondary pt-6 border-t border-border/60">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-accent hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}

