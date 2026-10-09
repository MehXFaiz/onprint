const fs = require('fs')
const path = require('path')

const targetDirs = [
  path.join(__dirname, '..', 'client', 'src', 'assets', 'products', 'rollup-banners'),
  path.join(__dirname, '..', 'client', 'public', 'assets', 'products', 'rollup-banners')
]

for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

// 1. Standard Retractable Roll-Up Banner (85x200cm)
const svgStandard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" role="img" aria-label="Standard Retractable Roll-Up Banner 85x200cm">
  <defs>
    <radialGradient id="studioBg1" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </radialGradient>
    <linearGradient id="aluSilver" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="25%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="75%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <linearGradient id="bannerGraphic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="40%" stop-color="#1E293B"/>
      <stop offset="75%" stop-color="#A82F19"/>
      <stop offset="100%" stop-color="#831F0F"/>
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#0f172a" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Studio Floor & Lighting -->
  <rect width="1200" height="900" fill="url(#studioBg1)"/>
  <ellipse cx="600" cy="810" rx="420" ry="45" fill="#94a3b8" fill-opacity="0.45"/>
  <ellipse cx="600" cy="805" rx="300" ry="25" fill="#475569" fill-opacity="0.35"/>

  <!-- STAND STRUCTURE -->
  <g transform="translate(430, 80)" filter="url(#dropShadow)">
    
    <!-- Top Clamping Aluminum Rail (340 x 18) -->
    <rect x="0" y="0" width="340" height="18" rx="4" fill="url(#aluSilver)" stroke="#64748b" stroke-width="1"/>
    
    <!-- BANNER GRAPHIC FACE (340 x 680) - Represents 85cm x 200cm proportion -->
    <rect x="5" y="16" width="330" height="670" fill="url(#bannerGraphic)"/>
    
    <!-- Graphic Elements & Artwork -->
    <!-- Geometric Overlay lines -->
    <polygon points="5,16 335,16 335,280 5,140" fill="#ffffff" fill-opacity="0.04"/>
    <circle cx="280" cy="200" r="90" fill="#A82F19" fill-opacity="0.2"/>
    <polygon points="5,380 335,260 335,520 5,620" fill="#000000" fill-opacity="0.2"/>

    <!-- Header / Brand -->
    <g transform="translate(35, 60)">
      <rect width="40" height="40" rx="8" fill="#A82F19" stroke="#ffffff" stroke-width="1.5"/>
      <text x="20" y="26" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">ON</text>
      <text x="50" y="24" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="800" letter-spacing="1">ONPRINT DUBAI</text>
      <text x="50" y="38" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9" font-weight="600" letter-spacing="2">COMMERCIAL PRESS</text>
    </g>

    <!-- Headline -->
    <text x="35" y="160" fill="#f8fafc" font-family="'Playfair Display', Georgia, serif" font-size="26" font-weight="bold" letter-spacing="0.5">ELEVATE YOUR</text>
    <text x="35" y="195" fill="#facc15" font-family="'Playfair Display', Georgia, serif" font-size="30" font-weight="bold" letter-spacing="1">EXHIBITION</text>
    <text x="35" y="225" fill="#f8fafc" font-family="'Playfair Display', Georgia, serif" font-size="20" font-weight="600">PRESENCE</text>
    <line x1="35" y1="240" x2="160" y2="240" stroke="#facc15" stroke-width="3"/>

    <!-- Key Bullet Points -->
    <g transform="translate(35, 275)" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11" font-weight="600">
      <circle cx="6" cy="6" r="4" fill="#facc15"/>
      <text x="20" y="10">1440 DPI Ultra HD Print Fidelity</text>
      
      <circle cx="6" cy="32" r="4" fill="#facc15"/>
      <text x="20" y="36">220μm Anti-Curl Greyback Film</text>
      
      <circle cx="6" cy="58" r="4" fill="#facc15"/>
      <text x="20" y="62">Fast Same-Day Dubai Dispatch</text>

      <circle cx="6" cy="84" r="4" fill="#facc15"/>
      <text x="20" y="88">Anodized Lightweight Cassette</text>
    </g>

    <!-- Bottom Action Ribbon -->
    <g transform="translate(25, 540)">
      <rect width="290" height="90" rx="12" fill="#0B0F17" fill-opacity="0.85" stroke="#ffffff" stroke-width="1" stroke-opacity="0.15"/>
      <text x="20" y="30" fill="#facc15" font-family="system-ui, sans-serif" font-size="10" font-weight="900" letter-spacing="1.5">STANDARD DIMENSIONS</text>
      <text x="20" y="54" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="800">85 cm (W) × 200 cm (H)</text>
      <text x="20" y="74" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10" font-weight="600">Includes Travel Bag • Easy 30s Setup</text>
    </g>

    <!-- Specular Highlight Sweep -->
    <path d="M 40 16 L 120 16 L 70 686 L -10 686 Z" fill="#ffffff" fill-opacity="0.08"/>

    <!-- BASE CASSETTE (Main Aluminum Body 360 x 36) -->
    <rect x="-10" y="682" width="360" height="38" rx="6" fill="url(#aluSilver)" stroke="#475569" stroke-width="1.5"/>
    <line x1="-8" y1="692" x2="348" y2="692" stroke="#ffffff" stroke-width="1" stroke-opacity="0.8"/>
    <line x1="-8" y1="708" x2="348" y2="708" stroke="#334155" stroke-width="1" stroke-opacity="0.6"/>

    <!-- Twin Stabilizing Swing Feet -->
    <!-- Left Foot -->
    <polygon points="-5,710 45,710 25,745 -25,745" fill="url(#aluSilver)" stroke="#475569" stroke-width="1"/>
    <polygon points="-25,745 25,745 20,750 -30,750" fill="#334155"/>
    
    <!-- Right Foot -->
    <polygon points="295,710 345,710 365,745 315,745" fill="url(#aluSilver)" stroke="#475569" stroke-width="1"/>
    <polygon points="315,745 365,745 360,750 310,750" fill="#334155"/>
  </g>

  <!-- PADDED CARRY BAG (Lying beside on floor) -->
  <g transform="translate(140, 710) rotate(-6)" filter="url(#dropShadow)">
    <rect width="240" height="65" rx="14" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <path d="M 30 20 Q 120 -10 210 20" fill="none" stroke="#A82F19" stroke-width="4"/>
    <line x1="20" y1="33" x2="220" y2="33" stroke="#475569" stroke-width="2" stroke-dasharray="6,4"/>
    <text x="120" y="52" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10" font-weight="800" text-anchor="middle" letter-spacing="1">OXFORD NYLON CARRY BAG</text>
  </g>

  <!-- Spec Badge Callout -->
  <g transform="translate(820, 160)" filter="url(#dropShadow)">
    <rect width="260" height="150" rx="16" fill="#ffffff" fill-opacity="0.95" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="16" y="16" width="130" height="24" rx="6" fill="#A82F19"/>
    <text x="81" y="32" fill="#ffffff" font-family="system-ui, sans-serif" font-size="10" font-weight="900" text-anchor="middle" letter-spacing="1">BEST SELLER</text>
    
    <text x="16" y="66" fill="#0f172a" font-family="system-ui, sans-serif" font-size="15" font-weight="900">Standard 85 × 200 cm</text>
    <text x="16" y="88" fill="#475569" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• Anodized Aluminum Stand</text>
    <text x="16" y="108" fill="#475569" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• Anti-Curl Blockout PET</text>
    <text x="16" y="128" fill="#16a34a" font-family="system-ui, sans-serif" font-size="13" font-weight="800">From 145 AED • Same-Day</text>
  </g>
