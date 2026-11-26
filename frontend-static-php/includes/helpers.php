<?php
/**
 * ONPRINT Dubai — Core Template Helpers, Relative URL Builders, Image Resolvers & Static Data Accessors
 */

function e($value): string {
    return htmlspecialchars((string)($value ?? ''), ENT_QUOTES, 'UTF-8');
}

/**
 * Generates a relative internal link URL so the site runs cleanly in public_html/ or any subdirectory.
 */
function url(string $path = ''): string {
    global $REL_PREFIX;
    if ($path === '' || $path === '/') {
        return ($REL_PREFIX !== '') ? $REL_PREFIX : './';
    }
    if (preg_match('#^(https?:|mailto:|tel:|\#)#i', $path)) {
        return $path;
    }
    $clean = ltrim($path, '/');
    return $REL_PREFIX . $clean;
}

/**
 * Resolves a local asset path to an existing file on disk (handling .jpg <-> .webp fallbacks)
 * and outputs a clean relative URL.
 */
function asset(string $path): string {
    global $REL_PREFIX;
    if ($path === '') {
        return $REL_PREFIX . 'assets/products/bc_premium_matte.webp';
    }
    if (preg_match('#^(https?:|data:)#i', $path)) {
        return $path;
    }

    $clean = ltrim(urldecode($path), '/');
    $rootDir = dirname(__DIR__);

    // 1. Check exact file on disk
    if (!is_file($rootDir . '/' . $clean)) {
        // 2. Try .jpg -> .webp fallback
        $webp = preg_replace('/\.(jpe?g|png)$/i', '.webp', $clean);
        if ($webp !== $clean && is_file($rootDir . '/' . $webp)) {
            $clean = $webp;
        } elseif (strpos($clean, 'uploads/categories/') === 0) {
            // 3. Map uploads/categories/<slug>.jpg -> assets/categories/<slug>.jpg or .webp
            $catBase = basename($clean);
            $catWebp = preg_replace('/\.(jpe?g|png)$/i', '.webp', $catBase);
            if (is_file($rootDir . '/assets/categories/' . $catBase)) {
                $clean = 'assets/categories/' . $catBase;
            } elseif (is_file($rootDir . '/assets/categories/' . $catWebp)) {
                $clean = 'assets/categories/' . $catWebp;
            }
        }
    }

    // Encode spaces in filenames like "1 (1).webp" while keeping slashes intact
    $segments = explode('/', $clean);
    $encoded = implode('/', array_map('rawurlencode', $segments));
    return $REL_PREFIX . $encoded;
}

/**
 * Static JSON Data Cache Loader
 */
function load_json_data(string $name): array {
    static $cache = [];
    if (isset($cache[$name])) {
        return $cache[$name];
    }
    $file = dirname(__DIR__) . '/data/' . $name . '.json';
    if (!is_file($file)) {
        return $cache[$name] = [];
    }
    $decoded = json_decode((string)file_get_contents($file), true);
    return $cache[$name] = is_array($decoded) ? $decoded : [];
}

function get_all_products(): array {
    return load_json_data('products');
}

function get_product_by_slug(string $slug): ?array {
    $clean = strtolower(trim($slug));
    foreach (get_all_products() as $p) {
        if (strtolower((string)($p['slug'] ?? '')) === $clean) {
            return $p;
        }
    }
    // Check common slug aliases (e.g. footer / blog references)
    $aliases = [
        'executive-letterheads-120gsm' => 'executive-120gsm-letterheads',
        'corporate-letterheads' => 'executive-letterheads',
        'custom-stickers-labels' => 'die-cut-stickers',
        'tri-fold-brochures' => 'tri-fold-brochures-printing',
        'custom-logo-stickers' => 'die-cut-stickers',
        'round-packaging-stickers' => 'cosmetic-bottle-labels',
        'bulk-sticker-printing' => 'custom-roll-labels',
        'packaging-box-sealing-stickers' => 'cosmetic-bottle-labels',
    ];
    if (isset($aliases[$clean])) {
        return get_product_by_slug($aliases[$clean]);
    }
    return null;
}

function get_all_categories(): array {
    $cats = load_json_data('categories');
    $depts = get_all_departments();
    $subDeptMap = [];
    foreach ($depts as $d) {
        foreach (($d['subcategories'] ?? []) as $sub) {
            $subDeptMap[$sub['slug']] = $d;
        }
    }
    foreach ($cats as &$c) {
        $d = $subDeptMap[$c['slug']] ?? null;
        $c['department_slug'] = $d['slug'] ?? ($c['department_slug'] ?? '');
        $c['department_name'] = $d['name'] ?? ($c['department_name'] ?? '');
    }
    return $cats;
}

