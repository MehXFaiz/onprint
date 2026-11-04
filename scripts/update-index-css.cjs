const fs = require('fs');
const path = require('path');

// 1. Transform client/src/index.css
const indexCssPath = path.join(__dirname, '..', 'client', 'src', 'index.css');
let cssContent = fs.readFileSync(indexCssPath, 'utf8');

const newRootAndTheme = `@import "tailwindcss";

:root {
  /* =========================================================================
     ONPRINT Premium Warm Beige & Light Brown Design System (WCAG 2.2 Compliant)
     =========================================================================
     Primary Background:   #F5F0E7 — Warm Beige main canvas & page sections.
     Secondary Background: #EDE3D5 — Cream Beige alternating sections & header bar.
     Card Background:      #FAF8F3 — Soft Ivory elevated cards & surfaces.
     Light Brown:          #C5A989 — Tactile highlights, badges & secondary buttons.
     Medium Brown:         #A98968 — Refined borders & hover states.
     Dark Brown:           #795C43 — Primary buttons & authoritative brand accents.
     Dark Brown Hover:     #5D442E — Rich espresso button hover state.
     Primary Text:         #352719 — High-contrast deep espresso primary text.
     Secondary Text:       #756657 — Warm taupe / medium brown secondary text.
     Borders:              #DED2C1 — Warm sand / refined beige borders.
     Pure White:           #FFFFFF — Clean accents & card contrast.
  */

  --color-primary-bg: #F5F0E7;
  --color-secondary-bg: #EDE3D5;
  --color-card-bg: #FAF8F3;

  --color-light-brown: #C5A989;
  --color-medium-brown: #A98968;
  --color-dark-brown: #795C43;
  --color-dark-brown-hover: #5D442E;

  --color-text-primary: #352719;
  --color-text-secondary: #756657;

  --color-border: #DED2C1;
  --color-border-hover: #C5A989;
  --color-white: #FFFFFF;

  /* Semantic Theme Tokens */
  --color-primary: #795C43;
  --color-accent: #795C43;
  --color-accent-hover: #5D442E;
  --color-accent-soft: rgba(197, 169, 137, 0.18);
  --color-white: #FFFFFF;
  --color-ivory: #FAF8F3;
  --color-secondary: #756657;
  --color-secondary-light: #756657;

  --color-background: #F5F0E7;
  --color-background-alt: #EDE3D5;
  --color-surface: #FAF8F3;
  --color-surface-alt: #EDE3D5;
  --color-surface-dark: #EDE3D5;
  --color-text: #352719;
  --color-text-secondary: #756657;
  --color-border: #DED2C1;

  /* Dedicated Tokens */
  --warm-beige: #F5F0E7;
  --cream-beige: #EDE3D5;
  --soft-ivory: #FAF8F3;
  --light-brown: #C5A989;
  --medium-brown: #A98968;
  --dark-brown: #795C43;
  --dark-brown-hover: #5D442E;
  --primary-text: #352719;
  --secondary-text: #756657;
  --border-beige: #DED2C1;

  /* Functional WhatsApp Tokens */
  --whatsapp: #25D366;
  --whatsapp-hover: #20BA59;
}

@theme {
  --color-warm-beige: #F5F0E7;
  --color-cream-beige: #EDE3D5;
  --color-soft-ivory: #FAF8F3;
  --color-light-brown: #C5A989;
  --color-medium-brown: #A98968;
  --color-dark-brown: #795C43;
  --color-dark-brown-hover: #5D442E;
  --color-primary-text: #352719;
  --color-secondary-text: #756657;
  --color-border-beige: #DED2C1;
  --color-pure-white: #FFFFFF;

  --color-primary: #795C43;
  --color-background: #F5F0E7;
  --color-surface: #FAF8F3;

  --font-display: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-sans: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
}

html {
  scroll-behavior: smooth;
  background-color: #F5F0E7 !important;
  color: #352719;
}

body {
  background-color: #F5F0E7 !important;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #352719;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'cv11', 'ss01';
  overflow-x: clip;
}

#root {
  background-color: #F5F0E7 !important;
  color: #352719;
}

::selection {
  background: #C5A989;
  color: #352719;
}

:focus-visible {
  outline: 2px solid #795C43;
  outline-offset: 2px;
}

/* =========================================================================
   MODERN ARCHITECTURAL BENTO CARDS & SURFACES (PREMIUM BEIGE & LIGHT BROWN)
   ========================================================================= */

.bento-card {
  position: relative;
  background: #FAF8F3;
  border: 1px solid #DED2C1;
  border-radius: 1.5rem;
  color: #352719;
  box-shadow:
    0 10px 30px -10px rgba(121, 92, 67, 0.08),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.8);
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.25s ease;
}

.bento-card:hover {
  border-color: #C5A989;
  box-shadow:
    0 20px 45px -10px rgba(121, 92, 67, 0.14),
    0 0 25px -4px rgba(197, 169, 137, 0.25);
  transform: translateY(-4px);
}

.bento-card-dark {
  position: relative;
  background: #EDE3D5;
  border: 1px solid #DED2C1;
  border-radius: 1.5rem;
  color: #352719;
  box-shadow:
    0 10px 25px -8px rgba(121, 92, 67, 0.08),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.25s ease;
}

.bento-card-dark:hover {
  border-color: #795C43;
  box-shadow:
    0 20px 40px -10px rgba(121, 92, 67, 0.16),
    0 0 25px -5px rgba(121, 92, 67, 0.2);
  transform: translateY(-4px);
}

.card-clean {
  background-color: #FAF8F3;
  border: 1px solid #DED2C1;
  border-radius: 1.25rem;
  color: #352719;
  box-shadow: 0 4px 20px -2px rgba(121, 92, 67, 0.06);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-clean:hover {
  border-color: #C5A989;
  box-shadow:
    0 14px 32px -6px rgba(121, 92, 67, 0.12),
    0 0 20px -4px rgba(197, 169, 137, 0.2);
  transform: translateY(-3px);
}

.btn-primary {
  background: #795C43;
  color: #FFFFFF;
  font-weight: 800;
  border: 1px solid #795C43;
  border-radius: 9999px;
  box-shadow: 0 4px 16px rgba(121, 92, 67, 0.25);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover {
  background: #5D442E;
  border-color: #5D442E;
  color: #FFFFFF;
  box-shadow: 0 8px 26px rgba(121, 92, 67, 0.38);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #EDE3D5;
  color: #352719;
  border: 1px solid #DED2C1;
  border-radius: 9999px;
  font-weight: 700;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-secondary:hover {
  background-color: #FAF8F3;
  border-color: #C5A989;
  color: #795C43;
  transform: translateY(-2px);
}

/* Premium Warm Beige Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #EDE3D5;
}

::-webkit-scrollbar-thumb {
  background: #C5A989;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #795C43;
}

/* =========================================================================
   PREMIUM BEIGE FORM CONTROLS & UTILITIES
   ========================================================================= */

input:not([type="checkbox"]):not([type="radio"]),
textarea,
select {
  background-color: #FFFFFF;
  border-color: #DED2C1;
  color: #352719;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #795C43;
  outline: none;
}

input::placeholder,
textarea::placeholder {
  color: #756657;
  opacity: 0.8;
}

/* Infinite Marquee */
@keyframes onprint-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.hero-marquee-track {
  display: flex;
  width: max-content;
  animation: onprint-marquee 32s linear infinite;
  will-change: transform;
}

.hero-marquee-track:hover {
  animation-play-state: paused;
}

/* =========================================================================
   PREMIUM BEIGE & LIGHT BROWN ANIMATION KEYFRAMES & UTILITIES
   ========================================================================= */

@keyframes onprint-float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(0.4deg);
  }
}

.animate-float {
  animation: onprint-float 5s ease-in-out infinite;
  will-change: transform;
}

.animate-float-delayed {
  animation: onprint-float 6s ease-in-out 1.5s infinite;
  will-change: transform;
}

/* Soft Ambient Pulse */
@keyframes onprint-gold-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(197, 169, 137, 0.45);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(197, 169, 137, 0);
  }
}

.animate-gold-pulse {
  animation: onprint-gold-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.hover-shimmer {
  position: relative;
  overflow: hidden;
}

.hover-shimmer::after {
  content: '';
  position: absolute;
  inset: -100%;
  background: linear-gradient(
    115deg,
    transparent 20%,
    rgba(197, 169, 137, 0.15) 40%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(197, 169, 137, 0.15) 60%,
    transparent 80%
  );
  transform: translateX(-100%) rotate(25deg);
  transition: transform 0.85s ease;
  pointer-events: none;
}

.hover-shimmer:hover::after {
  transform: translateX(100%) rotate(25deg);
}

.card-hover-lift {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s ease;
}

.card-hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 30px -8px rgba(121, 92, 67, 0.15), 0 0 20px -4px rgba(197, 169, 137, 0.2);
  border-color: #C5A989;
}

.group:hover .img-hover-scale {
  transform: scale(1.05);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.img-hover-scale {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

/* RTL & Arabic Typography */
html[lang="ar"],
body:has([dir="rtl"]),
[dir="rtl"] {
  font-family: 'Cairo', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
}

.safe-area-bottom {
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom, 0px));
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (max-width: 640px) {
  input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
  select,
  textarea {
    font-size: 16px;
  }
}

@media (max-width: 1024px), (prefers-reduced-motion: reduce) {
  main [style*="opacity: 0"],
  main [style*="opacity:0"] {
    opacity: 1 !important;
    transform: none !important;
  }
}

@media (max-width: 768px) {
  .blur-2xl,
  .blur-3xl,
  [class*="blur-["] {
    display: none !important;
  }
  .backdrop-blur-xs,
  .backdrop-blur-sm,
  .backdrop-blur-md,
  .backdrop-blur-lg,
  .backdrop-blur-xl {
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto !important;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .hero-marquee-track,
  .animate-float,
  .animate-float-delayed,
  .animate-gold-pulse {
    animation: none !important;
    transform: none !important;
  }

  .bento-card:hover,
  .bento-card-dark:hover,
  .card-clean:hover,
  .card-hover-lift:hover,
  .btn-primary:hover,
  .btn-secondary:hover,
  .group:hover .img-hover-scale {
    transform: none !important;
  }
}
`;

fs.writeFileSync(indexCssPath, newRootAndTheme, 'utf8');
console.log('Successfully updated client/src/index.css with Warm Beige & Light Brown system.');
