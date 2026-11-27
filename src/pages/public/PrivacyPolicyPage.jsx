import Container from '../../components/Container'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'

const sections = [
  {
    title: '1. Introduction & Scope',
    body: 'ONPRINT Printing & Branding Solutions LLC ("ONPRINT", "we", "our", or "us") is dedicated to safeguarding the privacy, confidentiality, and security of information you choose to share through our website (https://www.0nprint.com), production facility in Al Quoz, Dubai, UAE, and communication channels including WhatsApp and email. This Privacy Policy outlines how we handle information when you browse our printing catalog, prepare quotation requests, or choose to send artwork directly through WhatsApp.',
  },
  {
    title: '2. Information We Collect',
    body: 'This frontend-only website does not provide user accounts, order submission, or server-side quote storage. Information entered into quote and contact forms remains in the current browser session and is used to prepare a message for WhatsApp. The message is not sent until you review and send it in WhatsApp. Selecting an artwork file does not upload it; you must attach it yourself in WhatsApp if you choose. Google Analytics may collect website usage and interaction data according to its settings and your browser choices.',
  },
  {
    title: '3. Legal Basis & Purpose of Processing',
    body: 'Form information is used in your browser to prepare a quote or inquiry message for you to review. When you choose to send that message, WhatsApp and ONPRINT handle the information you share under their respective terms and privacy practices. Do not include information you are not comfortable sharing through WhatsApp.',
  },
  {
    title: '4. File Ownership, Intellectual Property & Confidentiality',
    body: 'Artwork selected on this website is not uploaded or stored by the website. If you choose to attach artwork to a WhatsApp message, it is shared directly through WhatsApp and is handled under WhatsApp’s terms and privacy practices. Client-provided artwork remains the client’s responsibility and should only be shared when you have the right to do so.',
  },
  {
    title: '5. Data Sharing & Third-Party Disclosures',
    body: 'This website may load Google Analytics for site usage measurement. If you choose to continue a prepared inquiry, information and any files you attach are sent through WhatsApp, a third-party service. This website does not include payment processing or courier-order integrations.',
  },
  {
    title: '6. Data Security & Storage Safeguards',
    body: 'The website does not maintain a backend database of quote-form entries or uploaded artwork. Information you send through WhatsApp or analytics providers is subject to those providers’ security practices and policies. Use secure connections and avoid including confidential information in an inquiry.',
  },
  {
    title: '7. Cookies & Tracking Technologies',
    body: 'Google Analytics may use cookies or similar technologies to measure visits and interactions. You can manage cookies through your browser settings. Disabling them may affect analytics measurement but does not prevent browsing the public site.',
  },
  {
    title: '8. Data Retention Policies',
    body: 'Form values and selected files are kept in browser memory only while you use the form; this website does not save them to an ONPRINT database. Messages and attachments you send through WhatsApp, and usage data held by analytics providers, are retained according to those providers’ policies.',
  },
  {
    title: '9. Your Data Rights & Choices',
    body: 'You may choose not to submit information through the site or not to send a prepared WhatsApp message. For information you have sent through WhatsApp or Google Analytics, use the relevant provider’s privacy tools or contact that provider. Contact ONPRINT using the details below for questions about information you have shared directly with the business.',
  },
  {
    title: '10. Contacting Our Data Privacy Officer',
    body: 'For any inquiries, data access requests, or questions regarding this Privacy Policy and our data handling practices, please contact our Data Protection Team by email at 0nprint183@gmail.com, via our official WhatsApp hotline (+44 7344546056), or by visiting our commercial pressroom located in Al Quoz Industrial Area, Dubai, United Arab Emirates.',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 sm:py-24">
      <SEOHead
        title="Privacy Policy | ONPRINT Dubai — Data Protection & Privacy Practices"
        description="Comprehensive Privacy Policy and data protection standards for ONPRINT commercial printing solutions in Al Quoz, Dubai, UAE. Compliant with UAE PDPL."
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
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-secondary text-left sm:text-justify break-words">{s.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </div>
  )
}