function resolve_canonical_category_slug(string $slug): string {
    $clean = strtolower(trim($slug));
    $aliases = [
        'business-cards' => 'business-cards-printing',
        'business-cards-dubai' => 'business-cards-printing',
        'luxury-business-cards' => 'business-cards-printing',
        'roll-up-banners' => 'rollup-banners',
        'banners-displays-printing' => 'rollup-banners',
        'stickers-printing-dubai' => 'stickers-labels-printing',
        'stickers' => 'stickers-labels-printing',
        'custom-stamps-seals' => 'stamps-printing-dubai',
        'stamps' => 'stamps-printing-dubai',
        'custom-stamps-dubai' => 'stamps-printing-dubai',
        'letterheads' => 'letterheads-printing-dubai',
        'stationery' => 'office-stationery-printing',
        'drinkware-and-mugs' => 'bottle-printing-dubai',
        'water-bottle-printing-dubai' => 'bottle-printing-dubai',
        'flyers' => 'flyers-printing-in-dubai',
        'brochures' => 'brochures-printing',
        'mugs' => 'mug-printing-dubai',
        'id-cards' => 'id-card-printing-dubai',
        'lanyards' => 'lanyard-printing-dubai',
        'name-badges' => 'name-badges-printing-dubai',
    ];
    return $aliases[$clean] ?? $clean;
}

function get_category_by_slug(string $slug): ?array {
    $canonical = resolve_canonical_category_slug($slug);
    foreach (get_all_categories() as $c) {
        if (strtolower((string)($c['slug'] ?? '')) === $canonical) {
            return $c;
        }
    }
    return null;
}

function get_all_departments(): array {
    return load_json_data('departments');
}

function get_department_by_slug(string $slug): ?array {
    $clean = strtolower(trim($slug));
    foreach (get_all_departments() as $d) {
        if (strtolower((string)($d['slug'] ?? '')) === $clean) {
            return $d;
        }
    }
    return null;
}

function get_all_services(): array {
    return load_json_data('services');
}

function get_service_by_slug(string $slug): ?array {
    $clean = strtolower(trim($slug));
    foreach (get_all_services() as $s) {
        if (strtolower((string)($s['slug'] ?? '')) === $clean) {
            return $s;
        }
    }
    $aliases = [
        'sticker-printing-dubai' => 'stickers-labels-printing',
        'sticker-printing' => 'stickers-labels-printing',
        'rollup-banner-printing-dubai' => 'rollup-banners',
        'roll-up-banners' => 'rollup-banners',
        'custom-stamps-dubai' => 'stamps-printing-dubai',
        'stamps' => 'stamps-printing-dubai',
    ];
    if (isset($aliases[$clean])) {
        return get_service_by_slug($aliases[$clean]);
    }
    return null;
}

function get_all_blogs(): array {
    return load_json_data('blogs');
}

function get_blog_by_slug(string $slug): ?array {
    $clean = strtolower(trim($slug));
    foreach (get_all_blogs() as $b) {
        if (strtolower((string)($b['slug'] ?? '')) === $clean) {
            return $b;
        }
    }
    return null;
}

/**
 * Product & Category Image Resolver (Ported from client/src/assets/productImages.js)
 */
