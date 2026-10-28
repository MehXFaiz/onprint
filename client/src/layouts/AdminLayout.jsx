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
  BookOpen,
  Search,
  Sparkles,
  Bot,
} from 'lucide-react'

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/blog', label: 'Blog Articles', icon: BookOpen },
  { to: '/admin/seo', label: 'AI SEO Manager', icon: Sparkles },
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
      <div className="min-h-screen bg-[#040A18] flex items-center justify-center text-[#F5F3EE]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D6C29A] border-t-transparent" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C2D9]">Verifying Admin Session...</span>
        </div>
      </div>
    )
  }

  // Redirect to Admin Login if unauthenticated or non-admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen w-full bg-[#040A18] text-[#F5F3EE] flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="flex h-16 w-full items-center justify-between border-b border-[#122240] bg-[#020611] px-4 md:hidden shrink-0 z-40">
        <Link to="/admin" className="flex items-center gap-2.5">
          <Logo variant="light" size="sm" />
          <span className="inline-flex items-center gap-1 rounded-full bg-[#D6C29A]/20 border border-[#D6C29A]/40 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#D6C29A] shadow-xs">
            <ShieldCheck className="h-3 w-3 text-[#D6C29A]" />
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-white hover:bg-[#081226] transition-colors cursor-pointer"
          aria-label="Toggle Navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        aria-label="Admin Sidebar Navigation"
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] h-screen max-h-screen overflow-y-auto transform bg-[#020611] border-r border-[#122240] p-5 sm:p-6 text-[#B8C2D9] transition-transform duration-200 ease-in-out flex flex-col admin-sidebar-scroll md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 md:shrink-0 md:flex ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col shrink-0">
          {/* Header Brand Area */}
          <div className="flex items-center justify-between pb-6 border-b border-[#122240] shrink-0">
            <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
              <Logo variant="light" size="sm" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D6C29A] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#040A18] shadow-xs">
                <ShieldCheck className="h-3 w-3" />
                Admin
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-lg p-1 text-[#F5F3EE] hover:bg-[#081226] md:hidden cursor-pointer"
              aria-label="Close Navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User badge */}
          <div className="mt-4 px-1 py-2 border-b border-[#122240] text-xs shrink-0">
            <div className="font-bold text-[#F5F3EE] truncate">{user?.name}</div>
            <div className="text-[10px] text-[#B8C2D9] truncate">{user?.email}</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="mt-4 flex flex-col gap-1.5 shrink-0">
          {navLinks.map((link) => {
            const Icon = link.icon
            const renderNavIcon = () => {
              if (!Icon) return null
              if (React.isValidElement(Icon)) return Icon
              if (typeof Icon === 'function' || typeof Icon === 'string' || (typeof Icon === 'object' && Icon !== null && Icon.$$typeof)) {
                const IconComp = Icon
                return <IconComp className="h-4 w-4 shrink-0" />
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
                      ? 'bg-[#D6C29A] text-[#040A18] shadow-sm font-black'
                      : 'text-[#B8C2D9] hover:bg-[#081226] hover:text-[#F5F3EE]'
                  }`
                }
              >
                {renderNavIcon()}
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer Link back to website */}
        <div className="mt-auto pt-6 border-t border-[#122240] shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-[#B8C2D9] hover:text-[#D6C29A] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            View Public Site
          </Link>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
