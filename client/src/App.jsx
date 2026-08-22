import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import GoogleAnalytics from './components/GoogleAnalytics'

import HomePage from './pages/public/HomePage'

// Lazy load secondary public pages for optimal initial bundle size and fastest FCP
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/public/ServiceDetailPage'))
const CategoriesPage = lazy(() => import('./pages/public/CategoriesPage'))
const CategoryDetailPage = lazy(() => import('./pages/public/CategoryDetailPage'))
const ProductsPage = lazy(() => import('./pages/public/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/public/ProductDetailPage'))
const BlogPage = lazy(() => import('./pages/public/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/public/BlogPostPage'))
const PortfolioPage = lazy(() => import('./pages/public/PortfolioPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))
const GetQuotePage = lazy(() => import('./pages/public/GetQuotePage'))
const TrackOrderPage = lazy(() => import('./pages/public/TrackOrderPage'))
const FaqPage = lazy(() => import('./pages/public/FaqPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/public/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/public/TermsPage'))
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'))

// Lazy load admin section and layouts to dramatically improve initial page load performance
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'))
const AdminProductFormPage = lazy(() => import('./pages/admin/AdminProductFormPage'))
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'))
const AdminCategoryFormPage = lazy(() => import('./pages/admin/AdminCategoryFormPage'))
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'))
const AdminServiceFormPage = lazy(() => import('./pages/admin/AdminServiceFormPage'))
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'))
const AdminBlogFormPage = lazy(() => import('./pages/admin/AdminBlogFormPage'))
const AdminSeoAuditPage = lazy(() => import('./pages/admin/AdminSeoAuditPage'))
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'))
const AdminOrderFormPage = lazy(() => import('./pages/admin/AdminOrderFormPage'))
const AdminQuotesPage = lazy(() => import('./pages/admin/AdminQuotesPage'))
const AdminQuoteFormPage = lazy(() => import('./pages/admin/AdminQuoteFormPage'))
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'))
const AdminCustomerFormPage = lazy(() => import('./pages/admin/AdminCustomerFormPage'))
const AdminPortfolioPage = lazy(() => import('./pages/admin/AdminPortfolioPage'))
const AdminPortfolioFormPage = lazy(() => import('./pages/admin/AdminPortfolioFormPage'))
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'))
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'))

function SuspenseFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#A82F19] border-t-transparent" />
    </div>
  )
}

function App() {
  return (
    <>
      <GoogleAnalytics />
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryDetailPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/get-a-quote" element={<GetQuotePage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/track" element={<Navigate to="/track-order" replace />} />
            <Route path="/orders/track" element={<Navigate to="/track-order" replace />} />
            <Route path="/order-tracking" element={<Navigate to="/track-order" replace />} />
            <Route path="/customer/*" element={<Navigate to="/track-order" replace />} />
            <Route path="/customer" element={<Navigate to="/track-order" replace />} />
            <Route path="/account/*" element={<Navigate to="/track-order" replace />} />
            <Route path="/account" element={<Navigate to="/track-order" replace />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />
            <Route path="/register" element={<Navigate to="/admin/login" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />

            {/* Categories Dedicated Routes */}
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="categories/new" element={<AdminCategoryFormPage />} />
            <Route path="categories/:id/edit" element={<AdminCategoryFormPage />} />

            {/* Products Dedicated Routes */}
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductFormPage />} />
            <Route path="products/:id/edit" element={<AdminProductFormPage />} />

            {/* Services Dedicated Routes */}
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="services/new" element={<AdminServiceFormPage />} />
            <Route path="services/:id/edit" element={<AdminServiceFormPage />} />

            {/* Blog Dedicated Routes */}
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="blog/new" element={<AdminBlogFormPage />} />
            <Route path="blog/:id/edit" element={<AdminBlogFormPage />} />

            {/* SEO Audit Tool Route */}
            <Route path="seo-audit" element={<AdminSeoAuditPage />} />

            {/* Orders Dedicated Routes */}
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/new" element={<AdminOrderFormPage />} />
            <Route path="orders/:id/edit" element={<AdminOrderFormPage />} />

            {/* Quotes Dedicated Routes */}
            <Route path="quotes" element={<AdminQuotesPage />} />
            <Route path="quotes/new" element={<AdminQuoteFormPage />} />
            <Route path="quotes/:id/edit" element={<AdminQuoteFormPage />} />

            {/* Customers Dedicated Routes */}
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="customers/new" element={<AdminCustomerFormPage />} />
            <Route path="customers/:id/edit" element={<AdminCustomerFormPage />} />

            {/* Portfolio Dedicated Routes */}
            <Route path="portfolio" element={<AdminPortfolioPage />} />
            <Route path="portfolio/new" element={<AdminPortfolioFormPage />} />
            <Route path="portfolio/:id/edit" element={<AdminPortfolioFormPage />} />

            {/* Messages & Settings */}
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