</svg>`

// 2. Luxury Teardrop Base Roll-Up Banner (85/100x200cm)
const svgTeardrop = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" role="img" aria-label="Luxury Teardrop Chrome Roll-Up Banner">
  <defs>
    <radialGradient id="studioBg2" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </radialGradient>
    <linearGradient id="chromeGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d4af37"/>
      <stop offset="25%" stop-color="#fff4cc"/>
      <stop offset="50%" stop-color="#aa7c11"/>
      <stop offset="75%" stop-color="#fff4cc"/>
      <stop offset="100%" stop-color="#996515"/>
    </linearGradient>
    <linearGradient id="chromeSilver" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#64748b"/>
      <stop offset="20%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="70%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="luxuryNavy" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <filter id="teardropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="#020617" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect width="1200" height="900" fill="url(#studioBg2)"/>
  <ellipse cx="600" cy="820" rx="460" ry="50" fill="#94a3b8" fill-opacity="0.5"/>

  <!-- TEARDROP STAND -->
  <g transform="translate(420, 60)" filter="url(#teardropShadow)">
    
    <!-- Top Chrome Rail -->
    <rect x="0" y="0" width="360" height="20" rx="5" fill="url(#chromeSilver)" stroke="#475569" stroke-width="1"/>
    
    <!-- Luxury Satin Banner Face (360 x 700) -->
    <rect x="6" y="18" width="348" height="692" fill="url(#luxuryNavy)"/>

    <!-- Gold Foil Accents & Frames -->
    <rect x="18" y="30" width="324" height="668" rx="8" fill="none" stroke="url(#chromeGold)" stroke-width="1.5"/>
    <rect x="22" y="34" width="316" height="660" rx="6" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.3"/>

    <!-- Luxury Brand Crest -->
    <g transform="translate(180, 110)">
      <circle cx="0" cy="0" r="35" fill="none" stroke="url(#chromeGold)" stroke-width="2"/>
      <circle cx="0" cy="0" r="28" fill="none" stroke="#ffffff" stroke-width="0.8" stroke-dasharray="4,3"/>
      <polygon points="0,-18 16,10 -16,10" fill="url(#chromeGold)"/>
      <text x="0" y="60" fill="url(#chromeGold)" font-family="'Cinzel', Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" letter-spacing="3">ONPRINT VIP</text>
      <text x="0" y="78" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9" font-weight="700" text-anchor="middle" letter-spacing="2">PRESSROOM SUITE • DUBAI</text>
    </g>

    <!-- Luxury Text Block -->
    <g transform="translate(180, 260)" text-anchor="middle">
      <text x="0" y="0" fill="#ffffff" font-family="'Playfair Display', Georgia, serif" font-size="28" font-weight="bold" letter-spacing="1">ANNUAL GLOBAL</text>
      <text x="0" y="36" fill="url(#chromeGold)" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="bold" letter-spacing="2">INVESTMENT</text>
      <text x="0" y="70" fill="#ffffff" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="600">SUMMIT 2026</text>
      <line x1="-80" y1="90" x2="80" y2="90" stroke="url(#chromeGold)" stroke-width="2"/>
      <text x="0" y="115" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="2">BURJ AL ARAB • DUBAI, UAE</text>
    </g>

    <!-- Key Features Card on Banner -->
    <g transform="translate(35, 470)">
      <rect width="290" height="150" rx="14" fill="#000000" fill-opacity="0.6" stroke="url(#chromeGold)" stroke-width="1"/>
      <text x="20" y="32" fill="url(#chromeGold)" font-family="system-ui, sans-serif" font-size="11" font-weight="900" letter-spacing="1.5">DELUXE TEARDROP CASSETTE</text>
      <text x="20" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="700">• Footless Wide Solid Aluminum Base</text>
      <text x="20" y="82" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="700">• Chrome Mirror High-Gloss Endcaps</text>
      <text x="20" y="106" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="700">• 260μm Satin Smooth Blockout Media</text>
      <text x="20" y="130" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="700">• Includes Heavy-Duty Padded Bag</text>
    </g>

    <!-- Specular Glare -->
    <path d="M 60 18 L 160 18 L 100 710 L 0 710 Z" fill="#ffffff" fill-opacity="0.06"/>

    <!-- TEARDROP SOLID BASE CASSETTE (Footless curved chrome profile) -->
    <!-- Main base -->
    <path d="M -15 710 C -15 710, -5 748, 30 752 L 330 752 C 365 748, 375 710, 375 710 Z" fill="url(#chromeSilver)" stroke="#334155" stroke-width="1.5"/>
    
    <!-- Chrome Teardrop Endcaps -->
    <!-- Left Chrome Endcap -->
    <ellipse cx="-10" cy="731" rx="14" ry="20" fill="url(#chromeSilver)" stroke="#0f172a" stroke-width="1"/>
    <ellipse cx="-10" cy="731" rx="8" ry="12" fill="#ffffff" fill-opacity="0.8"/>

    <!-- Right Chrome Endcap -->
    <ellipse cx="370" cy="731" rx="14" ry="20" fill="url(#chromeSilver)" stroke="#0f172a" stroke-width="1"/>
    <ellipse cx="370" cy="731" rx="8" ry="12" fill="#ffffff" fill-opacity="0.8"/>
  </g>

  <!-- Spec Callout -->
  <g transform="translate(830, 150)" filter="url(#teardropShadow)">
    <rect width="270" height="155" rx="16" fill="#ffffff" fill-opacity="0.95" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="16" y="16" width="135" height="24" rx="6" fill="#0f172a"/>
    <text x="83" y="32" fill="url(#chromeGold)" font-family="system-ui, sans-serif" font-size="10" font-weight="900" text-anchor="middle" letter-spacing="1">EXECUTIVE VIP</text>
    
    <text x="16" y="66" fill="#0f172a" font-family="system-ui, sans-serif" font-size="15" font-weight="900">Luxury Teardrop Base</text>
    <text x="16" y="88" fill="#475569" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• Footless Chrome Cassette</text>
    <text x="16" y="108" fill="#475569" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• Heavyweight High Stability</text>
    <text x="16" y="132" fill="#b45309" font-family="system-ui, sans-serif" font-size="13" font-weight="800">280 AED • Premium Model</text>
  </g>
</svg>`

