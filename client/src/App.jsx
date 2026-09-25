import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
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
const ProgrammaticLandingPage = lazy(() => import('./pages/public/ProgrammaticLandingPage'))
const CommercialLandingPage = lazy(() => import('./pages/public/CommercialLandingPage'))
const BusinessCardLandingPage = lazy(() => import('./pages/public/BusinessCardLandingPage'))
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'))

function CategoryRouteRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/categories/${slug}`} replace />
}

function ProductRouteRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/products/${slug}`} replace />
}

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
const AdminSeoManagerPage = lazy(() => import('./pages/admin/seo/AdminSeoManagerPage'))
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
            <Route path="/printing-services/:slug" element={<ProgrammaticLandingPage />} />
            <Route path="/printing-solutions/:slug" element={<ProgrammaticLandingPage />} />

            {/* 16 Dedicated Business Card Topical Cluster Landing Pages */}
            <Route path="/business-card-printing-dubai" element={<BusinessCardLandingPage pageKey="business-card-printing-dubai" />} />
            <Route path="/business-card-printing-uae" element={<BusinessCardLandingPage pageKey="business-card-printing-uae" />} />
            <Route path="/visiting-card-printing-dubai" element={<BusinessCardLandingPage pageKey="visiting-card-printing-dubai" />} />
            <Route path="/premium-business-cards" element={<BusinessCardLandingPage pageKey="premium-business-cards" />} />
            <Route path="/luxury-business-cards" element={<BusinessCardLandingPage pageKey="luxury-business-cards" />} />
            <Route path="/foil-business-cards" element={<BusinessCardLandingPage pageKey="foil-business-cards" />} />
            <Route path="/spot-uv-business-cards" element={<BusinessCardLandingPage pageKey="spot-uv-business-cards" />} />
            <Route path="/velvet-business-cards" element={<BusinessCardLandingPage pageKey="velvet-business-cards" />} />
            <Route path="/soft-touch-business-cards" element={<BusinessCardLandingPage pageKey="soft-touch-business-cards" />} />
            <Route path="/embossed-business-cards" element={<BusinessCardLandingPage pageKey="embossed-business-cards" />} />
            <Route path="/corporate-business-cards" element={<BusinessCardLandingPage pageKey="corporate-business-cards" />} />
            <Route path="/business-card-design" element={<BusinessCardLandingPage pageKey="business-card-design" />} />
            <Route path="/same-day-business-card-printing" element={<BusinessCardLandingPage pageKey="same-day-business-card-printing" />} />
            <Route path="/business-card-printing-abu-dhabi" element={<BusinessCardLandingPage pageKey="business-card-printing-abu-dhabi" />} />
            <Route path="/business-card-printing-sharjah" element={<BusinessCardLandingPage pageKey="business-card-printing-sharjah" />} />
            <Route path="/business-card-printing-ajman" element={<BusinessCardLandingPage pageKey="business-card-printing-ajman" />} />

            {/* Core Commercial SEO Landing Pages */}
            <Route path="/printing-services-dubai" element={<CommercialLandingPage pageKey="printing-services-dubai" />} />
            <Route path="/brochure-printing-dubai" element={<CommercialLandingPage pageKey="brochure-printing-dubai" />} />
            <Route path="/flyer-printing-dubai" element={<CommercialLandingPage pageKey="flyer-printing-dubai" />} />
            <Route path="/packaging-printing-dubai" element={<CommercialLandingPage pageKey="packaging-printing-dubai" />} />
            <Route path="/custom-packaging-dubai" element={<CommercialLandingPage pageKey="custom-packaging-dubai" />} />
            <Route path="/sticker-printing-dubai" element={<CommercialLandingPage pageKey="sticker-printing-dubai" />} />
            <Route path="/label-printing-dubai" element={<CommercialLandingPage pageKey="label-printing-dubai" />} />
            <Route path="/signage-printing-dubai" element={<CommercialLandingPage pageKey="signage-printing-dubai" />} />
            <Route path="/large-format-printing-dubai" element={<CommercialLandingPage pageKey="large-format-printing-dubai" />} />
            <Route path="/corporate-printing-dubai" element={<CommercialLandingPage pageKey="corporate-printing-dubai" />} />
            <Route path="/promotional-printing-dubai" element={<CommercialLandingPage pageKey="promotional-printing-dubai" />} />

            {/* Commercial Landing Page Aliases & Redirects */}
            <Route path="/business-card-printing" element={<Navigate to="/business-card-printing-dubai" replace />} />
            <Route path="/business-cards-dubai" element={<Navigate to="/business-card-printing-dubai" replace />} />
            <Route path="/luxury-business-cards-dubai" element={<Navigate to="/luxury-business-cards" replace />} />
            <Route path="/custom-business-cards-dubai" element={<Navigate to="/premium-business-cards" replace />} />
            <Route path="/visiting-cards-dubai" element={<Navigate to="/visiting-card-printing-dubai" replace />} />
            <Route path="/foil-business-cards-dubai" element={<Navigate to="/foil-business-cards" replace />} />
            <Route path="/spot-uv-business-cards-dubai" element={<Navigate to="/spot-uv-business-cards" replace />} />
            <Route path="/embossed-business-cards-dubai" element={<Navigate to="/embossed-business-cards" replace />} />
            <Route path="/custom-packaging" element={<Navigate to="/custom-packaging-dubai" replace />} />
            <Route path="/packaging-printing" element={<Navigate to="/packaging-printing-dubai" replace />} />
            <Route path="/brochure-printing" element={<Navigate to="/brochure-printing-dubai" replace />} />
            <Route path="/flyer-printing" element={<Navigate to="/flyer-printing-dubai" replace />} />
            <Route path="/sticker-printing" element={<Navigate to="/sticker-printing-dubai" replace />} />
            <Route path="/label-printing" element={<Navigate to="/label-printing-dubai" replace />} />
            <Route path="/signage-printing" element={<Navigate to="/signage-printing-dubai" replace />} />
            <Route path="/large-format-printing" element={<Navigate to="/large-format-printing-dubai" replace />} />
            <Route path="/corporate-printing" element={<Navigate to="/corporate-printing-dubai" replace />} />
            <Route path="/promotional-printing" element={<Navigate to="/promotional-printing-dubai" replace />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryDetailPage />} />
            <Route path="/category/:slug" element={<CategoryRouteRedirect />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/product/:slug" element={<ProductRouteRedirect />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/get-a-quote" element={<GetQuotePage />} />
            <Route path="/quote" element={<Navigate to="/get-a-quote" replace />} />
            <Route path="/get-quote" element={<Navigate to="/get-a-quote" replace />} />
            <Route path="/quote-request" element={<Navigate to="/get-a-quote" replace />} />
            <Route path="/pricing" element={<Navigate to="/get-a-quote" replace />} />
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

            {/* SEO Management Routes */}
            <Route path="seo" element={<AdminSeoManagerPage />} />
            <Route path="seo-audit" element={<Navigate to="/admin/seo" replace />} />

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
