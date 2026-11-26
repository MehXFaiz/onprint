<?php
/**
 * ONPRINT Dubai — Reusable Navigation Bar & Universal Search Modal (includes/navigation.php)
 * Exact port of client/src/components/SiteHeader.jsx
 */

$megaMenuCategories = [
    [
        'key' => 'business-corporate',
        'title' => 'Business & Corporate Printing',
        'subtitle' => 'Executive Identity & Presswork',
        'icon' => 'briefcase',
        'overviewPath' => '/categories/office-stationery-printing',
        'items' => [
            ['label' => 'Business Cards', 'to' => '/business-card-printing-dubai', 'badge' => 'Popular', 'desc' => '350–450 GSM matte, gloss & silk cards'],
            ['label' => 'Premium Business Cards', 'to' => '/premium-business-cards', 'badge' => 'Luxury', 'desc' => '600 GSM cotton, 24K foil & 3D spot UV'],
            ['label' => 'Corporate Stationery', 'to' => '/categories/office-stationery-printing', 'desc' => 'Complete brand stationery suites'],
            ['label' => 'Letterheads', 'to' => '/categories/letterheads-printing-dubai', 'desc' => '120 GSM laser-safe Conqueror & bond'],
            ['label' => 'Corporate Envelopes', 'to' => '/products/matching-corporate-envelopes', 'desc' => 'Custom DL, C5 & C4 window envelopes'],
            ['label' => 'Presentation Folders & NCR', 'to' => '/products/corporate-presentation-folders', 'desc' => 'Die-cut pocket folders & invoice books'],
            ['label' => 'PVC ID Cards & Lanyards', 'to' => '/categories/id-card-printing-dubai', 'desc' => 'CR80 smart cards & sublimated lanyards'],
        ],
    ],
    [
        'key' => 'marketing-promotional',
        'title' => 'Marketing & Promotional',
        'subtitle' => 'Campaigns, Events & Displays',
        'icon' => 'megaphone',
        'overviewPath' => '/categories/flyers-printing-in-dubai',
        'items' => [
            ['label' => 'Flyers & Leaflets', 'to' => '/categories/flyers-printing-in-dubai', 'badge' => 'Express', 'desc' => 'A6, A5, A4 & DL high-speed handouts'],
            ['label' => 'Folded Brochures', 'to' => '/brochure-printing-dubai', 'desc' => 'Bi-fold, tri-fold & Z-fold company profiles'],
            ['label' => 'Large Format Posters', 'to' => '/products/large-format-posters', 'desc' => 'A3, A2, A1 & A0 high-resolution prints'],
            ['label' => 'Roll-Up Banners', 'to' => '/services/rollup-banners', 'badge' => 'Same-Day', 'desc' => '85×200cm curl-free stands with bag'],
            ['label' => 'Catalogs & Booklets', 'to' => '/categories/catalogs-booklets-printing', 'desc' => 'Saddle-stitched & PUR bound catalogs'],
            ['label' => 'Hospitality Menus', 'to' => '/categories/hospitality-event-printing', 'desc' => 'Waterproof café menus & tent cards'],
        ],
    ],
    [
        'key' => 'stickers-labels',
        'title' => 'Stickers & Labels',
        'subtitle' => 'Waterproof Vinyl & Packaging Rolls',
        'icon' => 'tag',
        'overviewPath' => '/sticker-printing-dubai',
        'items' => [
            ['label' => 'Custom Stickers', 'to' => '/sticker-printing-dubai', 'badge' => 'Bestseller', 'desc' => 'All custom shapes, finishes & sizes'],
            ['label' => 'Product Roll Labels', 'to' => '/products/custom-roll-labels', 'desc' => 'Machine & hand-dispensed BOPP rolls'],
            ['label' => 'Vinyl Stickers', 'to' => '/products/waterproof-vinyl-stickers', 'badge' => 'Waterproof', 'desc' => 'UV-resistant outdoor & jar vinyl'],
            ['label' => 'Die-Cut Stickers', 'to' => '/products/die-cut-stickers', 'desc' => 'Precision optical contour-cut brand decals'],
            ['label' => 'Custom Packaging Labels', 'to' => '/products/cosmetic-bottle-labels', 'desc' => 'Oil-proof jar & retail box seals'],
            ['label' => 'Gold Foil & Clear Labels', 'to' => '/products/gold-foil-stickers', 'desc' => 'Metallic hot-stamped & clear labels'],
        ],
    ],
    [
        'key' => 'stamps-seals',
        'title' => 'Stamps & Seals',
        'subtitle' => 'Official UAE Company Seals',
        'icon' => 'stamp',
        'overviewPath' => '/categories/stamps-printing-dubai',
        'items' => [
            ['label' => 'Company Stamps', 'to' => '/categories/stamps-printing-dubai', 'badge' => 'DED Approved', 'desc' => 'Official Arabic/English mainland & freezone'],
            ['label' => 'Self-Inking Stamps', 'to' => '/products/self-inking-company-stamps', 'desc' => 'Original Trodat 10,000+ impressions'],
            ['label' => 'Rubber & Dater Stamps', 'to' => '/products/heavy-duty-dater-stamps', 'desc' => 'Heavy-duty steel frame date stamps'],
            ['label' => 'Pocket Mobile Stamps', 'to' => '/products/pocket-mobile-stamps', 'desc' => 'Compact flip-open stamps for executives'],
            ['label' => 'Custom Brass Wax Seals', 'to' => '/products/luxury-brass-wax-seal-stamps', 'badge' => 'Bespoke', 'desc' => '3D CNC-engraved brass seals & embossers'],
        ],
    ],
    [
        'key' => 'packaging-custom',
        'title' => 'Packaging & Custom Printing',
        'subtitle' => 'Bottles, Boxes, Merch & Finishes',
        'icon' => 'package',
        'overviewPath' => '/services/luxury-packaging-custom-boxes',
        'items' => [
            ['label' => 'Bottle Printing', 'to' => '/bottle-printing-dubai', 'badge' => '360° UV', 'desc' => 'Thermal bottles, LED flasks & tumblers'],
            ['label' => 'Custom Luxury Packaging', 'to' => '/services/luxury-packaging-custom-boxes', 'desc' => 'Magnetic rigid boxes & mailers'],
            ['label' => 'Custom Ceramic Mugs', 'to' => '/categories/mug-printing-dubai', 'desc' => 'Dishwasher-safe corporate & photo mugs'],
            ['label' => 'Name Badges & Plaques', 'to' => '/categories/name-badges-printing-dubai', 'desc' => 'Magnetic brushed gold/silver staff badges'],
            ['label' => 'Signage & Flags', 'to' => '/categories/signage-banners-printing', 'desc' => 'Acrylic letters, backdrops & flags'],
            ['label' => 'Corporate Gifts & Apparel', 'to' => '/categories/corporate-gift-items', 'desc' => 'VIP onboarding kits, polo shirts & merch'],
        ],
    ],
];