// 3. Wide Exhibition Roll-Up Banner (100x200cm)
const svgWide = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" role="img" aria-label="Wide Exhibition Roll-Up Banner 100x200cm">
  <defs>
    <radialGradient id="studioBg3" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </radialGradient>
    <linearGradient id="wideGraphic" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#0c4a6e"/>
    </linearGradient>
    <linearGradient id="wideSilver" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <filter id="wideShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="#0c4a6e" flood-opacity="0.3"/>
    </filter>
  </defs>

  <rect width="1200" height="900" fill="url(#studioBg3)"/>
  <ellipse cx="600" cy="815" rx="500" ry="50" fill="#94a3b8" fill-opacity="0.5"/>

  <!-- WIDE STAND (430 x 700) -->
  <g transform="translate(385, 70)" filter="url(#wideShadow)">
    <rect x="0" y="0" width="430" height="18" rx="4" fill="url(#wideSilver)" stroke="#64748b"/>
    <rect x="6" y="16" width="418" height="674" fill="url(#wideGraphic)"/>

    <!-- Exhibition Graphic Grid -->
    <circle cx="215" cy="220" r="140" fill="#ffffff" fill-opacity="0.06"/>
    <polygon points="6,16 424,16 424,180 6,320" fill="#0284c7" fill-opacity="0.3"/>
    
    <g transform="translate(40, 60)">
      <text x="0" y="24" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12" font-weight="900" letter-spacing="2">DUBAI WORLD TRADE CENTRE</text>
      <text x="0" y="65" fill="#ffffff" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="bold">FUTURE TECH EXPO</text>
      <text x="0" y="100" fill="#bae6fd" font-family="system-ui, sans-serif" font-size="18" font-weight="700">INNOVATION &amp; AI CONVERGENCE</text>
      <line x1="0" y1="120" x2="350" y2="120" stroke="#38bdf8" stroke-width="3"/>
    </g>

    <g transform="translate(40, 240)" fill="#ffffff" font-family="system-ui, sans-serif">
      <rect width="350" height="160" rx="14" fill="#082f49" fill-opacity="0.7" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="20" y="35" fill="#38bdf8" font-size="14" font-weight="900">EXTRA-WIDE 100 CM COVERAGE</text>
      <text x="20" y="65" font-size="12" font-weight="600">• 18% Wider Visual Impact than Standard</text>
      <text x="20" y="92" font-size="12" font-weight="600">• Non-Glare 240μm Blockout PET Media</text>
      <text x="20" y="119" font-size="12" font-weight="600">• Sturdy Aluminum Snap Clamp System</text>
      <text x="20" y="145" font-size="12" font-weight="600">• Heavy-Duty Oxford Carrying Case</text>
    </g>

    <!-- Base -->
    <rect x="-10" y="688" width="450" height="38" rx="6" fill="url(#wideSilver)" stroke="#475569" stroke-width="1.5"/>
    <polygon points="-5,716 55,716 30,755 -30,755" fill="url(#wideSilver)" stroke="#475569"/>
    <polygon points="375,716 435,716 460,755 400,755" fill="url(#wideSilver)" stroke="#475569"/>
  </g>

  <!-- Spec Callout -->
  <g transform="translate(850, 160)" filter="url(#wideShadow)">
    <rect width="250" height="140" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <text x="20" y="32" fill="#0284c7" font-family="system-ui, sans-serif" font-size="11" font-weight="900" letter-spacing="1">EXHIBITION MODEL</text>
    <text x="20" y="64" fill="#0f172a" font-family="system-ui, sans-serif" font-size="16" font-weight="900">Wide 100 × 200 cm</text>
    <text x="20" y="88" fill="#475569" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• Ideal for DWTC &amp; Expos</text>
    <text x="20" y="115" fill="#0284c7" font-family="system-ui, sans-serif" font-size="14" font-weight="800">195 AED • Free Travel Bag</text>
  </g>