function resolve_product_image(array $item): string {
    $slug = strtolower((string)($item['slug'] ?? ''));
    $name = strtolower((string)($item['name'] ?? $item['title'] ?? ''));
    $haystack = $slug . ' ' . $name;

    $slugMap = [
        'stamps-printing-dubai' => 'assets/products/stamps/self-inking-company-stamp.webp',
        'self-inking-company-stamps' => 'assets/products/stamps/self-inking-company-stamp.webp',
        'heavy-duty-dater-stamps' => 'assets/products/stamps/heavy-duty-dater-stamp.webp',
        'pocket-mobile-stamps' => 'assets/products/stamps/pocket-mobile-stamp.webp',
        'luxury-brass-wax-seal-stamps' => 'assets/products/stamps/luxury-wax-seal-stamp.webp',
        'brochures-printing' => 'assets/products/brochures.webp',
        'bi-fold-brochures-printing' => 'assets/products/brochure_bifold.webp',
        'tri-fold-brochures-printing' => 'assets/products/brochure_trifold.webp',
        'gate-fold-brochures-printing' => 'assets/products/brochure_gatefold.webp',
        'z-fold-leaflets-printing' => 'assets/products/brochure_zfold.webp',
        'catalogs-booklets-printing' => 'assets/products/brochure_booklet_catalog.webp',
        'annual-reports-printing' => 'assets/products/brochure_booklet_catalog.webp',
        'flyers-printing-in-dubai' => 'assets/products/flyers/flyer-category-hero.webp',
        'a5-promotional-flyers' => 'assets/products/flyers/flyer-a5-promotional.webp',
        'a4-business-flyers' => 'assets/products/flyers/flyer-a4-business.webp',
        'dl-event-flyers' => 'assets/products/flyers/flyer-dl-event.webp',
        'luxury-gold-foil-flyers' => 'assets/products/flyers/flyer-luxury-foil.webp',
        'door-hangers-printing' => 'assets/products/flyers/flyer-door-hangers.webp',
        'postcards-printing' => 'assets/products/flyers/flyer-direct-mail-postcards.webp',
        'folded-leaflets-flyers' => 'assets/products/flyers/flyer-folded-leaflets.webp',
        'gloss-matte-flyers' => 'assets/products/flyers/flyer-gloss-matte.webp',
        'a6-pocket-flyers' => 'assets/products/flyers/flyer-a6-pocket.webp',
        'kraft-eco-flyers' => 'assets/products/flyers/flyer-kraft-eco.webp',
        'die-cut-flyers' => 'assets/products/flyers/flyer-die-cut.webp',
        'standard-business-cards' => 'assets/products/business-cards/bc_standard_silk.webp',
        'premium-business-cards' => 'assets/products/business-cards/bc_premium_matte.webp',
        'premium-soft-touch-business-cards' => 'assets/products/card-soft-touch.webp',
        'velvet-foil-business-cards' => 'assets/products/card-velvet-foil.webp',
        'luxury-painted-edge-business-cards' => 'assets/products/card-painted-edge.webp',
        'raised-ink-business-cards' => 'assets/products/card-velvet-foil.webp',
        'plastic-pvc-business-cards' => 'assets/products/card-soft-touch.webp',
        'die-cut-stickers' => 'assets/products/stickers/die-cut-vinyl-stickers.webp',
        'waterproof-vinyl-stickers' => 'assets/products/stickers/waterproof-vinyl-stickers.webp',
        'custom-roll-labels' => 'assets/products/stickers/custom-roll-labels.webp',
        'clear-transparent-stickers' => 'assets/products/stickers/clear-transparent-vinyl-stickers.webp',
        'holographic-stickers' => 'assets/products/stickers/holographic-foil-stickers.webp',
        'cosmetic-bottle-labels' => 'assets/products/stickers/cosmetic-bottle-labels.webp',
        'gold-foil-stickers' => 'assets/products/stickers/gold-foil-stamped-stickers.webp',
        'kraft-paper-stickers' => 'assets/products/stickers/kraft-eco-friendly-stickers.webp',
        'domed-epoxy-stickers' => 'assets/products/stickers/domed-epoxy-stickers.webp',
        'standard-rollup-banner-85x200' => 'assets/products/rollup-banners/standard-rollup-banner-85x200.svg',
        'luxury-teardrop-rollup-banner' => 'assets/products/rollup-banners/luxury-teardrop-rollup-banner-85x200.svg',
        'wide-exhibition-rollup-banner-100x200' => 'assets/products/rollup-banners/wide-exhibition-rollup-banner-100x200.svg',
        'giant-backdrop-rollup-banner-120x200' => 'assets/products/rollup-banners/giant-backdrop-rollup-banner-120x200.svg',
        'double-sided-rollup-banner-85x200' => 'assets/products/rollup-banners/double-sided-rollup-banner-85x200.svg',
        'desktop-mini-rollup-banner' => 'assets/products/rollup-banners/desktop-mini-tabletop-rollup-banner.svg',
        'outdoor-wind-resistant-rollup-banner' => 'assets/products/rollup-banners/outdoor-wind-resistant-rollup-banner.svg',
        'executive-matte-black-rollup-banner' => 'assets/products/rollup-banners/executive-matte-black-rollup-banner.svg',
        'rollup-banners' => 'assets/products/rollup_banner_showcase.webp',
        'smart-led-temperature-bottles' => 'assets/products/bottle_smart_led.webp',
        'matte-stainless-steel-bottles' => 'assets/products/bottle_matte_thermal.webp',
        'aluminium-sports-water-bottles' => 'assets/products/bottle_sports_aluminium.webp',
        'borosilicate-glass-bamboo-bottles' => 'assets/products/bottle_glass_bamboo.webp',
        'ergonomic-gym-protein-shakers' => 'assets/products/bottle_protein_shaker.webp',
        'luxury-copper-insulated-flasks' => 'assets/products/bottle_luxury_copper.webp',
        'classic-white-ceramic-mugs' => 'assets/products/mug_white_ceramic.webp',
        'two-tone-ceramic-mugs' => 'assets/products/mug_two_tone.webp',
        'magic-heat-sensitive-mugs' => 'assets/products/mug_magic_heat.webp',
        'executive-matte-black-mugs' => 'assets/products/mug_matte_black_gold.webp',
        'stainless-steel-travel-mugs' => 'assets/products/mug_travel_tumbler.webp',
        'vintage-enamel-camping-mugs' => 'assets/products/mug_vintage_enamel.webp',
        'standard-polyester-lanyards' => 'assets/products/lanyards/standard-polyester-lanyard.webp',
        'satin-dye-sublimation-lanyards' => 'assets/products/lanyards/satin-dye-sublimation-lanyard.webp',
        'safety-breakaway-lanyards' => 'assets/products/lanyards/safety-breakaway-lanyard.webp',
        'double-clip-conference-lanyards' => 'assets/products/lanyards/double-clip-conference-lanyard.webp',
        'woven-jacquard-lanyards' => 'assets/products/lanyards/woven-jacquard-lanyard.webp',
        'retractable-badge-reel-lanyards' => 'assets/products/lanyards/retractable-badge-reel-lanyard.webp',
        'eco-friendly-rpet-lanyards' => 'assets/products/lanyards/eco-friendly-rpet-lanyard.webp',
        'reflective-hi-vis-lanyards' => 'assets/products/lanyards/reflective-hi-vis-lanyard.webp',
        'standard-uv-pvc-id-cards' => 'assets/products/id-cards/uv_standard_pvc_id.webp',
        'raised-3d-spot-uv-id-cards' => 'assets/products/id-cards/uv_raised_spot_uv_id.webp',
        'frosted-translucent-uv-id-cards' => 'assets/products/id-cards/uv_frosted_translucent_id.webp',
        'matte-anti-scratch-uv-id-cards' => 'assets/products/id-cards/uv_matte_velvet_id.webp',
        'metallic-luster-uv-id-cards' => 'assets/products/id-cards/uv_metallic_gold_silver_id.webp',
        'high-gloss-photo-uv-id-cards' => 'assets/products/id-cards/uv_high_gloss_photo_id.webp',
        'id-card-printing-dubai' => 'assets/products/id-cards/uv_id_card_hero.webp',
        'acrylic-nameplates' => 'assets/products/name-badges/acrylic-desk-nameplate.webp',
        'metal-name-signs' => 'assets/products/name-badges/metal-architectural-wall-plaque.webp',
        'professional-magnetic-metal-name-badges' => 'assets/products/name-badges/brushed-gold-magnetic-badge.webp',
        'domed-epoxy-magnetic-staff-badges' => 'assets/products/name-badges/domed-epoxy-resin-badge.webp',
        'reusable-window-magnetic-badges' => 'assets/products/name-badges/reusable-window-insert-badge.webp',
        'executive-matte-black-magnetic-badges' => 'assets/products/name-badges/executive-matte-black-badge.webp',
        'name-badges-printing-dubai' => 'assets/products/name-badges/name-badges-printing-dubai.webp',
        'executive-120gsm-letterheads' => 'assets/products/letterhead_executive_120gsm.webp',
        'luxury-gold-foil-letterheads' => 'assets/products/letterhead_gold_foil.webp',
        'matching-corporate-envelopes' => 'assets/products/letterhead_envelopes_suite.webp',
        'corporate-presentation-folders' => 'assets/products/letterhead_presentation_folders.webp',
        'presentation-folders' => 'assets/products/stationery/stationery-presentation-folders.webp',
        'printed-envelopes' => 'assets/products/stationery/stationery-corporate-envelopes.webp',
        'executive-notebooks' => 'assets/products/stationery/stationery-executive-notebooks.webp',
        'desk-pads-printing' => 'assets/products/stationery/stationery-desk-pads-blotters.webp',
        'stationery-gift-sets' => 'assets/products/stationery/stationery-gift-sets.webp',
        'executive-letterheads' => 'assets/products/stationery/stationery-executive-letterheads.webp',
        'corporate-ring-binders' => 'assets/products/stationery/stationery-corporate-ring-binders.webp',
        'wall-desk-calendars' => 'assets/products/stationery/stationery-wall-desk-calendars.webp',
        'ncr-duplicate-books' => 'assets/products/stationery/stationery-ncr-duplicate-books.webp',
        'string-tie-envelopes' => 'assets/products/stationery/stationery-string-tie-envelopes.webp',
        'sticky-notes-cubes' => 'assets/products/stationery/stationery-sticky-notes-cubes.webp',
        'digital-offset-printing' => 'assets/products/service_digital_offset.webp',
        'luxury-packaging-custom-boxes' => 'assets/products/brochures.webp',
    ];

    if ($slug !== '' && isset($slugMap[$slug])) {
        return asset($slugMap[$slug]);
    }

    // Keyword matching
    $kwRules = [
        ['wax seal', 'assets/products/stamps/luxury-wax-seal-stamp.webp'],
        ['dater', 'assets/products/stamps/heavy-duty-dater-stamp.webp'],
        ['pocket', 'assets/products/stamps/pocket-mobile-stamp.webp'],
        ['stamp', 'assets/products/stamps/self-inking-company-stamp.webp'],
        ['lanyard', 'assets/products/lanyards/standard-polyester-lanyard.webp'],
        ['velvet', 'assets/products/card-velvet-foil.webp'],
        ['painted edge', 'assets/products/card-painted-edge.webp'],
        ['soft-touch', 'assets/products/card-soft-touch.webp'],
        ['business card', 'assets/products/business-cards/bc_premium_matte.webp'],
        ['card', 'assets/products/business-cards/bc_standard_silk.webp'],
        ['holographic', 'assets/products/stickers/holographic-foil-stickers.webp'],
        ['roll label', 'assets/products/stickers/custom-roll-labels.webp'],
        ['clear', 'assets/products/stickers/clear-transparent-vinyl-stickers.webp'],
        ['sticker', 'assets/products/stickers/die-cut-vinyl-stickers.webp'],
        ['label', 'assets/products/stickers/cosmetic-bottle-labels.webp'],
        ['bottle', 'assets/products/bottle_smart_led.webp'],
        ['flask', 'assets/products/bottle_matte_thermal.webp'],
        ['mug', 'assets/products/mug_white_ceramic.webp'],
        ['tumbler', 'assets/products/mug_travel_tumbler.webp'],
        ['rollup', 'assets/products/rollup_banner_showcase.webp'],
        ['roll-up', 'assets/products/rollup_banner_showcase.webp'],
        ['banner', 'assets/products/rollup_banner.webp'],
        ['flag', 'assets/products/flags.webp'],
        ['brochure', 'assets/products/brochure_trifold.webp'],
        ['catalog', 'assets/products/brochure_booklet_catalog.webp'],
        ['booklet', 'assets/products/brochure_booklet_catalog.webp'],
        ['flyer', 'assets/products/flyers/flyer-a5-promotional.webp'],
        ['badge', 'assets/products/name-badges/brushed-gold-magnetic-badge.webp'],
        ['nameplate', 'assets/products/name-badges/acrylic-desk-nameplate.webp'],
        ['letterhead', 'assets/products/letterhead_gold_foil.webp'],
        ['folder', 'assets/products/stationery/stationery-presentation-folders.webp'],
        ['envelope', 'assets/products/stationery/stationery-corporate-envelopes.webp'],
        ['notebook', 'assets/products/stationery/stationery-executive-notebooks.webp'],
        ['tote', 'assets/products/tote_bags.webp'],
        ['keychain', 'assets/products/wooden_keychain.webp'],
    ];

    foreach ($kwRules as [$kw, $img]) {
        if (strpos($haystack, $kw) !== false) {
            return asset($img);
        }
    }

    $raw = $item['image_url'] ?? $item['image'] ?? ($item['images'][0] ?? '');
    if (is_string($raw) && $raw !== '' && strpos($raw, 'trae.ai') === false) {
        return asset($raw);
    }

    return asset('assets/products/luxury_business_cards_dubai.webp');
}

