<?php
/**
 * ONPRINT Dubai — Reusable Site Footer, Floating WhatsApp Concierge & Mobile Bottom Action Bar (includes/footer.php)
 * Exact port of SiteFooter.jsx + FloatingWhatsApp.jsx + MobileBottomActionBar.jsx
 */

$counterpartLangUrl = get_counterpart_lang_url($ROUTE_PATH);
$hasDedicatedStickyBar = (
    strpos($ROUTE_PATH, 'business-card') !== false ||
    strpos($ROUTE_PATH, 'sticker') !== false ||
    strpos($ROUTE_PATH, 'stamp') !== false ||
    strpos($ROUTE_PATH, '/ar/') === 0
);

$quickPrompts = [
    ['key' => 'business-cards', 'label' => 'Business Cards (Dubai)', 'badge' => 'High Priority', 'url' => get_whatsapp_url('business-cards')],
    ['key' => 'stickers', 'label' => 'Stickers & Labels', 'badge' => 'Waterproof', 'url' => get_whatsapp_url('stickers')],
    ['key' => 'rollup-banners', 'label' => 'Roll-Up Banners', 'badge' => 'Event Ready', 'url' => get_whatsapp_url('rollup-banners')],
    ['key' => 'bottles', 'label' => 'Custom Bottle Printing', 'badge' => 'Drinkware', 'url' => get_whatsapp_url('bottles')],
    ['key' => 'stamps', 'label' => 'Custom Stamps & Seals', 'badge' => 'Express', 'url' => get_whatsapp_url('stamps')],
    ['key' => 'general', 'label' => 'Instant Custom Quote', 'badge' => 'Same-Day', 'url' => get_whatsapp_url('general')],
];
?>
  </main>

  <footer class="border-t border-[#DED2C1] bg-[#EDE3D5] text-[#756657]" dir="ltr">
    <!-- 1. HIGH-CONTRAST CALL TO ACTION BANNER -->
    <div class="border-b border-[#DED2C1] bg-[#F5F0E7] text-[#352719] py-16 sm:py-20 relative overflow-hidden">
      <div class="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#795C43]/10 blur-3xl" aria-hidden="true"></div>
      <div class="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#FAF8F3]/60 blur-3xl" aria-hidden="true"></div>

      <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="space-y-3 text-center md:text-left max-w-xl">
          <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#795C43] bg-[#795C43]/10 px-3 py-1 rounded-full border border-[#C5A989]/30">
            <?= icon('sparkles', 'h-3 w-3 text-[#795C43]') ?> DUBAI COMMERCIAL PRESSROOM • AL QUOZ
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#352719] tracking-tight leading-tight">
            Ready to Give Your Brand <span class="text-[#795C43]">Unmistakable Presence</span>?
          </h2>
          <p class="text-sm text-[#756657] leading-relaxed">
            Consult with our prepress engineers for physical paper swatches, 24K hot foil stamping, and rapid same-day UAE courier dispatch.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
          <a href="<?= e(url('/get-a-quote')) ?>" class="inline-flex items-center justify-center gap-2 rounded-full bg-[#795C43] hover:bg-[#5D442E] px-6 sm:px-7 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#795C43]/25 transition-all text-center">
            <span>Request Custom Quote</span>
            <?= icon('arrow-right', 'h-4 w-4 shrink-0') ?>
          </a>

          <a href="<?= e(get_whatsapp_url('general')) ?>" target="_blank" rel="noreferrer" class="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer text-center shadow-md shadow-emerald-500/20">
            <?= icon('whatsapp', 'h-4 w-4 shrink-0') ?>
            <span>WhatsApp Concierge</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 2. MAIN MODERNIST FOOTER GRID -->
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 text-[#756657]">
      <!-- Col 1: Brand Info -->
      <div class="space-y-4 lg:col-span-2 lg:pr-4">
        <a href="<?= e(url('/')) ?>" class="inline-block">
          <?= render_logo('default', 'lg') ?>
        </a>
        <p class="text-xs sm:text-sm leading-relaxed text-[#756657] max-w-sm">
          ONPRINT is Dubai’s premier commercial printing house in Al Quoz. Delivering precision 600–700 GSM cotton business cards, metallic foil packaging, corporate stationery, official seals, and high-impact signage across the UAE.
        </p>

        <div class="pt-2 flex flex-wrap items-center gap-2 text-[#352719]">
          <a href="<?= e(get_whatsapp_url('general')) ?>" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-[#25D366] hover:text-white transition-colors" aria-label="WhatsApp Direct Chat">
            <?= icon('whatsapp', 'h-3.5 w-3.5') ?>
            <span>WhatsApp Chat</span>
          </a>
          <a href="tel:+<?= e(WHATSAPP_PHONE) ?>" class="inline-flex items-center gap-1.5 rounded-full border border-[#DED2C1] bg-[#FAF8F3] px-3 py-1.5 text-xs font-bold text-[#352719] hover:border-[#C5A989] hover:text-[#795C43] transition-colors" aria-label="Call <?= e(FORMATTED_PHONE) ?>">
            <?= icon('phone', 'h-3 w-3 text-[#795C43]') ?>
            <span><?= e(FORMATTED_PHONE) ?></span>
          </a>
          <a href="mailto:<?= e(CONTACT_EMAIL) ?>" class="inline-flex items-center gap-1.5 rounded-full border border-[#DED2C1] bg-[#FAF8F3] px-3 py-1.5 text-xs font-bold text-[#352719] hover:border-[#C5A989] hover:text-[#795C43] transition-colors" aria-label="Email <?= e(CONTACT_EMAIL) ?>">
            <?= icon('mail', 'h-3 w-3 text-[#795C43]') ?>
            <span><?= e(CONTACT_EMAIL) ?></span>
          </a>
        </div>
      </div>

      <!-- Col 2: Signature Products -->
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#795C43]">Signature Products</p>
        <ul class="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
          <li><a href="<?= e(url('/business-card-printing-dubai')) ?>" class="inline-block py-0.5 transition-colors hover:text-[#795C43]">Business Card Printing Dubai</a></li>
          <li><a href="<?= e(url('/categories/stamps-printing-dubai')) ?>" class="inline-block py-0.5 transition-colors hover:text-[#795C43]">Company Stamps &amp; Seals</a></li>
          <li><a href="<?= e(url('/categories/stickers-labels-printing')) ?>" class="inline-block py-0.5 transition-colors hover:text-[#795C43]">Custom Sticker &amp; Label Printing</a></li>
          <li><a href="<?= e(url('/categories/rollup-banners')) ?>" class="inline-block py-0.5 transition-colors hover:text-[#795C43]">Roll-Up Banners Dubai</a></li>
          <li><a href="<?= e(url('/products/executive-120gsm-letterheads')) ?>" class="inline-block py-0.5 transition-colors hover:text-[#795C43]">Executive Letterheads</a></li>
          <li><a href="<?= e(url('/categories/bottle-printing-dubai')) ?>" class="inline-block py-0.5 transition-colors hover:text-[#795C43]">Custom Bottle Printing</a></li>
          <li>
            <a href="<?= e(url('/products')) ?>" class="inline-flex items-center gap-1 text-[#795C43] hover:underline font-bold pt-1">
              <span>View Full 120+ Catalog</span>
              <?= icon('arrow-right', 'h-3 w-3') ?>
            </a>
          </li>
        </ul>
      </div>

      <!-- Col 3: Commercial Services -->
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#795C43]">Commercial Services</p>
        <ul class="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
          <li><a href="<?= e(url('/services')) ?>" class="transition-colors hover:text-[#795C43]">All Printing Services</a></li>
          <li><a href="<?= e(url('/services/digital-offset-printing')) ?>" class="transition-colors hover:text-[#795C43]">German Heidelberg Offset</a></li>
          <li><a href="<?= e(url('/services/digital-offset-printing')) ?>" class="transition-colors hover:text-[#795C43]">HP Indigo Digital Press</a></li>
          <li><a href="<?= e(url('/finishes')) ?>" class="transition-colors hover:text-[#795C43]">24K Hot Foil Stamping</a></li>
          <li><a href="<?= e(url('/finishes')) ?>" class="transition-colors hover:text-[#795C43]">Raised 3D Spot UV</a></li>
          <li><a href="<?= e(url('/services')) ?>" class="transition-colors hover:text-[#795C43]">Same-Day Rush Dispatch</a></li>
          <li><a href="<?= e(url('/portfolio')) ?>" class="transition-colors hover:text-[#795C43]">Selected Portfolio</a></li>
        </ul>
      </div>

      <!-- Col 4: Pressroom Address & Hours -->
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#795C43]">Pressroom &amp; Atelier</p>
        <div class="mt-4 space-y-3 text-xs leading-relaxed text-[#756657]">
          <div class="flex items-start gap-2.5">
            <?= icon('map-pin', 'h-4 w-4 shrink-0 text-[#795C43] mt-0.5') ?>
            <span>Al Quoz, Dubai, United Arab Emirates (Online Inquiries &amp; UAE Delivery)</span>
          </div>
          <div class="flex items-start gap-2.5">
            <?= icon('clock', 'h-4 w-4 shrink-0 text-[#795C43] mt-0.5') ?>
            <div>
              <p class="text-[#352719]"><?= e(STUDIO_HOURS) ?></p>
              <p class="text-emerald-700 font-semibold mt-0.5">24h Priority Emergency Hotline</p>
            </div>
          </div>
          <div class="flex items-start gap-2.5">
            <?= icon('shield-check', 'h-4 w-4 shrink-0 text-emerald-700 mt-0.5') ?>
            <span>UAE Delivery Across All 7 Emirates: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, UAQ</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. BOTTOM COPYRIGHT & LEGAL BAR -->
    <div class="border-t border-[#DED2C1] bg-[#EDE3D5] py-6 pb-20 sm:pb-6 text-xs text-[#756657]">
      <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p>© <?= date('Y') ?> <?= e(SITE_LEGAL_NAME) ?>. All rights reserved. Registered in Dubai, UAE.</p>
        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6">
          <a href="<?= e(url('/privacy-policy')) ?>" class="hover:text-[#795C43] transition-colors">Privacy Policy</a>
          <span class="text-[#DED2C1] hidden sm:inline">|</span>
          <a href="<?= e(url('/terms')) ?>" class="hover:text-[#795C43] transition-colors">Terms &amp; Conditions</a>
          <span class="text-[#DED2C1] hidden sm:inline">|</span>
          <a href="<?= e(url('/track-order')) ?>" class="hover:text-[#795C43] transition-colors">Order Status</a>
          <span class="text-[#DED2C1] hidden sm:inline">|</span>
          <a href="<?= e($counterpartLangUrl) ?>" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#352719] hover:text-[#795C43] transition-all">
            <?= icon('globe', 'h-3.5 w-3.5 text-[#795C43] shrink-0') ?>
            <span class="font-semibold"><?= $IS_ARABIC ? 'English' : 'عربي' ?></span>
          </a>
        </div>
      </div>
    </div>
  </footer>

  <!-- FLOATING WHATSAPP CONCIERGE WIDGET -->
  <aside aria-label="WhatsApp Inquiry Concierge" class="fixed bottom-[74px] right-3 md:bottom-6 md:right-6 z-40 flex flex-col items-end pointer-events-auto" dir="ltr">
    <div id="floating-wa-panel" role="dialog" aria-label="ONPRINT WhatsApp Concierge" class="hidden mb-3 w-[min(370px,calc(100vw-1.5rem))] max-h-[calc(100vh-7.5rem)] flex-col overflow-hidden rounded-3xl border border-[#DED2C1] bg-[#FAF8F3] shadow-2xl text-[#352719]">
      <div class="relative shrink-0 bg-gradient-to-r from-[#128C7E] to-[#075E54] p-3.5 sm:p-4 text-white">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div class="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner">
              <?= icon('whatsapp', 'h-5 w-5 sm:h-6 sm:w-6') ?>
              <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#075E54] bg-emerald-400"></span>
            </div>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-1.5">
                <h4 class="font-bold text-xs sm:text-sm tracking-tight text-white truncate">ONPRINT Concierge</h4>
                <span class="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-black uppercase text-white shrink-0">Dubai Press</span>
              </div>
              <p class="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-100/90">
                <?= icon('clock', 'h-3 w-3 shrink-0') ?>
                <span class="truncate">Online • Quick response in &lt;15m</span>
              </p>
            </div>
          </div>
          <button type="button" data-toggle-wa="close" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white cursor-pointer" aria-label="Close WhatsApp chat">
            <?= icon('x', 'h-4 w-4') ?>
          </button>
        </div>

        <div class="mt-2.5 flex items-center gap-2 rounded-xl bg-black/20 px-3 py-1.5 text-[10.5px] sm:text-[11px] text-white/95">
          <?= icon('check-circle', 'h-3.5 w-3.5 text-emerald-300 shrink-0') ?>
          <span class="truncate">Direct Pressroom Hotline: <strong class="font-bold"><?= e(FORMATTED_PHONE) ?></strong></span>
        </div>
      </div>

      <div class="bg-[#F5F0E7] p-3.5 sm:p-4 space-y-3 max-h-[min(340px,46vh)] overflow-y-auto">
        <div class="flex items-start gap-2.5">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#128C7E] text-white text-[11px] font-bold">OP</div>
          <div class="rounded-2xl rounded-tl-none bg-[#FAF8F3] p-3 text-xs leading-relaxed text-[#352719] shadow-2xs border border-[#DED2C1]">
            <p class="font-medium text-[#352719]">Hello! Welcome to <strong class="text-[#795C43]">ONPRINT Dubai</strong>.</p>
            <p class="mt-1 text-[#756657]">Select a service to start a conversation with our master pressman, or type custom requirements:</p>
          </div>
        </div>

        <div class="space-y-1.5 pt-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#795C43] block px-1">Select Priority Service</span>
          <div class="flex flex-col gap-1.5">
            <?php foreach ($quickPrompts as $prompt): ?>
            <a href="<?= e($prompt['url']) ?>" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between gap-2 rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3 py-2 text-left text-xs font-semibold text-[#352719] transition-all hover:border-[#25D366] hover:bg-[#EDE3D5] shadow-2xs group">
              <span class="flex items-center gap-2 min-w-0">
                <?= icon('sparkles', 'h-3.5 w-3.5 text-[#795C43] shrink-0') ?>
                <span class="truncate"><?= e($prompt['label']) ?></span>
              </span>
              <span class="flex items-center gap-1.5 shrink-0">
                <span class="text-[9px] font-bold uppercase text-[#795C43] bg-[#F5F0E7] border border-[#DED2C1] px-1.5 py-0.5 rounded"><?= e($prompt['badge']) ?></span>
                <?= icon('send', 'h-3 w-3 text-[#756657] group-hover:text-[#25D366]') ?>
              </span>
            </a>
            <?php endforeach; ?>
          </div>
        </div>

        <form id="floating-wa-form" class="pt-2 border-t border-[#DED2C1]">
          <div class="relative flex items-center">
            <input id="floating-wa-input" type="text" placeholder="Type specs (e.g. 500 gold foil cards)..." class="w-full rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-2.5 pr-10 text-xs text-[#352719] placeholder:text-[#756657] focus:border-[#25D366] focus:outline-none" />
            <button type="submit" class="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#25D366] text-white hover:bg-[#20ba59] cursor-pointer" aria-label="Send WhatsApp message">
              <?= icon('send', 'h-3.5 w-3.5') ?>
            </button>
          </div>
        </form>

        <div class="pt-2.5 border-t border-[#DED2C1] space-y-1.5 text-[10.5px] text-[#756657]">
          <span class="block text-[9px] font-bold uppercase tracking-wider text-[#795C43]">Alternative Direct Contact:</span>
          <div class="grid grid-cols-2 gap-1.5">
            <a href="tel:+<?= e(WHATSAPP_PHONE) ?>" class="flex items-center justify-center gap-1.5 rounded-lg border border-[#DED2C1] bg-[#F5F0E7] px-2 py-1.5 text-[#352719] hover:border-[#C5A989] hover:text-[#795C43] transition-all font-semibold">
              <?= icon('phone', 'h-3 w-3 text-[#795C43]') ?><span>Call Hotline</span>
            </a>
            <a href="<?= e(url('/get-a-quote')) ?>" class="flex items-center justify-center gap-1.5 rounded-lg border border-[#DED2C1] bg-[#F5F0E7] px-2 py-1.5 text-[#352719] hover:border-[#C5A989] hover:text-[#795C43] transition-all font-semibold">
              <?= icon('file-text', 'h-3 w-3 text-[#795C43]') ?><span>Fast Web Quote</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Trigger Button -->
    <div class="relative">
      <span class="animate-gold-pulse absolute inset-0 rounded-full bg-[#795C43]/20 -z-10 pointer-events-none"></span>
      <button type="button" data-toggle-wa="toggle" aria-label="Open ONPRINT WhatsApp Concierge" class="flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-4 py-3 sm:px-5 sm:py-3.5 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer">
        <?= icon('whatsapp', 'h-5 w-5 sm:h-6 sm:w-6 shrink-0') ?>
        <span class="hidden sm:inline tracking-tight">WhatsApp Quote</span>
      </button>
    </div>
  </aside>

  <?php if (!$hasDedicatedStickyBar): ?>
  <!-- MOBILE STICKY BOTTOM ACTION BAR -->
  <nav aria-label="Mobile Bottom Actions" class="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#F5F0E7]/95 backdrop-blur-md border-t border-[#DED2C1] shadow-2xl px-2 py-1.5 safe-area-bottom" dir="ltr">
    <div class="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
      <a href="<?= e(get_whatsapp_url($ROUTE_PATH)) ?>" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl text-emerald-700 hover:bg-[#FAF8F3] transition-all">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs">
          <?= icon('whatsapp', 'h-3.5 w-3.5') ?>
        </div>
        <span class="text-[10px] font-bold tracking-tight mt-1 text-[#352719]">WhatsApp</span>
      </a>
      <a href="<?= e(url('/get-a-quote')) ?>" class="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl <?= $ROUTE_PATH === '/get-a-quote' ? 'text-[#795C43] bg-[#FAF8F3] font-black' : 'text-[#795C43] hover:bg-[#FAF8F3]' ?> transition-all">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-[#795C43] text-white font-black shadow-xs">
          <?= icon('file-text', 'h-3.5 w-3.5') ?>
        </div>
        <span class="text-[10px] font-extrabold tracking-tight mt-1 text-[#795C43]">Get Quote</span>
      </a>
      <a href="tel:+<?= e(WHATSAPP_PHONE) ?>" class="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl text-[#352719] hover:bg-[#FAF8F3] transition-all">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-[#FAF8F3] text-[#352719] shadow-2xs border border-[#DED2C1]">
          <?= icon('phone', 'h-3.5 w-3.5 text-[#795C43]') ?>
        </div>
        <span class="text-[10px] font-bold tracking-tight mt-1 text-[#352719]">Call Us</span>
      </a>
      <a href="<?= e(url('/track-order')) ?>" class="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl <?= $ROUTE_PATH === '/track-order' ? 'text-[#795C43] bg-[#FAF8F3] font-black' : 'text-[#352719] hover:bg-[#FAF8F3]' ?> transition-all">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-[#FAF8F3] text-[#352719] shadow-2xs border border-[#DED2C1]">
          <?= icon('package', 'h-3.5 w-3.5 text-[#795C43]') ?>
        </div>
        <span class="text-[10px] font-bold tracking-tight mt-1 text-[#352719]">Order Status</span>
      </a>
    </div>
  </nav>
  <?php endif; ?>

  <!-- Vanilla JavaScript Frontend Interactions (Relative Path) -->
  <script src="<?= e(asset('assets/js/main.js')) ?>" defer></script>
</body>
</html>