</svg>`

// 4. Giant Backdrop Roll-Up Banner (120x200cm)
const svgGiant = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" role="img" aria-label="Giant Stage Backdrop Roll-Up Banner 120x200cm">
  <defs>
    <radialGradient id="studioBg4" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </radialGradient>
    <linearGradient id="giantGraphic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="50%" stop-color="#27272a"/>
      <stop offset="100%" stop-color="#713f12"/>
    </linearGradient>
    <linearGradient id="giantGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#eab308"/>
      <stop offset="50%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="giantSilver" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#71717a"/>
      <stop offset="50%" stop-color="#f4f4f5"/>
      <stop offset="100%" stop-color="#52525b"/>
    </linearGradient>
    <filter id="giantShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="22" flood-color="#18181b" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect width="1200" height="900" fill="url(#studioBg4)"/>
  <ellipse cx="600" cy="820" rx="520" ry="55" fill="#94a3b8" fill-opacity="0.55"/>

  <!-- GIANT STAND (500 x 700) -->
  <g transform="translate(350, 65)" filter="url(#giantShadow)">
    <rect x="0" y="0" width="500" height="20" rx="4" fill="url(#giantSilver)" stroke="#52525b"/>
    <rect x="6" y="18" width="488" height="672" fill="url(#giantGraphic)"/>

    <!-- Stage Backdrop Pattern -->
    <g transform="translate(250, 150)" text-anchor="middle">
      <polygon points="0,-60 60,0 0,60 -60,0" fill="none" stroke="url(#giantGold)" stroke-width="2"/>
      <text x="0" y="100" fill="url(#giantGold)" font-family="'Playfair Display', Georgia, serif" font-size="36" font-weight="bold">KEYNOTE STAGE</text>
      <text x="0" y="135" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="800" letter-spacing="3">GLOBAL LEADERS SUMMIT</text>
      <line x1="-120" y1="155" x2="120" y2="155" stroke="url(#giantGold)" stroke-width="2.5"/>
    </g>

    <!-- Twin Support Pole Indicators -->
    <rect x="120" y="18" width="8" height="672" fill="#000000" fill-opacity="0.15"/>
    <rect x="372" y="18" width="8" height="672" fill="#000000" fill-opacity="0.15"/>

    <g transform="translate(50, 360)">
      <rect width="400" height="150" rx="14" fill="#09090b" fill-opacity="0.75" stroke="url(#giantGold)" stroke-width="1.5"/>
      <text x="25" y="35" fill="url(#giantGold)" font-family="system-ui, sans-serif" font-size="13" font-weight="900">MASSIVE 120 CM (1.2 METER) STAGE BACKDROP</text>
      <text x="25" y="65" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• Twin Heavy-Duty Telescopic Support Poles</text>
      <text x="25" y="90" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• Non-Reflective Flash-Proof Matte Media</text>
      <text x="25" y="115" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• Maximum Stage &amp; Photo-Wall Presence</text>
    </g>

    <!-- Base -->
    <rect x="-12" y="688" width="524" height="42" rx="6" fill="url(#giantSilver)" stroke="#3f3f46" stroke-width="1.5"/>
    <polygon points="-8,718 60,718 35,758 -35,758" fill="url(#giantSilver)" stroke="#3f3f46"/>
    <polygon points="440,718 508,718 535,758 465,758" fill="url(#giantSilver)" stroke="#3f3f46"/>
  </g>

  <!-- Spec Callout -->
  <g transform="translate(860, 160)" filter="url(#giantShadow)">
    <rect width="250" height="140" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <text x="20" y="32" fill="#ca8a04" font-family="system-ui, sans-serif" font-size="11" font-weight="900">MAXIMUM SIZE</text>
    <text x="20" y="64" fill="#0f172a" font-family="system-ui, sans-serif" font-size="16" font-weight="900">Giant 120 × 200 cm</text>
    <text x="20" y="88" fill="#475569" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• Dual Support Poles</text>
    <text x="20" y="115" fill="#ca8a04" font-family="system-ui, sans-serif" font-size="14" font-weight="800">340 AED • Stage Ready</text>
  </g>
</svg>`

