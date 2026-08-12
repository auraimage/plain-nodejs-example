import { createServer } from 'node:http'
import { AuraImage } from '@auraimage/sdk'

const PORT = Number(process.env.PORT) || 3003
const CDN_URL = process.env.CDN_URL || 'https://cdn.auraimage.ai'

const aura = new AuraImage({
  secretKey: process.env.AURAIMAGE_SECRET_KEY,
  projectName: process.env.AURAIMAGE_PROJECT_NAME
})

const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4200']

function json(res, data, status = 200) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  })
  res.end(body)
}

const server = createServer(async (req, res) => {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)

  if (req.method === 'GET' && url.pathname === '/api/health') {
    json(res, { status: 'ok' })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/upload-token') {
    try {
      const token = await aura.signUpload()
      json(res, { token, cdnUrl: CDN_URL })
    } catch (err) {
      console.error(err)
      json(res, { error: 'Failed to sign upload token' }, 500)
    }
    return
  }

  json(res, { error: 'Not found' }, 404)
})

server.listen(PORT, () => {
  console.log(`AuraImage plain Node.js example running at http://localhost:${PORT}`)
})
