import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const port = Number(process.env.PORT) || 3000
const host = process.env.HOST || '0.0.0.0'

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
}

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath)
  const safePath = normalize(decoded).replace(/^([.]{2}[/\\])+/, '')
  const filePath = join(root, safePath)
  if (filePath !== root && !filePath.startsWith(root + sep)) return null

  try {
    const info = await stat(filePath)
    if (info.isFile()) return { filePath, size: info.size, modified: info.mtime }
    if (info.isDirectory()) {
      const indexPath = join(filePath, 'index.html')
      const indexInfo = await stat(indexPath)
      if (indexInfo.isFile()) {
        return { filePath: indexPath, size: indexInfo.size, modified: indexInfo.mtime }
      }
    }
  } catch {
    // fall through to the SPA fallback below
  }

  // Client-side routes such as /business-cards are served by the app shell.
  if (extname(decoded) === '' || extname(decoded) === '.html') {
    try {
      const indexPath = join(root, 'index.html')
      const indexInfo = await stat(indexPath)
      if (indexInfo.isFile()) {
        return { filePath: indexPath, size: indexInfo.size, modified: indexInfo.mtime }
      }
    } catch {
      // no build output available
    }
  }

  return null
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' })
    response.end('Method Not Allowed')
    return
  }

  let pathname
  try {
    pathname = new URL(request.url, 'http://localhost').pathname
  } catch {
    response.writeHead(400)
    response.end('Bad Request')
    return
  }

  if (pathname === '/') pathname = '/index.html'

  let entry = null
  try {
    entry = await resolveFile(pathname)
  } catch {
    entry = null
  }

  if (!entry) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
    response.end('Not Found')
    return
  }

  const extension = extname(entry.filePath).toLowerCase()
  const isHashedAsset = entry.filePath.includes(`${sep}assets${sep}`)
  response.writeHead(200, {
    'Content-Type': contentTypes[extension] || 'application/octet-stream',
    'Content-Length': entry.size,
    'Cache-Control': isHashedAsset
      ? 'public, max-age=31536000, immutable'
      : 'no-cache, no-store, must-revalidate',
  })

  if (request.method === 'HEAD') {
    response.end()
    return
  }

  createReadStream(entry.filePath)
    .on('error', () => response.destroy())
    .pipe(response)
})

server.listen(port, host, () => {
  console.log(`ONPRINT static server listening on http://${host}:${port} (serving ${root})`)
})