// 5. Double-Sided 360° Retractable Roll-Up Banner (85x200cm)
const svgDoubleSided = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" role="img" aria-label="Double-Sided 360 Degree Retractable Roll-Up Banner">
  <defs>
    <radialGradient id="studioBg5" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </radialGradient>
    <linearGradient id="frontGraphic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
    <linearGradient id="backGraphic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857"/>
      <stop offset="100%" stop-color="#065f46"/>
    </linearGradient>
    <linearGradient id="dsSilver" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <filter id="dsShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="#064e3b" flood-opacity="0.3"/>
    </filter>
  </defs>

  <rect width="1200" height="900" fill="url(#studioBg5)"/>
  <ellipse cx="600" cy="815" rx="460" ry="45" fill="#94a3b8" fill-opacity="0.5"/>

  <!-- DUAL SIDED 3D PERSPECTIVE SETUP -->
  <!-- Back Face Angled -->
  <g transform="translate(520, 90) skewY(-8)" opacity="0.85">
    <rect x="0" y="0" width="280" height="660" fill="url(#backGraphic)" stroke="#047857"/>
    <text x="140" y="160" fill="#a7f3d0" font-family="'Playfair Display', serif" font-size="24" font-weight="bold" text-anchor="middle">REAR GRAPHIC</text>
    <text x="140" y="200" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">WALKWAY VIEW (180°)</text>
    <rect x="30" y="280" width="220" height="80" rx="10" fill="#022c22" fill-opacity="0.7"/>
    <text x="140" y="325" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">DUAL ROLLER MECHANISM</text>
  </g>

  <!-- Front Face Main -->
  <g transform="translate(360, 75)" filter="url(#dsShadow)">
    <rect x="0" y="0" width="320" height="18" rx="4" fill="url(#dsSilver)" stroke="#64748b"/>
    <rect x="6" y="16" width="308" height="670" fill="url(#frontGraphic)"/>
    
    <g transform="translate(30, 60)">
      <text x="0" y="24" fill="#6ee7b7" font-family="system-ui, sans-serif" font-size="11" font-weight="900" letter-spacing="2">DUBAI MALL &amp; AIRPORT DISPLAY</text>
      <text x="0" y="65" fill="#ffffff" font-family="'Playfair Display', serif" font-size="30" font-weight="bold">360° TWO-WAY</text>
      <text x="0" y="98" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="18" font-weight="800">TRAFFIC ENGAGEMENT</text>
      <line x1="0" y1="115" x2="250" y2="115" stroke="#6ee7b7" stroke-width="3"/>
    </g>

    <g transform="translate(25, 240)">
      <rect width="260" height="150" rx="12" fill="#022c22" fill-opacity="0.8" stroke="#6ee7b7" stroke-width="1.5"/>
      <text x="15" y="30" fill="#6ee7b7" font-family="system-ui, sans-serif" font-size="12" font-weight="900">DUAL-GRAPHIC CASSETTE</text>
      <text x="15" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Two Independent Rollers</text>
      <text x="15" y="82" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Back-to-Back 85×200cm Print</text>
      <text x="15" y="106" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• 360° Hallway &amp; Aisle Visibility</text>
      <text x="15" y="130" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Heavyweight Balanced Base</text>
    </g>

    <!-- Heavy Dual Roller Base -->
    <rect x="-10" y="684" width="340" height="42" rx="6" fill="url(#dsSilver)" stroke="#334155" stroke-width="1.5"/>
  </g>

  <!-- Spec Callout -->
  <g transform="translate(850, 160)" filter="url(#dsShadow)">
    <rect width="250" height="140" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <text x="20" y="32" fill="#059669" font-family="system-ui, sans-serif" font-size="11" font-weight="900">DUAL SIDED 360°</text>
    <text x="20" y="64" fill="#0f172a" font-family="system-ui, sans-serif" font-size="16" font-weight="900">85 × 200 cm (Double)</text>
    <text x="20" y="88" fill="#475569" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• 2 Banners in 1 Stand</text>
    <text x="20" y="115" fill="#059669" font-family="system-ui, sans-serif" font-size="14" font-weight="800">290 AED • High Traffic</text>
  </g>
