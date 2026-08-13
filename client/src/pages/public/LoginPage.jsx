import { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import Button from '../../components/Button'

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
    if (!values.email.trim()) nextErrors.email = 'Please enter your email.'
    if (!values.password) nextErrors.password = 'Please enter your password.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // No auth backend exists yet (roadmap Phase 4 — Authentication). Wire this to a
    // real POST /api/auth/login once it exists.
    setNotice(true)
  }

  return (
    <Container className="flex min-h-[75vh] items-center justify-center py-20">
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Welcome Back</p>
        <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary">Sign In</h1>
        <p className="mt-2 text-sm text-secondary">Access your quotes and order history.</p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-primary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              aria-invalid={Boolean(errors.email)}
              className="mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
            />
            {errors.email && <p className="mt-1.5 text-xs text-accent">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold text-primary">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={values.password}
              onChange={handleChange('password')}
              aria-invalid={Boolean(errors.password)}
              className="mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
            />
            {errors.password && <p className="mt-1.5 text-xs text-accent">{errors.password}</p>}
          </div>

          {notice && (
            <p className="border border-border bg-accent-soft px-4 py-3 text-sm text-primary">
              Account sign-in isn't available yet — check back soon.
            </p>
          )}

          <Button type="submit" variant="accent" icon={false} className="w-full justify-center">
            Sign In
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-accent">
            Register
          </Link>
        </p>
      </div>
    </Container>
  )
}
