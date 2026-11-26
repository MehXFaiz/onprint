<?php
/**
 * ONPRINT Dubai — Entry Point & Clean Front-Controller Router (index.php)
 * Pure Frontend-Only PHP Template Engine for Hostinger Shared Hosting.
 * Zero Backend API, Zero Database, Zero Admin Panel, Zero User Authentication.
 */

require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/helpers.php';
require_once __DIR__ . '/includes/icons.php';

// Normalize trailing slashes via 301 redirect so relative paths always resolve consistently
$rawPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$rootCandidate = ($BASE_PATH === '') ? '/' : ($BASE_PATH . '/');
if ($rawPath !== '/' && $rawPath !== $rootCandidate && substr($rawPath, -1) === '/') {
    $cleanTarget = rtrim($rawPath, '/');
    if (!empty($_SERVER['QUERY_STRING'])) {
        $cleanTarget .= '?' . $_SERVER['QUERY_STRING'];
    }
    header('Location: ' . $cleanTarget, true, 301);
    exit;
}

// Explicitly block removed Admin / Login / Register / API routes with clean 404
if (
    $ROUTE_PATH === '/admin' ||
    strpos($ROUTE_PATH, '/admin/') === 0 ||
    $ROUTE_PATH === '/login' ||
    $ROUTE_PATH === '/register' ||
    $ROUTE_PATH === '/api' ||
    strpos($ROUTE_PATH, '/api/') === 0
) {
    http_response_code(404);
    include __DIR__ . '/pages/404.php';
    exit;
}

// Canonical 301 Redirects (Ported from client/src/App.jsx)
$redirects = [
    '/packaging-printing-dubai' => '/services/luxury-packaging-custom-boxes',
    '/custom-packaging-dubai' => '/services/luxury-packaging-custom-boxes',
    '/custom-packaging' => '/services/luxury-packaging-custom-boxes',
    '/packaging-printing' => '/services/luxury-packaging-custom-boxes',
    '/business-card-printing' => '/business-card-printing-dubai',
    '/business-cards-dubai' => '/business-card-printing-dubai',
    '/luxury-business-cards-dubai' => '/luxury-business-cards',
    '/visiting-cards-dubai' => '/visiting-card-printing-dubai',
    '/foil-business-cards-dubai' => '/foil-business-cards',
    '/spot-uv-business-cards-dubai' => '/spot-uv-business-cards',
    '/embossed-business-cards-dubai' => '/embossed-business-cards',
    '/matte-business-cards-dubai' => '/matte-business-cards',
    '/bulk-business-card-printing-dubai' => '/bulk-business-cards',
    '/bulk-business-cards-dubai' => '/bulk-business-cards',
    '/business-cards' => '/business-card-printing-dubai',
    '/business-cards/premium-business-cards' => '/premium-business-cards',
    '/business-cards/foil-business-cards' => '/foil-business-cards',
    '/business-cards/matte-business-cards' => '/matte-business-cards',
    '/business-cards/corporate-business-cards' => '/corporate-business-cards',
    '/business-cards/bulk-business-cards' => '/bulk-business-cards',
    '/business-cards/luxury-business-cards' => '/luxury-business-cards',
    '/brochure-printing' => '/brochure-printing-dubai',
    '/flyer-printing' => '/flyer-printing-dubai',
    '/flyers-printing' => '/categories/flyers-printing-in-dubai',
    '/flyers' => '/categories/flyers-printing-in-dubai',
    '/flyer-and-leaflet-printing' => '/categories/flyers-printing-in-dubai',
    '/flyers-and-leaflets' => '/categories/flyers-printing-in-dubai',
    '/sticker-printing' => '/sticker-printing-dubai',
    '/stickers' => '/sticker-printing-dubai',
    '/stickers-labels-printing' => '/sticker-printing-dubai',
    '/custom-stickers-dubai' => '/sticker-printing-dubai',
    '/stickers/custom-stickers' => '/products/die-cut-stickers',
    '/stickers/logo-stickers' => '/products/die-cut-stickers',
    '/stickers/product-labels' => '/products/custom-roll-labels',
    '/stickers/packaging-stickers' => '/products/cosmetic-bottle-labels',
    '/stickers/vinyl-stickers' => '/products/waterproof-vinyl-stickers',
    '/stickers/die-cut-stickers' => '/products/die-cut-stickers',
    '/stickers/waterproof-stickers' => '/products/waterproof-vinyl-stickers',
    '/stickers/transparent-stickers' => '/products/clear-transparent-stickers',
    '/stickers/bulk-stickers' => '/products/custom-roll-labels',
    '/label-printing' => '/label-printing-dubai',
    '/rollup-banners' => '/services/rollup-banners',
    '/roll-up-banners' => '/services/rollup-banners',
    '/rollup-banner-printing-dubai' => '/services/rollup-banners',
    '/roll-up-banner-printing-dubai' => '/services/rollup-banners',
    '/services/stamps' => '/categories/stamps-printing-dubai',
    '/services/custom-stamps' => '/categories/stamps-printing-dubai',
    '/services/brochures-printing' => '/brochure-printing-dubai',
    '/categories/brochures-printing' => '/brochure-printing-dubai',
    '/signage-printing' => '/signage-printing-dubai',
    '/large-format-printing' => '/large-format-printing-dubai',
    '/corporate-printing' => '/corporate-printing-dubai',
    '/promotional-printing' => '/promotional-printing-dubai',
    '/bottle-printing' => '/bottle-printing-dubai',
    '/water-bottle-printing-dubai' => '/bottle-printing-dubai',
    '/custom-bottle-printing-dubai' => '/bottle-printing-dubai',
    '/custom-bottles-dubai' => '/bottle-printing-dubai',
    '/products/luxury-packaging-custom-boxes' => '/services/luxury-packaging-custom-boxes',
    '/services/business-cards-printing' => '/business-card-printing-dubai',
    '/blog/digital-vs-offset-printing-dubai-cost-comparison' => '/blog/digital-vs-offset-printing-dubai',
    '/blog/sustainable-fsc-certified-printing-uae-net-zero-2050' => '/blog/sustainable-fsc-certified-printing-uae',
    '/blog/corporate-stationery-essentials-new-companies-dubai-difc' => '/blog/corporate-stationery-essentials-dubai-setup',
    '/blog/luxury-printing-finishes-gold-foil-vs-spot-uv' => '/blog/luxury-printing-finishes-gold-foil-spot-uv-embossing',
    '/blog/synthetic-waterproof-restaurant-menus-dubai' => '/blog/synthetic-waterproof-menus-dubai-restaurants',
    '/finishing-showcase' => '/finishes',
    '/quote' => '/get-a-quote',
    '/get-quote' => '/get-a-quote',
    '/quote-request' => '/get-a-quote',
    '/pricing' => '/get-a-quote',
    '/track' => '/track-order',
    '/orders/track' => '/track-order',
    '/order-tracking' => '/track-order',
    '/customer' => '/track-order',
    '/account' => '/track-order',
    '/quote/water-bottles' => '/quote/bottles',
];