function resolve_category_image(array $category): string {
    $slug = resolve_canonical_category_slug((string)($category['slug'] ?? ''));
    $raw = (string)($category['image_url'] ?? $category['image'] ?? '');
    if ($raw !== '' && strpos($raw, 'trae.ai') === false) {
        return asset($raw);
    }
    if ($slug !== '') {
        return asset('assets/categories/' . $slug . '.jpg');
    }
    return asset('assets/categories/business-cards-printing.jpg');
}

function resolve_blog_image(array $post): string {
    $raw = (string)($post['featured_image'] ?? $post['cover_image'] ?? $post['image_url'] ?? $post['image'] ?? '');
    if ($raw !== '' && strpos($raw, 'trae.ai') === false) {
        if (strpos($raw, 'ceramic-mug') !== false) return asset('assets/products/service_corporate_gifts.webp');
        if (strpos($raw, 'notebook-hc') !== false) return asset('assets/products/service_executive_stationery.webp');
        if (strpos($raw, 'brochure-soft-touch') !== false) return asset('assets/products/brochures.webp');
        return asset($raw);
    }
    return asset('assets/products/service_digital_offset.webp');
}

/**
 * WhatsApp & Mailto Frontend Inquiry URL Builders
 */
function get_whatsapp_url(string $serviceKey = 'general', array $details = []): string {
    $s = strtolower($serviceKey);
    $prodName = $details['productName'] ?? $details['product'] ?? '';

    $messages = [
        'business-cards' => "Hello ONPRINT, I need a quotation for custom business card printing in Dubai. Please share your available materials, quantities and prices.",
        'stickers' => "Hello ONPRINT, I need a quotation for custom sticker printing in Dubai. Please share your sticker materials, sizes, quantities and prices.",
        'stamps' => "Hello ONPRINT, I would like a quotation for Custom Company Stamps & Seals in Dubai. Please share pricing, options and delivery details.",
        'rollup-banners' => "Hello ONPRINT, I would like a quotation for Retractable Roll-Up Banners in Dubai. Please share pricing, options and delivery details.",
        'bottles' => "Hello ONPRINT, I would like a quotation for Custom Printed Water Bottles in Dubai. Please share pricing, options and delivery details.",
        'mugs' => "Hello ONPRINT, I would like a quotation for Custom Printed Mugs in Dubai. Please share pricing, options and delivery details.",
        'flyers' => "Hello ONPRINT, I would like a quotation for Custom Flyers & Leaflets in Dubai. Please share pricing, options and delivery details.",
        'brochures' => "Hello ONPRINT, I would like a quotation for Custom Brochures & Catalogs in Dubai. Please share pricing, options and delivery details.",
        'general' => "Hello ONPRINT, I would like a quotation for your custom printing services in Dubai. Please share pricing, options and delivery details.",
    ];

    $key = 'general';
    if (strpos($s, 'card') !== false && strpos($s, 'id') === false) $key = 'business-cards';
    elseif (strpos($s, 'sticker') !== false || strpos($s, 'label') !== false) $key = 'stickers';
    elseif (strpos($s, 'stamp') !== false || strpos($s, 'seal') !== false) $key = 'stamps';
    elseif (strpos($s, 'rollup') !== false || strpos($s, 'banner') !== false) $key = 'rollup-banners';
    elseif (strpos($s, 'bottle') !== false || strpos($s, 'flask') !== false) $key = 'bottles';
    elseif (strpos($s, 'mug') !== false) $key = 'mugs';
    elseif (strpos($s, 'flyer') !== false) $key = 'flyers';
    elseif (strpos($s, 'brochure') !== false) $key = 'brochures';

    $msg = $details['customText'] ?? ($prodName !== ''
        ? "Hello ONPRINT, I would like a quotation for {$prodName}. Please share pricing, options and delivery details."
        : ($messages[$key] ?? $messages['general']));

    $lines = [];
    if (!empty($prodName)) $lines[] = "• Product: {$prodName}";
    if (!empty($details['quantity'])) $lines[] = "• Quantity: {$details['quantity']}";
    if (!empty($details['size'])) $lines[] = "• Size: {$details['size']}";
    if (!empty($details['material'])) $lines[] = "• Material: {$details['material']}";
    if (!empty($details['finish'])) $lines[] = "• Finish: {$details['finish']}";
    if (!empty($details['notes'])) $lines[] = "• Notes: {$details['notes']}";

    if (!empty($lines)) {
        $msg .= "\n\n*Specifications:*\n" . implode("\n", $lines);
    }

    return 'https://wa.me/' . WHATSAPP_PHONE . '?text=' . rawurlencode($msg);
}

