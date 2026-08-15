import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Logo from '../components/Logo'
import { LayoutDashboard, FileText, ShoppingBag, User, ArrowLeft } from 'lucide-react'

const navLinks = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/account/quotes', label: 'My Quotes', icon: FileText },
  { to: '/account/orders', label: 'My Orders', icon: ShoppingBag },
  { to: '/account/profile', label: 'Profile', icon: User },
]

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface p-6 md:block">
        <Link to="/">
          <Logo size="sm" />
        </Link>
        <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-accent">Customer Portal</div>

        <nav className="mt-8 flex flex-col gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon
            const renderNavIcon = () => {
              if (!Icon) return null
              if (React.isValidElement(Icon)) return Icon
              if (typeof Icon === 'function' || typeof Icon === 'string' || (typeof Icon === 'object' && Icon.$$typeof)) {
                return <Icon className="h-4 w-4 shrink-0" />
              }
              return null
            }
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/account'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-accent text-white shadow-xs'
                      : 'text-secondary hover:bg-background hover:text-primary'
                  }`
                }
              >
                {renderNavIcon()}
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto pt-10 border-t border-border/60">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Website
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        {/* Mobile quick navbar */}
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4 md:hidden">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <div className="flex gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/account'}
                className={({ isActive }) =>
                  `rounded-md px-2.5 py-1 text-xs font-semibold ${
                    isActive ? 'bg-accent text-white' : 'text-secondary hover:bg-surface'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

