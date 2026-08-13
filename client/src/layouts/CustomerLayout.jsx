import { Link, NavLink, Outlet } from 'react-router-dom'
import Logo from '../components/Logo'

const navLinks = [
  { to: '/account', label: 'Dashboard' },
  { to: '/account/quotes', label: 'My Quotes' },
  { to: '/account/orders', label: 'My Orders' },
  { to: '/account/profile', label: 'Profile' },
]

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-gray-50 p-6 md:block">
        <Link to="/">
          <Logo size="sm" />
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/account'}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-brand-600 text-white' : 'text-ink-700 hover:bg-gray-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