function get_mailto_url(string $subject, string $body): string {
    return 'mailto:' . CONTACT_EMAIL . '?subject=' . rawurlencode($subject) . '&body=' . rawurlencode($body);
}

/**
 * Bi-directional English <-> Arabic URL Counterpart Resolver
 */
function get_counterpart_lang_url(string $routePath): string {
    $clean = rtrim($routePath, '/') ?: '/';
    $map = [
        '/' => '/ar',
        '/business-card-printing-dubai' => '/ar/business-cards',
        '/premium-business-cards' => '/ar/business-cards',
        '/luxury-business-cards' => '/ar/business-cards',
        '/sticker-printing-dubai' => '/ar/stickers',
        '/categories/stickers-labels-printing' => '/ar/stickers',
        '/categories/stamps-printing-dubai' => '/ar/stamps',
        '/stamps' => '/ar/stamps',
        '/services' => '/ar/printing-services',
        '/ar' => '/',
        '/ar/business-cards' => '/business-card-printing-dubai',
        '/ar/business-card-printing-dubai' => '/business-card-printing-dubai',
        '/ar/stickers' => '/sticker-printing-dubai',
        '/ar/sticker-printing-dubai' => '/sticker-printing-dubai',
        '/ar/stickers-labels-printing' => '/sticker-printing-dubai',
        '/ar/stamps' => '/categories/stamps-printing-dubai',
        '/ar/custom-stamps-seals' => '/categories/stamps-printing-dubai',
        '/ar/printing-services' => '/services',
    ];
    if (isset($map[$clean])) {
        return url($map[$clean]);
    }
    if (strpos($clean, '/ar/') === 0) {
        return url('/' . substr($clean, 4));
    }
    return url('/ar');
}