$companyLinks = [
    ['label' => 'About ONPRINT', 'to' => '/about', 'desc' => 'Commercial pressroom atelier in Al Quoz, Dubai', 'icon' => 'info'],
    ['label' => 'Printing Services', 'to' => '/services', 'desc' => 'Complete overview of offset & digital press services', 'icon' => 'layers'],
    ['label' => 'Portfolio Showcase', 'to' => '/portfolio', 'desc' => 'Selected client works, luxury cards & packaging', 'icon' => 'sparkles'],
    ['label' => 'Technical Print Blog', 'to' => '/blog', 'desc' => 'Expert paper specs, GSM guide & luxury finishes', 'icon' => 'book-open'],
    ['label' => 'Contact Pressroom', 'to' => '/contact', 'desc' => 'Al Quoz facility address, pre-press consultations', 'icon' => 'send'],
    ['label' => 'FAQ & Specifications', 'to' => '/faq', 'desc' => 'Turnaround, artwork setup, bleed & delivery', 'icon' => 'help-circle'],
];

$popularSearches = [
    ['label' => 'Luxury Foil Business Cards', 'to' => '/premium-business-cards'],
    ['label' => 'Waterproof Vinyl Stickers', 'to' => '/sticker-printing-dubai'],
    ['label' => 'Roll-Up Banner 85×200cm', 'to' => '/services/rollup-banners'],
    ['label' => 'Official Company Stamp', 'to' => '/categories/stamps-printing-dubai'],
    ['label' => 'Custom Bottle Printing', 'to' => '/bottle-printing-dubai'],
    ['label' => 'Luxury Paper Finishes', 'to' => '/finishes'],
];