if (isset($redirects[$ROUTE_PATH])) {
    header('Location: ' . ($BASE_PATH . $redirects[$ROUTE_PATH]), true, 301);
    exit;
}

if (preg_match('#^/category/([a-zA-Z0-9_-]+)$#', $ROUTE_PATH, $m)) {
    header('Location: ' . ($BASE_PATH . '/categories/' . $m[1]), true, 301);
    exit;
}
if (preg_match('#^/product/([a-zA-Z0-9_-]+)$#', $ROUTE_PATH, $m)) {
    header('Location: ' . ($BASE_PATH . '/products/' . $m[1]), true, 301);
    exit;
}
if (strpos($ROUTE_PATH, '/customer/') === 0 || strpos($ROUTE_PATH, '/account/') === 0) {
    header('Location: ' . ($BASE_PATH . '/track-order'), true, 301);
    exit;
}

// Static Exact Routes
$staticRoutes = [
    '/' => 'home.php',
    '/about' => 'about.php',
    '/services' => 'services.php',
    '/categories' => 'categories.php',
    '/products' => 'products.php',
    '/blog' => 'blog.php',
    '/portfolio' => 'portfolio.php',
    '/finishes' => 'finishes.php',
    '/faq' => 'faq.php',
    '/contact' => 'contact.php',
    '/get-a-quote' => 'get-quote.php',
    '/corporate-quotes' => 'corporate-quote.php',
    '/bulk-orders' => 'corporate-quote.php',
    '/track-order' => 'track-order.php',
    '/privacy-policy' => 'privacy-policy.php',
    '/terms' => 'terms.php',
    // Stickers & Stamps Dedicated Hubs
    '/sticker-printing-dubai' => 'stickers-landing.php',
    '/rubber-stamps-dubai' => 'stamps-landing.php',
    '/services/stamps-printing-dubai' => 'stamps-landing.php',
    '/categories/custom-stamps-seals' => 'stamps-landing.php',
    '/categories/stamps-printing-dubai' => 'stamps-landing.php',
    '/stamps' => 'stamps-landing.php',
    '/custom-stamps' => 'stamps-landing.php',
    '/company-stamps-dubai' => 'stamps-landing.php',
    '/stamp-maker-dubai' => 'stamps-landing.php',
    '/custom-stamp-printing-dubai' => 'stamps-landing.php',
    '/custom-rubber-stamps' => 'stamps-landing.php',
    '/quote/stamps' => 'stamps-landing.php',
    // Specialized Lead Pages
    '/quote/business-cards' => 'lead-page.php',
    '/quote/stickers' => 'lead-page.php',
    '/quote/mugs' => 'lead-page.php',
    '/quote/bottles' => 'lead-page.php',
    '/quote/rollup-banners' => 'lead-page.php',
    // Bilingual Arabic Portal
    '/ar' => 'ar-home.php',
    '/ar/business-cards' => 'ar-business-cards.php',
    '/ar/business-card-printing-dubai' => 'ar-business-cards.php',
    '/ar/stickers' => 'ar-stickers.php',
    '/ar/sticker-printing-dubai' => 'ar-stickers.php',
    '/ar/stickers-labels-printing' => 'ar-stickers.php',
    '/ar/stamps' => 'ar-stamps.php',
    '/ar/custom-stamps-seals' => 'ar-stamps.php',
    '/ar/printing-services' => 'ar-printing-services.php',
];

