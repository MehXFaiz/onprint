import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function unwrapCssLayers(css) {
  let out = css.replace(/@layer\s+[a-zA-Z0-9_.,\s-]+;/g, '')
  while (true) {
    const match = out.match(/@layer\s+[a-zA-Z0-9_.\s-]+\{/)
    if (!match) break
    const startIdx = match.index
    const openBraceIdx = startIdx + match[0].length - 1
    let depth = 1
    let i = openBraceIdx + 1
    while (i < out.length && depth > 0) {
      const ch = out[i]
      if (ch === '{') depth++
      else if (ch === '}') depth--
      i++
    }
    if (depth === 0) {
      const inner = out.slice(openBraceIdx + 1, i - 1)
      out = out.slice(0, startIdx) + inner + out.slice(i)
    } else {
      break
    }
  }
  return out
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'unwrap-css-layers',
        enforce: 'post',
        generateBundle(_options, bundle) {
          for (const fileName of Object.keys(bundle)) {
            const chunk = bundle[fileName]
            if (chunk.type === 'asset' && fileName.endsWith('.css') && typeof chunk.source === 'string') {
              chunk.source = unwrapCssLayers(chunk.source)
            }
          }
        },
      },
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      cssTarget: ['chrome87', 'safari14', 'ios14'],
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('/react/')) {
                return 'vendor-react'
              }
              if (id.includes('framer-motion') || id.includes('/motion/')) {
                return 'vendor-motion'
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons'
              }
            }
            if (id.includes('catalogProducts.json') || id.includes('businessCardsLandingData') || id.includes('commercialLandingPagesData')) {
              return 'data-catalog'
            }
            if (id.includes('defaultBlogGuides')) {
              return 'data-blog'
            }
          },
        },
      },
    },
})