$isCatalogActive = ($ROUTE_PATH === '/products' || $ROUTE_PATH === '/categories' || strpos($ROUTE_PATH, '/products/') === 0 || (strpos($ROUTE_PATH, '/categories/') === 0 && strpos($ROUTE_PATH, 'stamps-printing-dubai') === false));
$isCompanyActive = false;
foreach (['/about', '/services', '/portfolio', '/blog', '/contact', '/faq'] as $cp) {
    if ($ROUTE_PATH === $cp || strpos($ROUTE_PATH, $cp . '/') === 0) {
        $isCompanyActive = true;
        break;
    }
}
$counterpartLangUrl = get_counterpart_lang_url($ROUTE_PATH);
?>
<header id="site-header" class="sticky top-0 z-50 w-full pt-2 sm:pt-3 pb-2 px-3 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none select-none" dir="ltr">
  <div class="mx-auto max-w-[1360px] flex flex-col items-center">

    <!-- 1. TOP INFORMATION SYSTEM — TRANSLUCENT GLASS UTILITY STRIP -->
    <div id="header-top-strip" class="hidden md:flex items-center justify-between w-full max-w-[1320px] px-5 py-1.5 rounded-full bg-[#101D35]/70 backdrop-blur-xl border border-[#D4AF65]/25 text-[#F5F2EB] shadow-[0_4px_24px_rgba(16,29,53,0.35)] text-[11px] font-medium transition-all duration-300 pointer-events-auto mb-2 relative z-20 max-h-10 opacity-100">
      <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <span class="inline-flex items-center gap-1.5 text-white/90 font-semibold truncate">
          <?= icon('map-pin', 'h-3 w-3 text-[#D4AF65] shrink-0') ?>
          <span>Dubai, UAE</span>
        </span>
        <span class="text-[#D4AF65]/50">•</span>
        <span class="inline-flex items-center gap-1.5 text-[#F5F2EB]/85 font-medium truncate">
          <span>Doorstep Express Dispatch</span>
        </span>
        <span class="text-[#D4AF65]/50">•</span>
        <span class="inline-flex items-center gap-1.5 text-emerald-400 font-semibold truncate">
          <?= icon('truck', 'h-3 w-3 text-emerald-400 shrink-0') ?>
          <span>Doorstep UAE Delivery</span>
        </span>
        <span class="text-[#D4AF65]/50">•</span>
        <span class="inline-flex items-center gap-1 text-[#D4AF65] font-semibold truncate">
          <?= icon('clock', 'h-3 w-3 text-[#D4AF65] shrink-0') ?>
          <span>Express 24h Turnaround</span>
        </span>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <a href="https://wa.me/<?= e(WHATSAPP_PHONE) ?>?text=Hi%20ONPRINT%20Hotline,%20I%20have%20an%20urgent%20print%20inquiry" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-white/90 hover:text-[#D4AF65] transition-colors font-semibold group" title="Direct Al Quoz Press Hotline">
          <?= icon('phone', 'h-3 w-3 text-[#D4AF65] group-hover:scale-110 transition-transform') ?>
          <span>Hotline: <span class="text-[#D4AF65] font-mono tracking-wide"><?= e(FORMATTED_PHONE) ?></span></span>
        </a>

        <span class="text-[#D4AF65]/50">•</span>

        <!-- Help & Support Dropdown -->
        <div class="relative" data-dropdown="support">
          <button type="button" data-dropdown-toggle="support" class="inline-flex items-center gap-1 text-white/90 hover:text-[#D4AF65] font-semibold transition-colors cursor-pointer" aria-expanded="false">
            <?= icon('help-circle', 'h-3 w-3 text-[#D4AF65]') ?>
            <span>Help &amp; Support</span>
            <?= icon('chevron-down', 'h-3 w-3 text-white/60 transition-transform duration-200 data-chevron') ?>
          </button>

          <div data-dropdown-panel="support" class="hidden absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#101D35]/95 backdrop-blur-2xl border border-[#D4AF65]/35 shadow-[0_20px_45px_rgba(16,29,53,0.65)] p-2.5 z-50 text-white">
            <div class="px-3 py-2 border-b border-white/10 mb-1">
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF65] block">Assistance &amp; Support</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <a href="https://wa.me/<?= e(WHATSAPP_PHONE) ?>" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 min-w-0">
                  <div class="h-7 w-7 rounded-lg bg-[#D4AF65]/15 border border-[#D4AF65]/30 flex items-center justify-center shrink-0">
                    <?= icon('phone', 'h-3.5 w-3.5 text-[#D4AF65]') ?>
                  </div>
                  <div class="min-w-0">
                    <span class="text-xs font-bold text-white block">Hotline Concierge</span>
                    <span class="text-[10px] text-[#F5F2EB]/75 font-mono block truncate"><?= e(FORMATTED_PHONE) ?></span>
                  </div>
                </a>
                <button type="button" data-copy-phone="<?= e(FORMATTED_PHONE) ?>" title="Copy Phone Number" class="h-6 w-6 rounded-md bg-white/10 hover:bg-[#D4AF65]/20 hover:text-[#D4AF65] text-white/70 flex items-center justify-center shrink-0 transition-colors cursor-pointer">
                  <?= icon('copy', 'h-3 w-3') ?>
                </button>
              </div>

              <a href="<?= e(url('/corporate-quotes')) ?>" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group">
                <div class="h-7 w-7 rounded-lg bg-[#D4AF65]/15 border border-[#D4AF65]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF65] transition-colors">
                  <?= icon('building', 'h-3.5 w-3.5 text-[#D4AF65] group-hover:text-[#101D35] transition-colors') ?>
                </div>
                <div class="min-w-0">
                  <span class="text-xs font-bold text-white group-hover:text-[#D4AF65] transition-colors block">Corporate Quotes</span>
                  <span class="text-[10px] text-[#F5F2EB]/70 block truncate">B2B contracts &amp; volume pricing</span>
                </div>
              </a>

              <a href="<?= e(url('/track-order')) ?>" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group">
                <div class="h-7 w-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors">
                  <?= icon('truck', 'h-3.5 w-3.5 text-emerald-400 group-hover:text-[#101D35] transition-colors') ?>
                </div>
                <div class="min-w-0">
                  <span class="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors block">Order Status Inquiry</span>
                  <span class="text-[10px] text-[#F5F2EB]/70 block truncate">WhatsApp &amp; email pressroom desk</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. MAIN FLOATING GLASSMORPHISM CAPSULE NAVBAR -->
    <nav id="header-capsule" aria-label="Main Navigation" class="pointer-events-auto w-full max-w-[1360px] relative rounded-full bg-[#101D35]/80 backdrop-blur-2xl border border-[#D4AF65]/30 shadow-[0_12px_42px_rgba(16,29,53,0.4)] transition-all duration-300 ring-1 ring-white/10 flex items-center justify-between h-16 sm:h-17 px-4 sm:px-6">
      <!-- LEFT: BRAND LOGO -->
      <div class="flex items-center shrink-0">
        <a href="<?= e(url('/')) ?>" class="inline-flex items-center gap-2 group cursor-pointer focus:outline-none" aria-label="ONPRINT Dubai Homepage">
          <?= render_logo('glass', 'md') ?>
        </a>
      </div>

      <!-- CENTER: DESKTOP NAVIGATION ITEMS -->
      <div class="hidden lg:flex items-center gap-1 xl:gap-2">
        <!-- 1. Catalog Mega Menu Trigger -->
        <div class="relative" data-dropdown="mega" data-dropdown-hover="true">
          <button type="button" data-dropdown-toggle="mega" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 cursor-pointer <?= $isCatalogActive ? 'text-[#D4AF65] bg-white/10 shadow-xs' : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5' ?>" aria-expanded="false">
            <span>Catalog</span>
            <?= icon('chevron-down', 'h-3.5 w-3.5 text-[#D4AF65] transition-transform duration-200 data-chevron') ?>
          </button>

          <!-- Glass Mega Menu Panel -->
          <div data-dropdown-panel="mega" class="hidden fixed left-1/2 -translate-x-1/2 top-[76px] w-[min(1240px,96vw)] max-h-[82vh] overflow-y-auto rounded-3xl bg-[#101D35]/95 backdrop-blur-2xl border border-[#D4AF65]/35 shadow-[0_25px_80px_rgba(16,29,53,0.75)] p-5 xl:p-6 z-50 text-white">
            <div class="flex items-center justify-between pb-3.5 border-b border-white/10 mb-5">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-[#D4AF65] animate-pulse"></span>
                <span class="text-xs font-black uppercase tracking-widest text-[#D4AF65]">Commercial Print Disciplines &amp; Catalog</span>
              </div>
              <a href="<?= e(url('/products')) ?>" class="inline-flex items-center gap-1 text-xs font-bold text-[#F5F2EB] hover:text-[#D4AF65] transition-colors group">
                <span>View All Catalog Products</span>
                <?= icon('arrow-right', 'h-3.5 w-3.5 text-[#D4AF65] group-hover:translate-x-1 transition-transform') ?>
              </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 xl:gap-5">
              <?php foreach ($megaMenuCategories as $cat): ?>
              <div class="flex flex-col rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#D4AF65]/40 p-3.5 transition-all duration-200">
                <a href="<?= e(url($cat['overviewPath'])) ?>" class="flex items-start gap-2.5 mb-3 group">
                  <div class="h-8 w-8 rounded-xl bg-[#D4AF65]/15 border border-[#D4AF65]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF65] transition-colors">
                    <?= icon($cat['icon'], 'h-4 w-4 text-[#D4AF65] group-hover:text-[#101D35] transition-colors') ?>
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-xs font-black text-white group-hover:text-[#D4AF65] transition-colors leading-snug"><?= e($cat['title']) ?></h3>
                    <p class="text-[10px] text-[#F5F2EB]/65 truncate"><?= e($cat['subtitle']) ?></p>
                  </div>
                </a>
                <ul class="space-y-1.5 flex-1">
                  <?php foreach ($cat['items'] as $item): ?>
                  <li>
                    <a href="<?= e(url($item['to'])) ?>" class="group flex items-baseline justify-between p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      <div class="min-w-0 pr-1">
                        <span class="text-[11px] font-semibold text-[#F5F2EB]/90 group-hover:text-[#D4AF65] transition-colors block truncate"><?= e($item['label']) ?></span>
                      </div>
                      <?php if (!empty($item['badge'])): ?>
                      <span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#D4AF65]/20 text-[#D4AF65] border border-[#D4AF65]/30 shrink-0"><?= e($item['badge']) ?></span>
                      <?php endif; ?>
                    </a>
                  </li>
                  <?php endforeach; ?>
                </ul>
              </div>
              <?php endforeach; ?>
            </div>

            <div class="mt-5 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#F5F2EB]/70 gap-3">
              <div class="flex items-center gap-4">
                <span class="inline-flex items-center gap-1.5 text-white/90 font-medium">
                  <?= icon('check', 'h-3.5 w-3.5 text-emerald-400') ?>
                  <span>Same-Day &amp; 24h Express Dubai Dispatch</span>
                </span>
                <span class="text-white/30">•</span>
                <span class="inline-flex items-center gap-1.5 text-white/90 font-medium">
                  <?= icon('check', 'h-3.5 w-3.5 text-emerald-400') ?>
                  <span>Direct Al Quoz Pressroom (Zero Broker Fees)</span>
                </span>
              </div>
              <a href="<?= e(url('/finishes')) ?>" class="font-bold text-[#D4AF65] hover:underline">Explore Luxury Finishes →</a>
            </div>
          </div>
        </div>

        <!-- 2–5. Primary Direct Links -->
        <a href="<?= e(url('/business-card-printing-dubai')) ?>" class="px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 <?= $ROUTE_PATH === '/business-card-printing-dubai' ? 'text-[#D4AF65] bg-white/10 shadow-xs' : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5' ?>">Business Cards</a>
        <a href="<?= e(url('/sticker-printing-dubai')) ?>" class="px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 <?= $ROUTE_PATH === '/sticker-printing-dubai' ? 'text-[#D4AF65] bg-white/10 shadow-xs' : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5' ?>">Stickers</a>
        <a href="<?= e(url('/categories/stamps-printing-dubai')) ?>" class="px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 <?= $ROUTE_PATH === '/categories/stamps-printing-dubai' ? 'text-[#D4AF65] bg-white/10 shadow-xs' : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5' ?>">Stamps &amp; Seals</a>
        <a href="<?= e(url('/finishes')) ?>" class="px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 <?= $ROUTE_PATH === '/finishes' ? 'text-[#D4AF65] bg-white/10 shadow-xs' : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5' ?>">Finishes</a>

        <!-- 6. Company Dropdown -->
        <div class="relative" data-dropdown="company" data-dropdown-hover="true">
          <button type="button" data-dropdown-toggle="company" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 cursor-pointer <?= $isCompanyActive ? 'text-[#D4AF65] bg-white/10 shadow-xs' : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5' ?>" aria-expanded="false">
            <span>Company</span>
            <?= icon('chevron-down', 'h-3.5 w-3.5 text-[#D4AF65] transition-transform duration-200 data-chevron') ?>
          </button>

          <div data-dropdown-panel="company" class="hidden absolute left-0 top-full mt-2 w-72 rounded-2xl bg-[#101D35]/95 backdrop-blur-2xl border border-[#D4AF65]/35 shadow-[0_20px_50px_rgba(16,29,53,0.65)] p-2.5 z-50 text-white">
            <div class="px-3 py-1.5 border-b border-white/10 mb-1">
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF65] block">ONPRINT Dubai Pressfloor</span>
            </div>
            <div class="space-y-1">
              <?php foreach ($companyLinks as $item): ?>
              <a href="<?= e(url($item['to'])) ?>" class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group">
                <div class="h-7 w-7 rounded-lg bg-[#D4AF65]/15 border border-[#D4AF65]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF65] transition-colors mt-0.5">
                  <?= icon($item['icon'], 'h-3.5 w-3.5 text-[#D4AF65] group-hover:text-[#101D35] transition-colors') ?>
                </div>
                <div class="min-w-0">
                  <span class="text-xs font-bold text-white group-hover:text-[#D4AF65] transition-colors block"><?= e($item['label']) ?></span>
                  <span class="text-[10px] text-[#F5F2EB]/65 block truncate"><?= e($item['desc']) ?></span>
                </div>
              </a>
              <?php endforeach; ?>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: CONTROLS, SEARCH, ARABIC, WHATSAPP, GET A QUOTE -->
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <!-- 1. Universal Search Button -->
        <button type="button" data-open-search="true" aria-label="Search catalog" title="Search products (Press / or Ctrl+K)" class="inline-flex items-center justify-center h-8.5 w-8.5 rounded-full border border-[#D4AF65]/30 bg-white/5 hover:bg-[#D4AF65]/20 hover:border-[#D4AF65]/60 text-[#F5F2EB] hover:text-[#D4AF65] transition-all duration-200 cursor-pointer shadow-xs shrink-0">
          <?= icon('search', 'h-4 w-4') ?>
        </button>

        <!-- 2. Language Switcher -->
        <a href="<?= e($counterpartLangUrl) ?>" class="hidden sm:inline-flex items-center gap-1.5 h-8 sm:h-8.5 px-2.5 sm:px-3 rounded-full border border-[#D4AF65]/35 bg-white/5 hover:bg-[#D4AF65]/20 hover:border-[#D4AF65]/60 text-[#F5F2EB] hover:text-[#D4AF65] transition-all duration-200 cursor-pointer text-xs font-semibold shrink-0 shadow-xs backdrop-blur-md" title="<?= $IS_ARABIC ? 'Switch to English' : 'التحويل إلى اللغة العربية' ?>">
          <?= icon('globe', 'h-3.5 w-3.5 text-[#D4AF65] shrink-0') ?>
          <span class="tracking-wide font-medium"><?= $IS_ARABIC ? 'EN' : 'عربي' ?></span>
        </a>

        <!-- 3. WhatsApp Direct Click-to-Chat -->
        <a href="https://wa.me/<?= e(WHATSAPP_PHONE) ?>?text=Hi%20ONPRINT,%20I%20would%20like%20to%20inquire%20about%20commercial%20printing%20in%20Dubai" target="_blank" rel="noopener noreferrer" title="WhatsApp Concierge (<?= e(FORMATTED_PHONE) ?>)" aria-label="Direct WhatsApp Concierge" class="inline-flex items-center justify-center h-8.5 w-8.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/25 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 transition-all duration-200 cursor-pointer shadow-xs shrink-0 group">
          <?= icon('whatsapp', 'h-4 w-4 group-hover:scale-110 transition-transform') ?>
        </a>

        <!-- 4. Get a Quote CTA Button -->
        <a href="<?= e(url('/get-a-quote')) ?>" class="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-full bg-[#D4AF65] hover:bg-[#c9a150] text-[#101D35] font-black text-xs sm:text-[13px] tracking-wide shadow-[0_0_20px_rgba(212,175,101,0.35)] hover:shadow-[0_0_28px_rgba(212,175,101,0.6)] transition-all duration-200 transform hover:scale-[1.02] shrink-0 cursor-pointer">
          <?= icon('sparkles', 'h-3.5 w-3.5 text-[#101D35] shrink-0') ?>
          <span>Get a Quote</span>
        </a>

        <!-- 5. Mobile Hamburger Button -->
        <button type="button" data-open-mobile-drawer="true" aria-label="Toggle Navigation Drawer" class="lg:hidden inline-flex items-center justify-center h-8.5 w-8.5 rounded-full border border-[#D4AF65]/35 bg-white/5 hover:bg-[#D4AF65]/20 text-white hover:text-[#D4AF65] transition-all cursor-pointer shadow-xs shrink-0">
          <?= icon('menu', 'h-4 w-4') ?>
        </button>
      </div>
    </nav>
  </div>

  <!-- 3. MOBILE SLIDE-OUT GLASSMORPHISM DRAWER -->
  <div id="mobile-nav-drawer" class="hidden fixed inset-0 z-60 pointer-events-auto lg:hidden">
    <div data-close-mobile-drawer="true" class="fixed inset-0 bg-[#101D35]/70 backdrop-blur-md"></div>
    <div class="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-[#101D35]/95 backdrop-blur-2xl border-l border-[#D4AF65]/30 shadow-2xl text-white flex flex-col p-5 overflow-y-auto">
      <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <?= render_logo('glass', 'sm') ?>
        <button type="button" data-close-mobile-drawer="true" aria-label="Close Navigation" class="h-8.5 w-8.5 rounded-full border border-[#D4AF65]/30 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center cursor-pointer transition-colors">
          <?= icon('x', 'h-4 w-4') ?>
        </button>
      </div>

      <div class="mb-5">
        <a href="<?= e(url('/get-a-quote')) ?>" class="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#D4AF65] hover:bg-[#c9a150] text-[#101D35] font-black text-sm tracking-wide shadow-[0_0_20px_rgba(212,175,101,0.35)] transition-all cursor-pointer">
          <?= icon('sparkles', 'h-4 w-4 text-[#101D35]') ?>
          <span>Request Custom Quotation</span>
        </a>
      </div>

      <div class="space-y-2 flex-1">
        <!-- Mobile Catalog Accordion -->
        <details class="group rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
          <summary class="list-none cursor-pointer w-full flex items-center justify-between p-3.5 text-left font-bold text-sm text-white hover:text-[#D4AF65] transition-colors">
            <span class="flex items-center gap-2">
              <?= icon('briefcase', 'h-4 w-4 text-[#D4AF65]') ?>
              <span>Product Catalog</span>
            </span>
            <?= icon('chevron-down', 'h-4 w-4 text-[#D4AF65] transition-transform duration-200 group-open:rotate-180') ?>
          </summary>
          <div class="p-3 pt-2 space-y-3 border-t border-white/10">
            <?php foreach ($megaMenuCategories as $dept): ?>
            <div class="space-y-1">
              <a href="<?= e(url($dept['overviewPath'])) ?>" class="text-xs font-black text-[#D4AF65] hover:underline block pt-1"><?= e($dept['title']) ?></a>
              <div class="grid grid-cols-2 gap-1.5 pl-2">
                <?php foreach (array_slice($dept['items'], 0, 4) as $it): ?>
                <a href="<?= e(url($it['to'])) ?>" class="text-[11px] text-[#F5F2EB]/80 hover:text-white py-1 truncate block"><?= e($it['label']) ?></a>
                <?php endforeach; ?>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
        </details>

        <a href="<?= e(url('/business-card-printing-dubai')) ?>" class="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-bold text-white hover:text-[#D4AF65] transition-colors">
          <span>Business Cards</span>
          <?= icon('chevron-right', 'h-4 w-4 text-[#D4AF65]') ?>
        </a>
        <a href="<?= e(url('/sticker-printing-dubai')) ?>" class="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-bold text-white hover:text-[#D4AF65] transition-colors">
          <span>Stickers &amp; Labels</span>
          <?= icon('chevron-right', 'h-4 w-4 text-[#D4AF65]') ?>
        </a>
        <a href="<?= e(url('/categories/stamps-printing-dubai')) ?>" class="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-bold text-white hover:text-[#D4AF65] transition-colors">
          <span>Stamps &amp; Seals</span>
          <?= icon('chevron-right', 'h-4 w-4 text-[#D4AF65]') ?>
        </a>
        <a href="<?= e(url('/finishes')) ?>" class="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-bold text-white hover:text-[#D4AF65] transition-colors">
          <span>Finishes &amp; Foils</span>
          <?= icon('chevron-right', 'h-4 w-4 text-[#D4AF65]') ?>
        </a>

        <!-- Mobile Company Accordion -->
        <details class="group rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
          <summary class="list-none cursor-pointer w-full flex items-center justify-between p-3.5 text-left font-bold text-sm text-white hover:text-[#D4AF65] transition-colors">
            <span class="flex items-center gap-2">
              <?= icon('building', 'h-4 w-4 text-[#D4AF65]') ?>
              <span>Company &amp; Atelier</span>
            </span>
            <?= icon('chevron-down', 'h-4 w-4 text-[#D4AF65] transition-transform duration-200 group-open:rotate-180') ?>
          </summary>
          <div class="p-3 pt-2 space-y-2 border-t border-white/10">
            <?php foreach ($companyLinks as $c): ?>
            <a href="<?= e(url($c['to'])) ?>" class="flex items-center justify-between py-1.5 text-xs text-[#F5F2EB]/85 hover:text-[#D4AF65] transition-colors">
              <span><?= e($c['label']) ?></span>
              <?= icon('chevron-right', 'h-3 w-3 text-white/40') ?>
            </a>
            <?php endforeach; ?>
          </div>
        </details>

        <div class="pt-2">
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF65] block mb-2 px-1">Support &amp; Rapid Assistance</span>
          <div class="space-y-1.5">
            <a href="https://wa.me/<?= e(WHATSAPP_PHONE) ?>" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-white transition-colors">
              <span class="flex items-center gap-2"><?= icon('phone', 'h-3.5 w-3.5 text-[#D4AF65]') ?><span>Hotline: <?= e(FORMATTED_PHONE) ?></span></span>
              <?= icon('external-link', 'h-3 w-3 text-[#D4AF65]') ?>
            </a>
            <a href="<?= e(url('/corporate-quotes')) ?>" class="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#D4AF65]/40 text-xs font-semibold text-white transition-colors">
              <span class="flex items-center gap-2"><?= icon('building', 'h-3.5 w-3.5 text-[#D4AF65]') ?><span>Corporate Quotes</span></span>
              <?= icon('chevron-right', 'h-3 w-3 text-white/40') ?>
            </a>
            <a href="<?= e(url('/track-order')) ?>" class="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-white transition-colors">
              <span class="flex items-center gap-2"><?= icon('truck', 'h-3.5 w-3.5 text-emerald-400') ?><span>Order Status Inquiry</span></span>
              <?= icon('chevron-right', 'h-3 w-3 text-white/40') ?>
            </a>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
        <a href="<?= e($counterpartLangUrl) ?>" class="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#D4AF65]/35 bg-white/5 hover:bg-[#D4AF65]/20 text-[#F5F2EB] text-xs font-semibold">
          <?= icon('globe', 'h-3.5 w-3.5 text-[#D4AF65]') ?>
          <span><?= $IS_ARABIC ? 'English' : 'عربي' ?></span>
        </a>
        <span class="text-[11px] text-[#F5F2EB]/60">Al Quoz, Dubai, UAE</span>
      </div>
    </div>
  </div>

  <!-- 4. UNIVERSAL SEARCH MODAL -->
  <div id="universal-search-modal" class="hidden fixed inset-0 z-60 pointer-events-auto flex items-start justify-center pt-12 sm:pt-20 px-4">
    <div data-close-search="true" class="fixed inset-0 bg-[#101D35]/75 backdrop-blur-md"></div>
    <div role="dialog" aria-modal="true" aria-label="Search ONPRINT Catalog" class="relative z-10 w-full max-w-2xl rounded-3xl border border-[#D4AF65]/40 bg-[#101D35]/95 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.7)] overflow-hidden text-white">
      <div class="flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 sm:px-5 py-4">
        <?= icon('search', 'h-5 w-5 text-[#D4AF65] shrink-0') ?>
        <input id="universal-search-input" type="text" placeholder="Search business cards, stickers, stamps, roll-up banners, bottles..." class="w-full bg-transparent text-sm sm:text-base font-medium text-white placeholder:text-[#F5F2EB]/50 focus:outline-none border-0" style="background:transparent;" />
        <button type="button" data-close-search="true" aria-label="Close search" class="rounded-lg border border-[#D4AF65]/30 bg-white/5 p-1.5 text-white/70 hover:text-white hover:bg-white/10 cursor-pointer">
          <?= icon('x', 'h-4 w-4') ?>
        </button>
      </div>

      <div class="max-h-[68vh] overflow-y-auto p-4 sm:p-5 space-y-5">
        <div id="universal-search-default" class="space-y-5">
          <div>
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#D4AF65] block mb-2.5">Popular Printing Searches</span>
            <div class="flex flex-wrap gap-2">
              <?php foreach ($popularSearches as $ps): ?>
              <a href="<?= e(url($ps['to'])) ?>" class="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-[#D4AF65]/20 hover:border-[#D4AF65]/60 px-3 py-2 text-xs font-bold text-[#F5F2EB] transition-colors">
                <?= icon('sparkles', 'h-3.5 w-3.5 text-[#D4AF65]') ?>
                <span><?= e($ps['label']) ?></span>
              </a>
              <?php endforeach; ?>
            </div>
          </div>

          <div>
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#D4AF65] block mb-2.5">Browse by Category</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <?php foreach ($megaMenuCategories as $cat): ?>
              <a href="<?= e(url($cat['overviewPath'])) ?>" class="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#D4AF65]/50 p-2.5 transition-colors group">
                <div class="h-8 w-8 rounded-lg bg-[#D4AF65]/15 border border-[#D4AF65]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF65] transition-colors">
                  <?= icon($cat['icon'], 'h-4 w-4 text-[#D4AF65] group-hover:text-[#101D35] transition-colors') ?>
                </div>
                <div class="min-w-0">
                  <span class="text-xs font-bold text-white group-hover:text-[#D4AF65] transition-colors block truncate"><?= e($cat['title']) ?></span>
                  <span class="text-[10px] text-[#F5F2EB]/60 block truncate"><?= e($cat['subtitle']) ?></span>
                </div>
              </a>
              <?php endforeach; ?>
            </div>
          </div>
        </div>

        <div id="universal-search-results" class="hidden space-y-4"></div>
      </div>
    </div>
  </div>
</header>
