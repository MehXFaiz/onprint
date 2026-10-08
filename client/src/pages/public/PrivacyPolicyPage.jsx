import Container from '../../components/Container'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'

const sections = [
  {
    title: '1. Introduction & Scope',
    body: 'ONPRINT Printing & Branding Solutions LLC ("ONPRINT", "we", "our", or "us") is dedicated to safeguarding the privacy, confidentiality, and security of all personal, corporate, and proprietary information collected through our website (https://0nprint.com), production facility in Al Quoz, Dubai, UAE, and associated digital communication channels including WhatsApp and email. This comprehensive Privacy Policy outlines how we collect, process, store, and protect your information when you browse our printing catalog, request quotations, upload artwork files, and place commercial print orders in the United Arab Emirates and internationally.',
  },
  {
    title: '2. Information We Collect',
    body: 'We collect information that is strictly necessary to provide high-precision printing and packaging services. This includes: (a) Personal Identification Information: Full name, job title, company name, corporate tax registration number (TRN), email address, phone number, and physical billing/delivery address across Dubai, Abu Dhabi, Sharjah, and other Emirates; (b) Production & Artwork Files: Vector files, PDFs, high-resolution raster images, font files, color profiles, and design briefs submitted for digital or offset reproduction; (c) Transactional & Order Information: Quotation details, custom product specifications, paper stock selections, finishing choices, invoice records, and proof approval timestamps; (d) Technical & Usage Data: IP address, browser type, device information, operating system, referral source, and browsing activity collected via standard server logs to optimize site performance and security.',
  },
  {
    title: '3. Legal Basis & Purpose of Processing',
    body: 'We process your data strictly in accordance with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL) and applicable international standards. Your information is utilized to: (1) Prepare accurate custom printing estimates and commercial quotations; (2) Process, print, bind, laminate, and package your custom merchandise; (3) Facilitate secure physical delivery via our in-house dispatch team and reputable courier partners across the UAE; (4) Provide customer support, pre-press proofing communications, and order tracking updates; (5) Maintain financial records in compliance with UAE Federal Tax Authority (FTA) accounting requirements; and (6) Prevent fraudulent activities and maintain the technical integrity of our digital platforms.',
  },
  {
    title: '4. File Ownership, Intellectual Property & Confidentiality',
    body: 'All trademarks, corporate logos, proprietary graphics, marketing collateral designs, and confidential documents uploaded or provided to ONPRINT remain the exclusive intellectual property of the respective client. We do not use, showcase, distribute, or license client artwork for public portfolio display without prior written consent. Production artwork files are stored on encrypted, access-controlled local and cloud servers and are retained solely for fulfillment, quality control, and convenient client re-ordering.',
  },
  {
    title: '5. Data Sharing & Third-Party Disclosures',
    body: 'ONPRINT does not sell, rent, trade, or monetize personal or commercial customer information to third parties under any circumstances. Information is only shared with trusted service providers strictly to fulfill operational obligations: (a) UAE Logistics & Delivery Partners: Courier services requiring shipping addresses and recipient phone numbers for order dispatch; (b) Payment Processing Gateways: PCI-DSS compliant financial institutions and payment processors for secure credit card transactions; (c) Legal & Regulatory Authorities: When mandatory under UAE federal law, judicial subpoena, or official regulatory investigation.',
  },
  {
    title: '6. Data Security & Storage Safeguards',
    body: 'We implement industry-standard administrative, physical, and technical safeguards to protect your personal and corporate data against unauthorized access, destruction, loss, alteration, or disclosure. Our digital infrastructure utilizes Transport Layer Security (TLS/SSL) encryption for all website communications, automated security firewalls, role-based database access permissions, and periodic vulnerability audits.',
  },
  {
    title: '7. Cookies & Tracking Technologies',
    body: 'Our website uses essential technical cookies required for website operation, shopping bag persistence, navigation security, and performance analysis. We use aggregated web analytics (such as Google Analytics) to understand visitor traffic patterns and improve user experience without identifying individual users. You may choose to disable or block cookies through your browser settings, though certain dynamic features of the website may function with limited efficiency.',
  },
  {
    title: '8. Data Retention Policies',
    body: 'We retain customer account details, quotation histories, and invoices for a minimum period of 5 years to fulfill legal, tax, and regulatory obligations under UAE commercial company laws. Production artwork files and digital proofs are archived securely for a standard period of 12 to 24 months to enable seamless repeat orders, after which files may be permanently purged unless an extended archival agreement is requested in writing.',
  },
  {
    title: '9. Your Data Rights & Choices',
    body: 'Under applicable UAE data protection regulations, you possess the right to: (a) Request confirmation of whether we process your personal data and obtain a copy of such data; (b) Request the correction or rectification of inaccurate or outdated information; (c) Request the deletion or erasure of your personal data when no longer needed for legal or contractual fulfillment; (d) Object to or restrict certain types of data processing; and (e) Opt out of non-essential promotional communications at any time.',
  },
  {
    title: '10. Contacting Our Data Privacy Officer',
    body: 'For any inquiries, data access requests, or questions regarding this Privacy Policy and our data handling practices, please contact our Data Protection Team by email at 0nprint183@gmail.com, via our official WhatsApp hotline (+44 7344 546056), or by visiting our commercial pressroom located in Al Quoz Industrial Area, Dubai, United Arab Emirates.',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Privacy Policy | ONPRINT Dubai — Data Protection & Privacy Practices"
        description="Comprehensive Privacy Policy and data protection standards for ONPRINT printing and packaging solutions in Al Quoz, Dubai, UAE. Compliant with UAE PDPL."
        keywords="privacy policy onprint, data protection printing dubai, uae pdpl compliance, onprint printing terms"
        canonicalPath="/privacy-policy"
        breadcrumbs={[{ name: 'Privacy Policy', url: '/privacy-policy' }]}
      />

      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ name: 'Privacy Policy' }]} />
        <div className="border-b border-border pb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-accent">Legal &amp; Compliance</p>
          <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Privacy Policy &amp; Data Protection
          </h1>
          <p className="mt-4 text-sm font-semibold text-secondary">
            Official Policy • Effective Date: January 1, 2026 • Al Quoz, Dubai, United Arab Emirates
          </p>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            This document sets forth the comprehensive privacy guidelines, data security protocols, and intellectual property confidentiality commitments observed by ONPRINT Printing &amp; Branding Solutions LLC.
          </p>
        </div>

        <div className="mt-10 divide-y divide-border">
          {sections.map((s) => (
            <article key={s.title} className="py-8">
              <h2 className="font-display text-lg sm:text-xl font-bold text-primary">{s.title}</h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-secondary text-justify">{s.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </div>
  )
}