if (isset($staticRoutes[$ROUTE_PATH])) {
    include __DIR__ . '/pages/' . $staticRoutes[$ROUTE_PATH];
    exit;
}

// Business Card Topical Cluster Routes (20 pages)
$bcData = load_json_data('businessCardsLanding');
$bcKey = ltrim($ROUTE_PATH, '/');
if (isset($bcData[$bcKey])) {
    $pageKey = $bcKey;
    include __DIR__ . '/pages/business-card-landing.php';
    exit;
}

// Commercial SEO Landing Pages (15 pages)
$commData = load_json_data('commercialLanding');
if (isset($commData[$bcKey])) {
    $pageKey = $bcKey;
    include __DIR__ . '/pages/commercial-landing.php';
    exit;
}

// Emirate Location Landing Pages
$emirateRoutes = [
    '/printing-services-abu-dhabi' => 'abu-dhabi',
    '/printing-services-sharjah' => 'sharjah',
    '/printing-services-ajman' => 'ajman',
    '/printing-services-ras-al-khaimah' => 'ras-al-khaimah',
];
if (isset($emirateRoutes[$ROUTE_PATH])) {
    $locationKey = $emirateRoutes[$ROUTE_PATH];
    include __DIR__ . '/pages/location-landing.php';
    exit;
}

// Dynamic Slug Routes
if (preg_match('#^/services/([a-zA-Z0-9_-]+)$#', $ROUTE_PATH, $m)) {
    $slug = $m[1];
    include __DIR__ . '/pages/service-detail.php';
    exit;
}

if (preg_match('#^/categories/([a-zA-Z0-9_-]+)$#', $ROUTE_PATH, $m)) {
    $slug = $m[1];
    include __DIR__ . '/pages/category-detail.php';
    exit;
}

if (preg_match('#^/products/([a-zA-Z0-9_-]+)$#', $ROUTE_PATH, $m)) {
    $slug = $m[1];
    include __DIR__ . '/pages/product-detail.php';
    exit;
}

if (preg_match('#^/blog/([a-zA-Z0-9_-]+)$#', $ROUTE_PATH, $m)) {
    $slug = $m[1];
    include __DIR__ . '/pages/blog-post.php';
    exit;
}

if (preg_match('#^/printing-services/([a-zA-Z0-9_-]+)$#', $ROUTE_PATH, $m)) {
    $slug = $m[1];
    $progType = 'location';
    include __DIR__ . '/pages/programmatic-landing.php';
    exit;
}

if (preg_match('#^/printing-solutions/([a-zA-Z0-9_-]+)$#', $ROUTE_PATH, $m)) {
    $slug = $m[1];
    $progType = 'use_case';
    include __DIR__ . '/pages/programmatic-landing.php';
    exit;
}

// Fallback 404
http_response_code(404);
include __DIR__ . '/pages/404.php';
