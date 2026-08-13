import { Link, NavLink, Outlet } from 'react-router-dom'
import Logo from '../components/Logo'

const navLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/quotes', label: 'Quotes' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/portfolio', label: 'Portfolio' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/settings', label: 'Settings' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 shrink-0 bg-ink-900 p-6 text-gray-300 md:block">
        <Link to="/admin" className="flex items-center gap-2">
          <Logo variant="light" size="sm" />
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-white/10 px-2 py-0.5 rounded">Admin</span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-brand-600 text-white' : 'hover:bg-white/10 hover:text-white'
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