</svg>`

// 6. Desktop Mini Tabletop Roll-Up Banner (A4 / A3)
const svgDesktopMini = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" role="img" aria-label="Desktop Mini Tabletop Roll-Up Banner A3 A4">
  <defs>
    <radialGradient id="studioBg6" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </radialGradient>
    <linearGradient id="miniGraphic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
    <linearGradient id="miniSilver" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <filter id="miniShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="16" flood-color="#7f1d1d" flood-opacity="0.3"/>
    </filter>
  </defs>

  <rect width="1200" height="900" fill="url(#studioBg6)"/>
  
  <!-- Desk Surface Surface -->
  <polygon points="100,750 1100,750 1200,900 0,900" fill="#e2e8f0" stroke="#cbd5e1"/>
  <ellipse cx="600" cy="740" rx="350" ry="35" fill="#94a3b8" fill-opacity="0.45"/>

  <!-- MINI TABLETOP BANNER (260 x 480) -->
  <g transform="translate(470, 240)" filter="url(#miniShadow)">
    <rect x="0" y="0" width="260" height="14" rx="3" fill="url(#miniSilver)" stroke="#64748b"/>
    <rect x="4" y="12" width="252" height="470" fill="url(#miniGraphic)"/>

    <!-- Content on Mini Banner -->
    <g transform="translate(25, 40)">
      <rect width="32" height="32" rx="6" fill="#ffffff"/>
      <text x="16" y="22" fill="#dc2626" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">ON</text>
      <text x="42" y="20" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="800">ONPRINT</text>
      <text x="42" y="32" fill="#fecaca" font-family="system-ui, sans-serif" font-size="8" font-weight="700">SPECIAL OFFER</text>
    </g>

    <g transform="translate(25, 120)">
      <text x="0" y="24" fill="#ffffff" font-family="'Playfair Display', serif" font-size="22" font-weight="bold">SCAN &amp; SAVE</text>
      <text x="0" y="52" fill="#fef08a" font-family="system-ui, sans-serif" font-size="28" font-weight="900">20% OFF</text>
      <text x="0" y="74" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="600">ON YOUR NEXT PRINT ORDER</text>
      <line x1="0" y1="88" x2="200" y2="88" stroke="#fef08a" stroke-width="2"/>
    </g>

    <!-- Simulated QR Code -->
    <g transform="translate(80, 230)">
      <rect width="90" height="90" rx="8" fill="#ffffff"/>
      <rect x="10" y="10" width="24" height="24" fill="#000000"/>
      <rect x="56" y="10" width="24" height="24" fill="#000000"/>
      <rect x="10" y="56" width="24" height="24" fill="#000000"/>
      <rect x="16" y="16" width="12" height="12" fill="#ffffff"/>
      <rect x="62" y="16" width="12" height="12" fill="#ffffff"/>
      <rect x="16" y="62" width="12" height="12" fill="#ffffff"/>
      <rect x="42" y="42" width="10" height="10" fill="#dc2626"/>
      <text x="45" y="112" fill="#ffffff" font-family="system-ui, sans-serif" font-size="10" font-weight="800" text-anchor="middle">SCAN WITH PHONE</text>
    </g>

    <!-- Mini Aluminum Base -->
    <rect x="-8" y="480" width="276" height="24" rx="4" fill="url(#miniSilver)" stroke="#475569" stroke-width="1.2"/>
  </g>

  <!-- Scale comparison element (Coffee Cup / Pen on table) -->
  <g transform="translate(320, 640)" filter="url(#miniShadow)">
    <rect width="60" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
    <rect x="6" y="6" width="48" height="73" rx="4" fill="#475569"/>
    <text x="30" y="48" fill="#ffffff" font-family="system-ui, sans-serif" font-size="9" font-weight="700" text-anchor="middle">PHONE</text>
  </g>

  <!-- Spec Callout -->
  <g transform="translate(820, 240)" filter="url(#miniShadow)">
    <rect width="260" height="145" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <text x="20" y="32" fill="#dc2626" font-family="system-ui, sans-serif" font-size="11" font-weight="900">TABLETOP MINI</text>
    <text x="20" y="64" fill="#0f172a" font-family="system-ui, sans-serif" font-size="16" font-weight="900">A4 &amp; A3 Desktop Pull-Up</text>
    <text x="20" y="88" fill="#475569" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• For POS Counters &amp; Receptions</text>
    <text x="20" y="118" fill="#dc2626" font-family="system-ui, sans-serif" font-size="14" font-weight="800">65 AED • Compact &amp; Cute</text>
  </g>
</svg>`

const files = [
  { name: 'standard-rollup-banner-85x200.svg', content: svgStandard },
  { name: 'luxury-teardrop-rollup-banner-85x200.svg', content: svgTeardrop },
  { name: 'wide-exhibition-rollup-banner-100x200.svg', content: svgWide },
  { name: 'giant-backdrop-rollup-banner-120x200.svg', content: svgGiant },
  { name: 'double-sided-rollup-banner-85x200.svg', content: svgDoubleSided },
  { name: 'desktop-mini-tabletop-rollup-banner.svg', content: svgDesktopMini }
]

for (const dir of targetDirs) {
  for (const f of files) {
    fs.writeFileSync(path.join(dir, f.name), f.content, 'utf8')
  }
}
console.log('Successfully generated all 6 Rollup Banner SVG graphics in assets directories!')
