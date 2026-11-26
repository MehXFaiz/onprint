<?php
/**
 * ONPRINT Dubai — Reusable Document Header (includes/header.php)
 * Renders HTML5 <head>, SEO metadata, JSON-LD schemas, relative stylesheets, and includes navigation.php.
 */

$metaTitle = $pageMeta['title'] ?? 'ONPRINT | Printing Services Dubai — Business Cards, Stickers, Stamps & Custom Printing';
$metaDescription = $pageMeta['description'] ?? 'Trusted printing company in Dubai, Al Quoz. Custom business cards, waterproof stickers, rubber stamps, brochures, flyers, roll-up banners & bottle printing. Same-day express UAE delivery.';
$metaKeywords = $pageMeta['keywords'] ?? 'printing services dubai, business card printing dubai, sticker printing dubai, rubber stamps dubai, brochure printing dubai, flyer printing dubai, roll up banner dubai, onprint';
$canonicalPath = $pageMeta['canonical'] ?? $ROUTE_PATH;
$canonicalUrl = rtrim(SITE_URL, '/') . ($canonicalPath === '/' ? '/' : '/' . ltrim($canonicalPath, '/'));
$ogImage = !empty($pageMeta['ogImage']) ? $pageMeta['ogImage'] : (SITE_URL . '/logo_icon.png');
$robotsContent = !empty($pageMeta['noindex']) ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1';
$htmlLang = $IS_ARABIC ? 'ar' : 'en';
$htmlDir = $IS_ARABIC ? 'rtl' : 'ltr';

// Build Organization / LocalBusiness Schema
$localBusinessSchema = [
    '@context' => 'https://schema.org',
    '@type' => 'LocalBusiness',
    'name' => SITE_NAME,
    'legalName' => SITE_LEGAL_NAME,
    'url' => SITE_URL,
    'telephone' => FORMATTED_PHONE,
    'email' => CONTACT_EMAIL,
    'priceRange' => '$$',
    'address' => [
        '@type' => 'PostalAddress',
        'streetAddress' => 'Al Quoz Industrial Area 3',
        'addressLocality' => 'Dubai',
        'addressRegion' => 'Dubai',
        'addressCountry' => 'AE',
    ],
];
?><!doctype html>
<html lang="<?= e($htmlLang) ?>" dir="<?= e($htmlDir) ?>">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#F5F0E7" />
  <title><?= e($metaTitle) ?></title>
  <meta name="description" content="<?= e($metaDescription) ?>" />
  <meta name="keywords" content="<?= e($metaKeywords) ?>" />
  <meta name="robots" content="<?= e($robotsContent) ?>" />
  <link rel="canonical" href="<?= e($canonicalUrl) ?>" />

  <!-- Open Graph & Social Meta -->
  <meta property="og:type" content="<?= e($pageMeta['ogType'] ?? 'website') ?>" />
  <meta property="og:site_name" content="ONPRINT Dubai" />
  <meta property="og:title" content="<?= e($metaTitle) ?>" />
  <meta property="og:description" content="<?= e($metaDescription) ?>" />
  <meta property="og:url" content="<?= e($canonicalUrl) ?>" />
  <meta property="og:image" content="<?= e($ogImage) ?>" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= e($metaTitle) ?>" />
  <meta name="twitter:description" content="<?= e($metaDescription) ?>" />

  <!-- Favicons & Web Manifest (Relative Paths) -->
  <link rel="icon" type="image/svg+xml" href="<?= e(asset('favicon.svg')) ?>" />
  <link rel="icon" type="image/png" sizes="48x48" href="<?= e(asset('favicon-48x48.png')) ?>" />
  <link rel="icon" type="image/png" sizes="32x32" href="<?= e(asset('favicon-32x32.png')) ?>" />
  <link rel="icon" type="image/png" sizes="16x16" href="<?= e(asset('favicon-16x16.png')) ?>" />
  <link rel="shortcut icon" href="<?= e(asset('favicon.ico')) ?>" />
  <link rel="apple-touch-icon" sizes="180x180" href="<?= e(asset('apple-touch-icon.png')) ?>" />
  <link rel="manifest" href="<?= e(asset('manifest.json')) ?>" />

  <!-- Typography: Plus Jakarta Sans, Playfair Display & Cairo (for RTL Arabic) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />

  <!-- Compiled Local CSS3 Stylesheet (Zero External JS/CSS Framework Dependencies) -->
  <link rel="stylesheet" href="<?= e(asset('assets/css/style.css')) ?>" />

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json"><?= json_encode($localBusinessSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?></script>
  <?php if (!empty($pageMeta['faqList']) && is_array($pageMeta['faqList'])):
      $faqEntities = [];
      foreach ($pageMeta['faqList'] as $fq) {
          $qText = $fq['question'] ?? $fq['q'] ?? '';
          $aText = $fq['answer'] ?? $fq['a'] ?? '';
          if ($qText !== '' && $aText !== '') {
              $faqEntities[] = [
                  '@type' => 'Question',
                  'name' => $qText,
                  'acceptedAnswer' => ['@type' => 'Answer', 'text' => $aText],
              ];
          }
      }
      if (!empty($faqEntities)):
  ?>
  <script type="application/ld+json"><?= json_encode(['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $faqEntities], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?></script>
  <?php endif; endif; ?>
  <?php if (!empty($pageMeta['extraSchema']) && is_array($pageMeta['extraSchema'])): ?>
  <script type="application/ld+json"><?= json_encode($pageMeta['extraSchema'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?></script>
  <?php endif; ?>
</head>
<body class="bg-[#F5F0E7] text-[#352719] antialiased flex min-h-screen flex-col selection:bg-[#C5A989] selection:text-[#352719]" data-rel-prefix="<?= e($REL_PREFIX) ?>" data-whatsapp-phone="<?= e(WHATSAPP_PHONE) ?>" data-contact-email="<?= e(CONTACT_EMAIL) ?>">
  <!-- Accessibility Skip Link -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-[#795C43] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg">
    Skip to main content
  </a>

  <?php include __DIR__ . '/navigation.php'; ?>

  <main id="main-content" class="flex-1 outline-none" tabindex="-1">