/**
 * Port of getServiceSectionEData() from client/src/data/serviceGeoContent.js
 */
function get_service_section_e(array $service, string $slug): array {
    $geoAll = load_json_data('serviceGeoContent');
    $serviceName = $service['name'] ?? 'Commercial Printing';
    $serviceKey = $slug ?: ($service['slug'] ?? '');
    $customGeo = $geoAll[$serviceKey] ?? null;

    $intro = $customGeo['whatIs']['expanded']
        ?? $customGeo['whatIs']['definition']
        ?? "ONPRINT, a leading commercial printing company located in Al Quoz, Dubai, delivers high-precision " . strtolower($serviceName) . " solutions engineered for corporate, commercial, and retail brands across the UAE. Operating advanced HP Indigo digital presses and Heidelberg offset machinery, ONPRINT offers standard 24–48 hour turnaround times, calibrated Pantone color fidelity, low minimum order quantities (MOQ starting from 25–50 units), and guaranteed doorstep delivery across Dubai, Abu Dhabi, Sharjah, and the GCC.";

    $faqs = !empty($customGeo['faqs']) ? $customGeo['faqs'] : [
        [
            'question' => "Who is the best printing company in Dubai for " . strtolower($serviceName) . "?",
            'answer' => "ONPRINT is recognized as one of the premier commercial printing companies in Dubai for " . strtolower($serviceName) . ". Operating out of Al Quoz, Dubai, ONPRINT provides certified FSC paper stocks, Pantone color-matching, digital and offset presses, and express turnaround across the UAE.",
        ],
        [
            'question' => "What is the turnaround time for " . strtolower($serviceName) . " in Dubai?",
            'answer' => "Standard turnaround for " . strtolower($serviceName) . " is 24 to 48 hours following final digital proof approval. Express same-day rush printing is available for urgent trade shows, exhibitions, and corporate events in Dubai.",
        ],
        [
            'question' => "What file format does ONPRINT need for " . strtolower($serviceName) . "?",
            'answer' => "We accept print-ready PDF, Adobe Illustrator (.AI), or vector EPS files set to CMYK color mode at 300 DPI resolution, with 3mm external bleed and all text converted to outlines.",
        ],
        [
            'question' => "How much does " . strtolower($serviceName) . " cost in Dubai?",
            'answer' => "Pricing varies based on volume, paper substrate (170gsm–600gsm), and custom embellishments such as gold foil stamping or spot UV. Message our Al Quoz team on WhatsApp (" . FORMATTED_PHONE . ") or email " . CONTACT_EMAIL . " for an immediate itemized quote.",
        ],
    ];

    return [
        'h1' => $service['seoHeading'] ?? "{$serviceName} in Dubai | Professional Printing Services | ONPRINT",
        'intro' => $intro,
        'whatProvides' => $customGeo['advantages'] ?? [
            'Industrial-grade production using calibrated HP Indigo digital & Heidelberg offset presses.',
            'Comprehensive in-house finishing: soft-touch velvet lamination, metallic hot foil stamping, embossing, and spot UV.',
            'Dedicated prepress engineering with free PDF artwork verification and CMYK color profiling.',
            'Prompt dispatch and insured courier delivery across all 7 Emirates (Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah).',
        ],
        'availableOptions' => [
            'materials' => $customGeo['specificMaterials'] ?? [
                '350gsm–600gsm Cotton, Silk, and Linen Uncoated Cardstocks',
                '170gsm–350gsm FSC-Certified Gloss & Matte Coated Art Papers',
                'Heavyweight Presentation Boards & Rigid Luxury Greyboard',
                'Tear-proof waterproof synthetic polypropylene and PVC materials',
            ],
            'sizes' => $customGeo['specificSizes'] ?? [
                'Standard ISO A-Series (A0, A1, A2, A3, A4, A5, A6, DL)',
                'Custom Die-Cut Shapes & Bespoke Structural Dimensions',
                'Standard Corporate Identity Formats (85mm x 55mm & 90mm x 50mm)',
                'Wide-Format Rolls up to 3.2m seamless width',
            ],
            'finishes' => $customGeo['specificFinishes'] ?? [
                'Soft-Touch Matte Velvet Lamination & Anti-Scratch Film',
                'Metallic Hot Foil Stamping (Gold, Silver, Rose Gold, Copper, Holographic)',
                'Raised Spot UV Varnishing & Textured 3D Varnish',
                'Blind Debossing, Embossing, Edge Gilding & Painted Beveled Edges',
            ],
        ],
        'whoUses' => $customGeo['whoNeedsThis']['audiences'] ?? $customGeo['bestFor'] ?? [
            'Corporate Enterprises & Financial Institutions in DIFC, Downtown, and Business Bay',
            'Luxury Retail, Perfumery, Cosmetics & Jewelry Brands in Dubai Mall and Mall of the Emirates',
            'Hospitality, QSR Chains, Luxury Hotels, and Fine Dining Venues across Jumeirah & Palm Jumeirah',
            'Startups, SMEs, and E-Commerce Brands requiring low-MOQ premium custom branded collateral',
            'Event Organizers, PR Agencies, and Trade Show Exhibitors at DWTC and Dubai Expo City',
        ],
        'processSteps' => [
            ['step' => '1', 'title' => 'Order & Artwork Submission', 'desc' => 'Share your vector artwork or specifications via WhatsApp or email with our studio prepress team.'],
            ['step' => '2', 'title' => 'Prepress Digital Soft Proofing', 'desc' => 'Our prepress specialists check bleed, resolution, and CMYK color profiles, issuing a PDF proof within 2 hours.'],
            ['step' => '3', 'title' => 'Precision Production & Finishing', 'desc' => 'Printed on commercial HP Indigo digital or Heidelberg offset presses with luxury custom finishing applied.'],
            ['step' => '4', 'title' => 'Quality Inspection & UAE Delivery', 'desc' => 'Each batch undergoes manual QC before secure packaging and same-day or next-day courier delivery.'],
        ],
        'artworkRequirements' => [
            'formats' => 'Print-ready PDF (PDF/X-1a preferred), Adobe Illustrator (.AI), EPS, or high-res TIFF',
            'resolution' => '300 DPI minimum at 100% actual print scale',
            'bleed' => '3mm minimum bleed on all sides with a 4mm internal safety margin',
            'colorMode' => 'CMYK (Fogra 39). Specify Pantone PMS numbers where exact spot ink matching is required.',
        ],
        'faqs' => $faqs,
        'requestQuote' => [
            'phone' => FORMATTED_PHONE,
            'email' => CONTACT_EMAIL,
            'address' => STUDIO_ADDRESS,
            'turnaround' => $customGeo['keyInfo']['turnaround'] ?? 'Standard 24–48 Hours | Same-Day Rush Available',
        ],
    ];
}

/**
 * Rewrites internal absolute href="/..." links inside static blog HTML content to relative URLs.
 */
function rewrite_internal_html_links(string $html): string {
    return (string)preg_replace_callback('/href="\/([^"]*)"/i', function ($m) {
        return 'href="' . e(url('/' . $m[1])) . '"';
    }, $html);
}
