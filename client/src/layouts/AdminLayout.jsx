import { Link, NavLink, Outlet } from 'react-router-dom'
import Logo from '../components/Logo'
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
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 bg-primary p-6 text-background/80 md:block">
        <Link to="/admin" className="flex items-center gap-2">
          <Logo variant="light" size="sm" />
          <span className="rounded bg-accent/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent">
            Admin
          </span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive ? 'bg-accent text-white shadow-xs' : 'text-background/70 hover:bg-background/10 hover:text-background'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-12 pt-6 border-t border-background/10">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-background/60 hover:text-background transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            View Public Site
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}

