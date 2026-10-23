const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../client/src/pages/public/ProductDetailPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add isStamp computation
const isStampCode = `
  const isStamp = Boolean(
    product &&
    (product.category?.slug === 'stamps-printing-dubai' ||
      product.category?.slug === 'custom-stamps-seals' ||
      (product.slug && (product.slug.includes('stamp') || product.slug.includes('seal') || product.slug.includes('dater'))))
  )
`;

if (!content.includes('const isStamp = Boolean')) {
  content = content.replace(
    'const breadcrumbsList = [',
    `${isStampCode}\r\n  const breadcrumbsList = [`
  );
}

// 2. Custom Stamp FAQs
const faqTarget = `  const productFaqs = [
    {
      question: \`What is the minimum order quantity for \${product.name}?\`,`;

const customFaqReplacement = `  const stampCustomFaqs = [
    {
      question: \`What documents are required to make \${product.name} in Dubai, UAE?\`,
      answer: \`In accordance with UAE regulations, official company stamps require a valid UAE Trade License copy (DED mainland or UAE Freezone) and an authorization letter signed by the authorized manager (or manager's Emirates ID copy). Personal name and doctor stamps do not require a trade license.\`,
    },
    {
      question: \`How fast can I get \${product.name} delivered in Dubai?\`,
      answer: \`We provide 2-Hour rush collection at our Al Quoz atelier and same-day delivery across Dubai for orders approved by 2:00 PM. Next-day tracked delivery is provided across Abu Dhabi, Sharjah, and all UAE Emirates.\`,
    },
    {
      question: \`What ink colors are available for \${product.name}?\`,
      answer: \`We offer official document-proof blue ink (certified to ISO 14145-2 anti-fraud standard, recommended by UAE banks), classic black, security red, forest green, and royal violet.\`,
    },
    {
      question: \`Do you verify artwork and Arabic/English spelling before manufacturing?\`,
      answer: \`Yes, every order includes a complimentary prepress inspection and a digital vector PDF proof sent via WhatsApp before laser engraving to guarantee correct typography and trade license compliance.\`,
    },
    {
      question: \`What is the lifespan of the internal ink pad for \${product.name}?\`,
      answer: \`Each Austrian Trodat or Colop casing provides 8,000 to 12,000 crisp impressions before needing an ink pad replacement, which snaps in cleanly without inking your fingers.\`,
    },
  ]

  const productFaqs = isStamp ? stampCustomFaqs : [
    {
      question: \`What is the minimum order quantity for \${product.name}?\`,`;

if (!content.includes('stampCustomFaqs')) {
  content = content.replace(faqTarget, customFaqReplacement);
}

// 3. Stamp Reassurance & Compliance Notice Box in configurator
const detailsH1Target = `<h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              {product.seoHeading || product.name}
            </h1>`;

const detailsH1Replacement = `<h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              {product.seoHeading || product.name}
            </h1>
            {isStamp && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Official Dubai Pressroom:</strong> 2-Hour Express Rush &bull; UAE Trade License Compliant &bull; Trodat &amp; Colop Austrian Casings
                </span>
              </div>
            )}`;

if (!content.includes('Official Dubai Pressroom:')) {
  content = content.replace(detailsH1Target, detailsH1Replacement);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully enhanced ProductDetailPage.jsx for Stamps!');
