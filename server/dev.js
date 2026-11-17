import { createServer } from 'node:http'
import handler from '../api/[...path].js'

const server = createServer(async (req, res) => {
  const chunks = []
  let bytes = 0
  for await (const chunk of req) {
    bytes += chunk.length
    if (bytes > 16_384) {
      res.writeHead(413, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Request body is too large.' }))
      return
    }
    chunks.push(chunk)
  }
  if (chunks.length) {
    try {
      req.body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Request body must be valid JSON.' }))
      return
    }
  }
  res.status = (status) => {
    res.statusCode = status
    return res
  }
  res.json = (value) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(value))
  }
  await handler(req, res)
})

const port = Number(process.env.API_PORT || 3001)
server.listen(port, '127.0.0.1', () => {
  console.log(`AgriConnect API listening at http://127.0.0.1:${port}`)
})
