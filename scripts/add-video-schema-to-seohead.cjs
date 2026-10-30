const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'client', 'src', 'components', 'SEOHead.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add video prop
const propTarget = `  blogArticle,
  reviews,
})`;

const propReplacement = `  blogArticle,
  reviews,
  video,
})`;

// 2. Add VideoObject schema injection
const scriptTarget = `    // 14. Custom Structured Data from Props
    if (structuredData) {
      setStructuredDataScript('onprint-schema-custom', structuredData)
    } else {
      setStructuredDataScript('onprint-schema-custom', null)
    }`;

const scriptReplacement = `    // 14. Custom Structured Data from Props
    if (structuredData) {
      setStructuredDataScript('onprint-schema-custom', structuredData)
    } else {
      setStructuredDataScript('onprint-schema-custom', null)
    }

    // 15. VideoObject Schema (Image & Video SEO)
    if (video) {
      const videoSchema = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.name || fullTitle,
        description: video.description || metaDesc,
        thumbnailUrl: normalizeImageUrl(video.thumbnailUrl || effectiveImage),
        uploadDate: video.uploadDate || '2026-10-01T09:00:00+04:00',
        contentUrl: video.contentUrl || video.url,
        embedUrl: video.embedUrl || video.contentUrl || video.url,
        publisher: {
          '@id': \`\${SITE_URL}/#organization\`,
        },
      }
      setStructuredDataScript('onprint-schema-video', videoSchema)
    } else {
      setStructuredDataScript('onprint-schema-video', null)
    }`;

// 3. Add video to useEffect dependency array
const depTarget = `    reviews,
    structuredData,
  ])`;

const depReplacement = `    reviews,
    structuredData,
    video,
  ])`;

content = content.replace(/\r\n/g, '\n');

if (content.includes(propTarget.replace(/\r\n/g, '\n'))) {
  content = content.replace(propTarget.replace(/\r\n/g, '\n'), propReplacement);
}
if (content.includes(scriptTarget.replace(/\r\n/g, '\n'))) {
  content = content.replace(scriptTarget.replace(/\r\n/g, '\n'), scriptReplacement);
}
if (content.includes(depTarget.replace(/\r\n/g, '\n'))) {
  content = content.replace(depTarget.replace(/\r\n/g, '\n'), depReplacement);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added VideoObject schema support to SEOHead.jsx');
