import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import ServicesPage from './pages/public/ServicesPage'
import ServiceDetailPage from './pages/public/ServiceDetailPage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import PortfolioPage from './pages/public/PortfolioPage'
import ContactPage from './pages/public/ContactPage'
import GetQuotePage from './pages/public/GetQuotePage'
import FaqPage from './pages/public/FaqPage'
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage'
import TermsPage from './pages/public/TermsPage'
import NotFoundPage from './pages/public/NotFoundPage'

import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminProductFormPage from './pages/admin/AdminProductFormPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminCategoryFormPage from './pages/admin/AdminCategoryFormPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminServiceFormPage from './pages/admin/AdminServiceFormPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminOrderFormPage from './pages/admin/AdminOrderFormPage'
import AdminQuotesPage from './pages/admin/AdminQuotesPage'
import AdminQuoteFormPage from './pages/admin/AdminQuoteFormPage'
import AdminCustomersPage from './pages/admin/AdminCustomersPage'
import AdminCustomerFormPage from './pages/admin/AdminCustomerFormPage'
import AdminPortfolioPage from './pages/admin/AdminPortfolioPage'
import AdminPortfolioFormPage from './pages/admin/AdminPortfolioFormPage'
import AdminMessagesPage from './pages/admin/AdminMessagesPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/get-a-quote" element={<GetQuotePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/register" element={<Navigate to="/admin/login" replace />} />
        <Route path="/account/*" element={<Navigate to="/admin" replace />} />
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
  )
}

export default App
