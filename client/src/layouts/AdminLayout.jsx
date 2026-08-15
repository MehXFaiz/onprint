import React, { useState } from 'react'
import { Link, NavLink, Outlet, Navigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Wrench,
  ShoppingBag,
  FileText,
  Users,
  Image,
  MessageSquare,
  Settings,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/quotes', label: 'Quotes', icon: FileText },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/portfolio', label: 'Portfolio', icon: Image },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent UI flash during auth initialization
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Verifying Admin Session...</span>
        </div>
      </div>
    )
  }

  // Redirect to Admin Login if unauthenticated or non-admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-background flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-primary px-4 md:hidden shrink-0 z-40">
        <Link to="/admin" className="flex items-center gap-2.5">
          <Logo variant="light" size="sm" />
          <span className="inline-flex items-center gap-1 rounded-full bg-[#A82F19]/25 border border-[#A82F19]/50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-red-300 shadow-xs">
            <ShieldCheck className="h-3 w-3 text-[#A82F19]" />
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="rounded-lg p-2 text-white hover:bg-neutral-800 transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-primary p-6 text-background/80 transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:block shrink-0 flex flex-col justify-between ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Header Brand Area */}
          <div className="flex items-center justify-between pb-6 border-b border-background/10">
            <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
              <Logo variant="light" size="sm" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-xs">
                <ShieldCheck className="h-3 w-3" />
                Admin
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-1 text-white hover:bg-neutral-800 md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User badge */}
          <div className="mt-4 px-1 py-2 border-b border-background/10 text-xs">
            <div className="font-bold text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-background/60 truncate">{user?.email}</div>
          </div>

          {/* Nav Items */}
          <nav className="mt-4 flex flex-col gap-1.5">
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
                  end={link.to === '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#A82F19] text-white shadow-sm font-bold'
                        : 'text-background/70 hover:bg-background/10 hover:text-background'
                    }`
                  }
                >
                  {renderNavIcon()}
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Footer Link back to website */}
        <div className="pt-6 border-t border-background/10 mt-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-background/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            View Public Site
          </Link>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
