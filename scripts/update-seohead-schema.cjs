const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'client', 'src', 'components', 'SEOHead.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const target1 = `  logo: \`\${SITE_URL}/logo_icon.png\`,
  image: \`\${SITE_URL}/logo_icon.png\`,`;

const replacement1 = `  logo: {
    '@type': 'ImageObject',
    url: \`\${SITE_URL}/logo_icon.png\`,
    contentUrl: \`\${SITE_URL}/logo_icon.png\`,
    width: '512',
    height: '512',
    caption: 'ONPRINT Printing Press Dubai Logo',
  },
  image: {
    '@type': 'ImageObject',
    url: \`\${SITE_URL}/logo_icon.png\`,
    contentUrl: \`\${SITE_URL}/logo_icon.png\`,
    caption: 'ONPRINT Dubai Facility and Operations',
  },`;

const target2 = `    // 6. Base Organization & WebSite Schemas
    setStructuredDataScript('onprint-schema-organization', organizationSchema)
    setStructuredDataScript('onprint-schema-website', websiteSchema)`;

const replacement2 = `    // 6. Base Organization, WebSite & WebPage Schemas
    setStructuredDataScript('onprint-schema-organization', organizationSchema)
    setStructuredDataScript('onprint-schema-website', websiteSchema)

    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': \`\${effectiveCanonical}#webpage\`,
      url: effectiveCanonical,
      name: fullTitle,
      description: metaDesc,
      isPartOf: { '@id': \`\${SITE_URL}/#website\` },
      about: { '@id': \`\${SITE_URL}/#organization\` },
      inLanguage: isArabic ? 'ar-AE' : 'en-AE',
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: ogImg,
        contentUrl: ogImg,
      },
    }
    setStructuredDataScript('onprint-schema-webpage', webPageSchema)`;

if (content.includes(target1)) {
  content = content.replace(target1, replacement1);
} else {
  // Normalize CRLF
  content = content.replace(/\r\n/g, '\n');
  content = content.replace(target1.replace(/\r\n/g, '\n'), replacement1);
}

if (content.includes(target2)) {
  content = content.replace(target2, replacement2);
} else {
  content = content.replace(/\r\n/g, '\n');
  content = content.replace(target2.replace(/\r\n/g, '\n'), replacement2);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated SEOHead.jsx with ImageObject and WebPage schema!');
