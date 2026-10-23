const fs = require('fs');
const path = require('path');

const catalogPath = path.resolve(__dirname, '../client/src/data/catalogProducts.json');
const products = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Check if prod-1805 already exists
if (products.some(p => p.id === 1805)) {
  console.log('Stamp products 1805+ already exist in catalogProducts.json');
  process.exit(0);
}

const stampCategory = {
  "_id": "cat-stamps-printing-dubai",
  "id": 18,
  "name": "Custom Stamps & Seals",
  "slug": "stamps-printing-dubai"
};

const newStampProducts = [
  {
    "_id": "prod-1805",
    "id": 1805,
    "product_key": "prod-1805",
    "name": "Round Company Seal Stamp",
    "slug": "round-company-stamps",
    "description": "Official circular corporate seal stamp in Dubai, laser-etched to microscopic precision for UAE LLC agreements, corporate bank account documentation, Ministry approvals, and trade authorizations. Encased in genuine Austrian Trodat Printy circular casing or Colop round casing with concentric Arabic and English company names, registration number, and official corporate emblem.",
    "shortDescription": "Official circular corporate seal stamp with dual English & Arabic company name and trade license details for Dubai legal documents.",
    "short_description": "Official circular corporate seal stamp with dual English & Arabic company name and trade license details for Dubai legal documents.",
    "price": 95,
    "min_quantity": 1,
    "minimumQuantity": 1,
    "minimum_quantity": 1,
    "unit": "pcs",
    "featured": true,
    "active": true,
    "images": [
      "/assets/products/stamps/self-inking-company-stamp.jpg"
    ],
    "image": "/assets/products/stamps/self-inking-company-stamp.jpg",
    "image_url": "/assets/products/stamps/self-inking-company-stamp.jpg",
    "category_id": 18,
    "category": stampCategory,
    "categories": [stampCategory],
    "specifications": {
      "materials": [
        { "label": "Trodat Printy 4642 Circular Casing (42mm)", "priceModifier": 0 },
        { "label": "Colop Printer R40 Round Body (40mm)", "priceModifier": 10 },
        { "label": "Heavy-Duty Metal Core Round Stamp", "priceModifier": 40 }
      ],
      "sizes": [
        { "label": "Standard Legal Round (40 mm Dia)", "priceModifier": 0 },
        { "label": "Compact Circular Seal (30 mm Dia)", "priceModifier": 0 },
        { "label": "Large Corporate Seal (45 mm Dia)", "priceModifier": 20 },
        { "label": "Extra Large Notary Round (50 mm Dia)", "priceModifier": 35 }
      ],
      "finishes": [
        { "label": "Official Blue Ink (Bank & Legal Standard)", "priceModifier": 0 },
        { "label": "Classic Black Ink", "priceModifier": 0 },
        { "label": "Security Red Ink", "priceModifier": 0 },
        { "label": "Forest Green Ink", "priceModifier": 0 },
        { "label": "Royal Violet Ink", "priceModifier": 0 }
      ]
    },
    "seoTitle": "Round Company Stamp Dubai | Official Corporate Seal Stamp | ONPRINT",
    "seoDescription": "Order official round company stamps in Dubai. Trodat & Colop circular company seals for UAE trade license compliance, bank papers, and contracts. Express 2-hour delivery.",
    "seoKeywords": "round company stamp dubai, corporate seal dubai, circular stamp uae, company seal maker dubai, round rubber stamp uae",
    "seoHeading": "Round Corporate Seal Stamp Dubai",
    "canonicalUrl": "https://www.0nprint.com/products/round-company-stamps",
    "imageAlt": "Round Company Seal Stamp printing Dubai",
    "seo_title": "Round Company Stamp Dubai | Official Corporate Seal Stamp | ONPRINT",
    "seo_description": "Order official round company stamps in Dubai. Trodat & Colop circular company seals for UAE trade license compliance, bank papers, and contracts. Express 2-hour delivery.",
    "seo_keywords": "round company stamp dubai, corporate seal dubai, circular stamp uae, company seal maker dubai, round rubber stamp uae",
    "seo_heading": "Round Corporate Seal Stamp Dubai",
    "canonical_url": "https://www.0nprint.com/products/round-company-stamps",
    "image_alt": "Round Company Seal Stamp printing Dubai"
  },
  {
    "_id": "prod-1806",
    "id": 1806,
    "product_key": "prod-1806",
    "name": "Rectangular Office & Business Stamp",
    "slug": "rectangular-company-stamps",
    "description": "Standard rectangular office and company rubber stamp designed for everyday administrative paperwork, tax invoices, delivery notes, purchase orders, and official correspondence across Dubai and the UAE. Accommodates 3 to 6 lines of text including Company Name, PO Box, Emirate, Phone, Email, and TRN.",
    "shortDescription": "Classic rectangular self-inking office stamp for invoices, delivery notes, and everyday business paperwork in Dubai.",
    "short_description": "Classic rectangular self-inking office stamp for invoices, delivery notes, and everyday business paperwork in Dubai.",
    "price": 85,
    "min_quantity": 1,
    "minimumQuantity": 1,
    "minimum_quantity": 1,
    "unit": "pcs",
    "featured": true,
    "active": true,
    "images": [
      "/assets/products/stamps/self-inking-company-stamp.jpg"
    ],
    "image": "/assets/products/stamps/self-inking-company-stamp.jpg",
    "image_url": "/assets/products/stamps/self-inking-company-stamp.jpg",
    "category_id": 18,
    "category": stampCategory,
    "categories": [stampCategory],
    "specifications": {
      "materials": [
        { "label": "Trodat Printy 4.0 Eco-Casing", "priceModifier": 0 },
        { "label": "Colop Printer Standard Body", "priceModifier": 0 },
        { "label": "Trodat Heavy-Duty Steel Core", "priceModifier": 45 }
      ],
      "sizes": [
        { "label": "Compact 3-Line (38 × 14 mm)", "priceModifier": 0 },
        { "label": "Standard 4-5 Line (47 × 18 mm)", "priceModifier": 0 },
        { "label": "Large Document 6-Line (58 × 22 mm)", "priceModifier": 20 },
        { "label": "Extra Large (70 × 25 mm)", "priceModifier": 35 },
        { "label": "Jumbo Executive (75 × 38 mm)", "priceModifier": 50 }
      ],
      "finishes": [
        { "label": "Official Blue Ink", "priceModifier": 0 },
        { "label": "Classic Black Ink", "priceModifier": 0 },
        { "label": "Security Red Ink", "priceModifier": 0 },
        { "label": "Forest Green Ink", "priceModifier": 0 }
      ]
    },
    "seoTitle": "Rectangular Company Stamp Dubai | Office Rubber Stamps | ONPRINT",
    "seoDescription": "Custom rectangular company stamps in Dubai. Multi-line self-inking rubber stamps for invoices, trade license details, and office administration. Same-day Al Quoz dispatch.",
    "seoKeywords": "rectangular company stamp dubai, office stamps dubai, business stamp dubai, rectangular stamp maker uae, self inking office stamp dubai",
    "seoHeading": "Rectangular Office & Company Stamp",
    "canonicalUrl": "https://www.0nprint.com/products/rectangular-company-stamps",
    "imageAlt": "Rectangular Company Stamp printing Dubai",
    "seo_title": "Rectangular Company Stamp Dubai | Office Rubber Stamps | ONPRINT",
    "seo_description": "Custom rectangular company stamps in Dubai. Multi-line self-inking rubber stamps for invoices, trade license details, and office administration. Same-day Al Quoz dispatch.",
    "seo_keywords": "rectangular company stamp dubai, office stamps dubai, business stamp dubai, rectangular stamp maker uae, self inking office stamp dubai",
    "seo_heading": "Rectangular Office & Company Stamp",
    "canonical_url": "https://www.0nprint.com/products/rectangular-company-stamps",
    "image_alt": "Rectangular Company Stamp printing Dubai"
  },
  {
    "_id": "prod-1807",
    "id": 1807,
    "product_key": "prod-1807",
    "name": "Name & Personal Signature Stamp",
    "slug": "name-signature-stamps",
    "description": "Precision personal name and facsimile signature rubber stamp. Ideal for medical doctors, hospital nurses, chartered accountants, legal advocates, supervising engineers, and C-level executives in Dubai who frequently sign prescription pads, architectural drawings, inspection reports, and purchase authorizations.",
    "shortDescription": "Compact personal name and signature self-inking stamp for doctors, engineers, accountants, and executives.",
    "short_description": "Compact personal name and signature self-inking stamp for doctors, engineers, accountants, and executives.",
    "price": 75,
    "min_quantity": 1,
    "minimumQuantity": 1,
    "minimum_quantity": 1,
    "unit": "pcs",
    "featured": false,
    "active": true,
    "images": [
      "/assets/products/stamps/pocket-mobile-stamp.jpg"
    ],
    "image": "/assets/products/stamps/pocket-mobile-stamp.jpg",
    "image_url": "/assets/products/stamps/pocket-mobile-stamp.jpg",
    "category_id": 18,
    "category": stampCategory,
    "categories": [stampCategory],
    "specifications": {
      "materials": [
        { "label": "Trodat Printy Compact Casing", "priceModifier": 0 },
        { "label": "Colop Pocket Slide Format", "priceModifier": 15 },
        { "label": "Shiny Handy Mobile Shell", "priceModifier": 10 }
      ],
      "sizes": [
        { "label": "Single-Line Name (38 × 14 mm)", "priceModifier": 0 },
        { "label": "Name + License No. (47 × 18 mm)", "priceModifier": 10 },
        { "label": "Full Facsimile Signature + Title (58 × 22 mm)", "priceModifier": 25 }
      ],
      "finishes": [
        { "label": "Official Blue Ink", "priceModifier": 0 },
        { "label": "Classic Black Ink", "priceModifier": 0 },
        { "label": "Security Red Ink", "priceModifier": 0 }
      ]
    },
    "seoTitle": "Name Stamp & Signature Stamp Dubai | Personal Rubber Stamps | ONPRINT",
    "seoDescription": "Order custom name stamps and signature stamps in Dubai. Self-inking doctor, engineer license, and executive facsimile signature stamps with 2-hour express turnaround.",
    "seoKeywords": "name stamp dubai, signature stamp dubai, doctor stamp dubai, engineer license stamp uae, personal rubber stamp dubai",
    "seoHeading": "Name & Signature Rubber Stamp",
    "canonicalUrl": "https://www.0nprint.com/products/name-signature-stamps",
    "imageAlt": "Name & Signature Stamp printing Dubai",
    "seo_title": "Name Stamp & Signature Stamp Dubai | Personal Rubber Stamps | ONPRINT",
    "seo_description": "Order custom name stamps and signature stamps in Dubai. Self-inking doctor, engineer license, and executive facsimile signature stamps with 2-hour express turnaround.",
    "seo_keywords": "name stamp dubai, signature stamp dubai, doctor stamp dubai, engineer license stamp uae, personal rubber stamp dubai",
    "seo_heading": "Name & Signature Rubber Stamp",
    "canonical_url": "https://www.0nprint.com/products/name-signature-stamps",
    "image_alt": "Name & Signature Stamp printing Dubai"
  },
  {
    "_id": "prod-1808",
    "id": 1808,
    "product_key": "prod-1808",
    "name": "Custom Logo & Brand Rubber Stamp",
    "slug": "custom-logo-stamps",
    "description": "Ultra-sharp custom logo rubber stamp laser-etched to 1000 DPI vector fidelity. Reproduces intricate brand logos, decorative crests, coffee cup stamps, paper bag packaging seals, and retail loyalty stamps. Suitable for smooth bond paper, kraft boxes, untreated wood, and unglazed cardboard.",
    "shortDescription": "High-definition laser-etched rubber stamp reproducing your custom vector logo, emblem, or packaging crest.",
    "short_description": "High-definition laser-etched rubber stamp reproducing your custom vector logo, emblem, or packaging crest.",
    "price": 110,
    "min_quantity": 1,
    "minimumQuantity": 1,
    "minimum_quantity": 1,
    "unit": "pcs",
    "featured": true,
    "active": true,
    "images": [
      "/assets/products/stamps/self-inking-company-stamp.jpg"
    ],
    "image": "/assets/products/stamps/self-inking-company-stamp.jpg",
    "image_url": "/assets/products/stamps/self-inking-company-stamp.jpg",
    "category_id": 18,
    "category": stampCategory,
    "categories": [stampCategory],
    "specifications": {
      "materials": [
        { "label": "Self-Inking High-Impact Casing", "priceModifier": 0 },
        { "label": "Handcrafted Beechwood Mount + Separate Pad", "priceModifier": 20 },
        { "label": "Heavy Metal Commercial Frame", "priceModifier": 45 }
      ],
      "sizes": [
        { "label": "Circular Logo (40 mm Diameter)", "priceModifier": 0 },
        { "label": "Square Brand Stamp (50 × 50 mm)", "priceModifier": 20 },
        { "label": "Large Rectangular Logo (60 × 40 mm)", "priceModifier": 30 },
        { "label": "Coffee Cup / Loyalty Card Mini (20 × 20 mm)", "priceModifier": 0 }
      ],
      "finishes": [
        { "label": "Official Blue Ink", "priceModifier": 0 },
        { "label": "Classic Black Ink", "priceModifier": 0 },
        { "label": "Security Red Ink", "priceModifier": 0 },
        { "label": "Forest Green Ink", "priceModifier": 0 },
        { "label": "Metallic Gold Specialty Ink Pad", "priceModifier": 35 }
      ]
    },
    "seoTitle": "Custom Logo Stamp Dubai | Brand Rubber Stamps & Packaging Seals | ONPRINT",
    "seoDescription": "Laser-etched custom logo stamps in Dubai. Precision rubber stamps with your brand emblem for packaging, cups, contracts, and loyalty cards. Express same-day production.",
    "seoKeywords": "custom logo stamp dubai, brand rubber stamp uae, custom stamp maker dubai, logo stamp for packaging, custom rubber stamp dubai",
    "seoHeading": "Custom Logo & Brand Rubber Stamp",
    "canonicalUrl": "https://www.0nprint.com/products/custom-logo-stamps",
    "imageAlt": "Custom Logo Stamp printing Dubai",
    "seo_title": "Custom Logo Stamp Dubai | Brand Rubber Stamps & Packaging Seals | ONPRINT",
    "seo_description": "Laser-etched custom logo stamps in Dubai. Precision rubber stamps with your brand emblem for packaging, cups, contracts, and loyalty cards. Express same-day production.",
    "seo_keywords": "custom logo stamp dubai, brand rubber stamp uae, custom stamp maker dubai, logo stamp for packaging, custom rubber stamp dubai",
    "seo_heading": "Custom Logo & Brand Rubber Stamp",
    "canonical_url": "https://www.0nprint.com/products/custom-logo-stamps",
    "image_alt": "Custom Logo Stamp printing Dubai"
  },
  {
    "_id": "prod-1809",
    "id": 1809,
    "product_key": "prod-1809",
    "name": "VAT & TRN Tax Invoice Stamp",
    "slug": "vat-trn-stamps",
    "description": "Pre-formatted UAE Federal Tax Authority (FTA) compliant corporate rubber stamp. Displays legal company name in Arabic and English, 15-digit Tax Registration Number (TRN), Authorized Signatory line, and date area. Essential for accounts departments, VAT commercial invoices, tax credit notes, and customs clearance paperwork.",
    "shortDescription": "Official FTA compliant VAT & TRN rubber stamp with 15-digit Tax Registration Number and authorized signature box.",
    "short_description": "Official FTA compliant VAT & TRN rubber stamp with 15-digit Tax Registration Number and authorized signature box.",
    "price": 85,
    "min_quantity": 1,
    "minimumQuantity": 1,
    "minimum_quantity": 1,
    "unit": "pcs",
    "featured": false,
    "active": true,
    "images": [
      "/assets/products/stamps/self-inking-company-stamp.jpg"
    ],
    "image": "/assets/products/stamps/self-inking-company-stamp.jpg",
    "image_url": "/assets/products/stamps/self-inking-company-stamp.jpg",
    "category_id": 18,
    "category": stampCategory,
    "categories": [stampCategory],
    "specifications": {
      "materials": [
        { "label": "Trodat Printy 4913 High-Capacity Casing", "priceModifier": 0 },
        { "label": "Colop Printer Line", "priceModifier": 0 },
        { "label": "Heavy-Duty Steel Core for Accounts", "priceModifier": 40 }
      ],
      "sizes": [
        { "label": "Standard TRN Box (58 × 22 mm)", "priceModifier": 0 },
        { "label": "Detailed Multi-Emirate TRN (70 × 25 mm)", "priceModifier": 20 },
        { "label": "Compact Invoice Margin (47 × 18 mm)", "priceModifier": 0 }
      ],
      "finishes": [
        { "label": "Official Blue Ink", "priceModifier": 0 },
        { "label": "Classic Black Ink", "priceModifier": 0 },
        { "label": "Security Red Ink", "priceModifier": 0 }
      ]
    },
    "seoTitle": "VAT Stamp UAE | TRN Company Stamp Dubai | Tax Invoice Stamp | ONPRINT",
    "seoDescription": "FTA compliant VAT & TRN rubber stamps in Dubai. Official tax registration number company stamps for commercial invoices and accounts. Express delivery across UAE.",
    "seoKeywords": "vat stamp uae, trn stamp uae, tax invoice stamp dubai, vat stamp maker dubai, company trn stamp uae",
    "seoHeading": "VAT & TRN Tax Invoice Company Stamp",
    "canonicalUrl": "https://www.0nprint.com/products/vat-trn-stamps",
    "imageAlt": "VAT TRN Company Stamp printing Dubai",
    "seo_title": "VAT Stamp UAE | TRN Company Stamp Dubai | Tax Invoice Stamp | ONPRINT",
    "seo_description": "FTA compliant VAT & TRN rubber stamps in Dubai. Official tax registration number company stamps for commercial invoices and accounts. Express delivery across UAE.",
    "seo_keywords": "vat stamp uae, trn stamp uae, tax invoice stamp dubai, vat stamp maker dubai, company trn stamp uae",
    "seo_heading": "VAT & TRN Tax Invoice Company Stamp",
    "canonical_url": "https://www.0nprint.com/products/vat-trn-stamps",
    "image_alt": "VAT TRN Company Stamp printing Dubai"
  },
  {
    "_id": "prod-1810",
    "id": 1810,
    "product_key": "prod-1810",
    "name": "Custom Stamp Design & Bulk Corporate Stamp Orders",
    "slug": "bulk-corporate-stamp-orders",
    "description": "Turnkey corporate stamp provisioning for UAE enterprise groups, multi-branch banks, government contractors, healthcare networks, hospitality chains, and law firms. Includes unified brand template design, bulk trade license verification, volume discounts up to 35%, and scheduled multi-address courier dispatch across all 7 Emirates.",
    "shortDescription": "Volume corporate stamp manufacturing with unified brand templates, centralized billing, and express multi-branch UAE delivery.",
    "short_description": "Volume corporate stamp manufacturing with unified brand templates, centralized billing, and express multi-branch UAE delivery.",
    "price": 70,
    "min_quantity": 5,
    "minimumQuantity": 5,
    "minimum_quantity": 5,
    "unit": "pcs",
    "featured": true,
    "active": true,
    "images": [
      "/assets/products/stamps/self-inking-company-stamp.jpg"
    ],
    "image": "/assets/products/stamps/self-inking-company-stamp.jpg",
    "image_url": "/assets/products/stamps/self-inking-company-stamp.jpg",
    "category_id": 18,
    "category": stampCategory,
    "categories": [stampCategory],
    "specifications": {
      "materials": [
        { "label": "Trodat Printy Fleet Mix (Rectangular + Round)", "priceModifier": 0 },
        { "label": "Heavy Metal Core Accounts Fleet", "priceModifier": 35 },
        { "label": "Executive Pocket Stamp Fleet", "priceModifier": 20 }
      ],
      "sizes": [
        { "label": "Standard Multi-Department Bundle (Assorted Sizes)", "priceModifier": 0 },
        { "label": "Executive 10-Pack (5 Round Seals + 5 Rectangular)", "priceModifier": 0 },
        { "label": "Branch Office Starter Kit (Seal + Dater + TRN + Signature)", "priceModifier": 120 }
      ],
      "finishes": [
        { "label": "Standard Corporate Blue & Black Mix", "priceModifier": 0 },
        { "label": "Department Color-Coded Ink Suite", "priceModifier": 25 }
      ]
    },
    "seoTitle": "Bulk Corporate Stamp Orders Dubai | Wholesale Stamp Maker UAE | ONPRINT",
    "seoDescription": "Bulk company stamp orders in Dubai. Wholesale corporate stamps for multi-branch organizations, banks, and enterprises with volume discounts and express UAE delivery.",
    "seoKeywords": "bulk company stamps dubai, wholesale stamps uae, corporate stamp supplier dubai, bulk rubber stamp orders, enterprise stamp maker uae",
    "seoHeading": "Bulk Corporate Stamp Orders & Enterprise Fleet Supply",
    "canonicalUrl": "https://www.0nprint.com/products/bulk-corporate-stamp-orders",
    "imageAlt": "Bulk Corporate Stamp Orders printing Dubai",
    "seo_title": "Bulk Corporate Stamp Orders Dubai | Wholesale Stamp Maker UAE | ONPRINT",
    "seo_description": "Bulk company stamp orders in Dubai. Wholesale corporate stamps for multi-branch organizations, banks, and enterprises with volume discounts and express UAE delivery.",
    "seo_keywords": "bulk company stamps dubai, wholesale stamps uae, corporate stamp supplier dubai, bulk rubber stamp orders, enterprise stamp maker uae",
    "seo_heading": "Bulk Corporate Stamp Orders & Enterprise Fleet Supply",
    "canonical_url": "https://www.0nprint.com/products/bulk-corporate-stamp-orders",
    "image_alt": "Bulk Corporate Stamp Orders printing Dubai"
  }
];

const idx1804 = products.findIndex(p => p.id === 1804);
if (idx1804 !== -1) {
  products.splice(idx1804 + 1, 0, ...newStampProducts);
} else {
  products.push(...newStampProducts);
}

fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2), 'utf8');
console.log('Successfully added 6 new stamp products! Total products now:', products.length);
