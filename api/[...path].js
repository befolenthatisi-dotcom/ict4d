import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { MongoClient, ObjectId } from 'mongodb'

const scrypt = promisify(scryptCallback)
const sessionCookie = 'agriconnect_session'
const sessionDuration = 8 * 60 * 60 * 1000
const marketPriceSourceUrl = 'https://data.humdata.org/dataset/e6734ad4-45fa-4db2-a9c0-52eff69f5a08/resource/a32cc3c1-9892-4897-bdc1-f14505a31e8e/download/wfp_food_prices_lso.csv'
const marketPricePageUrl = 'https://data.humdata.org/dataset/wfp-food-prices-for-lesotho'
const marketPriceCacheTtl = 6 * 60 * 60 * 1000
const marketPriceMaxAge = 90 * 24 * 60 * 60 * 1000
const districts = {
  'Maseru': [-29.3167, 27.4833],
  'Berea': [-29.2000, 27.7500],
  'Leribe': [-28.8719, 28.0416],
  'Butha-Buthe': [-28.7666, 28.2500],
  'Mokhotlong': [-29.2894, 29.0653],
  'Thaba-Tseka': [-29.5220, 28.6084],
  'Mafeteng': [-29.8220, 27.2380],
  'Mohale’s Hoek': [-30.1510, 27.4760],
  'Quthing': [-30.4000, 27.7000],
  'Qacha’s Nek': [-30.1167, 28.6833],
}

let clientPromise
let indexesPromise
let dummyPasswordHashPromise
let marketPriceCache
let marketPricePromise

function database() {
  if (!process.env.MONGODB_URI) throw Object.assign(new Error('The database is not configured yet.'), { status: 503 })
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined
      throw error
    })
  }
  return clientPromise.then((client) => client.db(process.env.MONGODB_DATABASE || 'agriconnect'))
}

function response(res, status, data, extraHeaders = {}) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  for (const [name, value] of Object.entries(extraHeaders)) res.setHeader(name, value)
  res.status(status).json(data)
}

function parseBody(req) {
  if (typeof req.body === 'object' && req.body !== null) return req.body
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body) } catch { throw Object.assign(new Error('Request body must be valid JSON.'), { status: 400 }) }
  }
  return {}
}

function validateText(value, label, maxLength = 100) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > maxLength) {
    throw Object.assign(new Error(`${label} is required and must be ${maxLength} characters or fewer.`), { status: 400 })
  }
  return value.trim()
}

function validateEmail(value) {
  const email = validateText(value, 'Email', 254).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Object.assign(new Error('Enter a valid email address.'), { status: 400 })
  return email
}

function validateFarmerEmail(value) {
  const email = validateEmail(value)
  if (!email.endsWith('@gmail.com')) {
    throw Object.assign(new Error('Farmers must use a Gmail address ending in @gmail.com.'), { status: 400 })
  }
  return email
}

function parseCsvDocument(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        field += character
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true
    } else if (character === ',') {
      row.push(field)
      field = ''
    } else if (character === '\n') {
      row.push(field)
      if (row.some((value) => value.length > 0)) rows.push(row)
      row = []
      field = ''
    } else if (character !== '\r') {
      field += character
    }
  }

  if (quoted) throw Object.assign(new Error('The market price data source returned an invalid CSV file.'), { status: 502 })
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    if (row.some((value) => value.length > 0)) rows.push(row)
  }
  if (rows.length < 2) throw Object.assign(new Error('The market price data source returned an empty CSV file.'), { status: 502 })

  const headers = rows[0].map((header, index) => index === 0 ? header.replace(/^\uFEFF/, '') : header)
  const requiredHeaders = ['date', 'market', 'commodity', 'unit', 'priceflag', 'pricetype', 'currency', 'price']
  if (requiredHeaders.some((header) => !headers.includes(header))) {
    throw Object.assign(new Error('The market price data source is missing required columns.'), { status: 502 })
  }

  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])))
}

async function getMarketPriceData() {
  if (marketPriceCache && Date.now() - marketPriceCache.fetchedAt < marketPriceCacheTtl) return marketPriceCache.data
  if (marketPricePromise) return marketPricePromise

  marketPricePromise = (async () => {
    let sourceResponse
    try {
      sourceResponse = await fetch(marketPriceSourceUrl, { signal: AbortSignal.timeout(15000) })
    } catch (error) {
      throw Object.assign(new Error('The verified market price source could not be reached.'), { status: 502, cause: error })
    }
    if (!sourceResponse.ok) throw Object.assign(new Error('The verified market price source is temporarily unavailable.'), { status: 502 })

    const csvRows = parseCsvDocument(await sourceResponse.text())
    const now = Date.now()
    const latestByItemAndMarket = new Map()
    for (const row of csvRows) {
      const observedAt = Date.parse(`${row.date}T00:00:00Z`)
      const price = Number(row.price)
      if (
        !row.market ||
        !row.commodity ||
        !row.unit ||
        row.priceflag.toLowerCase() !== 'actual' ||
        row.pricetype.toLowerCase() !== 'retail' ||
        row.currency.toUpperCase() !== 'LSL' ||
        !Number.isFinite(observedAt) ||
        observedAt > now ||
        now - observedAt > marketPriceMaxAge ||
        !Number.isFinite(price) ||
        price < 0
      ) continue

      const key = `${row.market}\u0000${row.commodity}\u0000${row.unit}`
      const existing = latestByItemAndMarket.get(key)
      if (!existing || observedAt > existing.observedAt) {
        latestByItemAndMarket.set(key, {
          market: row.market,
          commodity: row.commodity,
          price,
          currency: row.currency.toUpperCase(),
          unit: row.unit,
          date: row.date,
          observedAt,
        })
      }
    }

    const observations = [...latestByItemAndMarket.values()]
      .sort((left, right) => right.observedAt - left.observedAt || left.market.localeCompare(right.market) || left.commodity.localeCompare(right.commodity))
      .map(({ observedAt, ...observation }) => observation)
    const data = {
      observations,
      markets: [...new Set(observations.map((observation) => observation.market))].sort((left, right) => left.localeCompare(right)),
      latestObservedDate: observations[0]?.date || null,
      source: 'WFP Price Database, via Lesotho Bureau of Statistics and FAO GIEWS',
      sourceUrl: marketPricePageUrl,
      license: 'CC BY-IGO 3.0',
      freshnessWindowDays: 90,
    }
    marketPriceCache = { data, fetchedAt: Date.now() }
    return data
  })().finally(() => {
    marketPricePromise = undefined
  })

  return marketPricePromise
}

async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
    throw Object.assign(new Error('Password must be between 12 and 128 characters.'), { status: 400 })
  }
  const salt = randomBytes(16)
  const hash = await scrypt(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 })
  return `scrypt$32768$8$1$${salt.toString('base64url')}$${hash.toString('base64url')}`
}

async function verifyPassword(password, encoded) {
  if (typeof password !== 'string' || password.length > 128 || typeof encoded !== 'string') return false
  const parts = encoded.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt' || parts[1] !== '32768' || parts[2] !== '8' || parts[3] !== '1') return false
  const expected = Buffer.from(parts[5], 'base64url')
  if (expected.length !== 64) return false
  const actual = await scrypt(password, Buffer.from(parts[4], 'base64url'), 64, { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 })
  return timingSafeEqual(expected, actual)
}

function dummyPasswordHash() {
  if (!dummyPasswordHashPromise) dummyPasswordHashPromise = hashPassword('not-a-real-user-password')
  return dummyPasswordHashPromise
}

function signingKey() {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw Object.assign(new Error('Authentication is not configured yet.'), { status: 503 })
  }
  return process.env.SESSION_SECRET
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function createToken(user) {
  const now = Math.floor(Date.now() / 1000)
  const payload = encode({ sub: user._id.toString(), iat: now, exp: now + sessionDuration / 1000 })
  const unsigned = `${encode({ alg: 'HS256', typ: 'JWT' })}.${payload}`
  return `${unsigned}.${createHmac('sha256', signingKey()).update(unsigned).digest('base64url')}`
}

async function authenticatedUser(req, db) {
  const cookie = (req.headers.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith(`${sessionCookie}=`))
  if (!cookie) return null
  try {
    const token = decodeURIComponent(cookie.slice(sessionCookie.length + 1))
    const [header, payload, signature] = token.split('.')
    if (!header || !payload || !signature) return null
    const expected = createHmac('sha256', signingKey()).update(`${header}.${payload}`).digest()
    const actual = Buffer.from(signature, 'base64url')
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (typeof claims.exp !== 'number' || claims.exp <= Date.now() / 1000) return null
    const user = await db.collection('users').findOne({ _id: new ObjectId(claims.sub), disabled: { $ne: true } })
    return user ? { _id: user._id, email: user.email, name: user.name, farm: user.farm, district: user.district, role: user.role } : null
  } catch {
    return null
  }
}

function setSessionCookie(res, token) {
  const secure = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
  res.setHeader('Set-Cookie', `${sessionCookie}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionDuration / 1000}${secure ? '; Secure' : ''}`)
}

function clearSessionCookie(res) {
  const secure = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
  res.setHeader('Set-Cookie', `${sessionCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`)
}

async function enforceRateLimit(db, req, bucket, limit, windowMs) {
  const forwarded = req.headers['x-forwarded-for']
  const address = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : 'unknown'
  const key = `${bucket}:${address.slice(0, 80)}`
  const now = new Date()
  const reset = new Date(now.getTime() + windowMs)
  const result = await db.collection('rate_limits').findOneAndUpdate(
    { _id: key },
    [{ $set: { count: { $cond: [{ $gt: ['$resetAt', now] }, { $add: [{ $ifNull: ['$count', 0] }, 1] }, 1] }, resetAt: { $cond: [{ $gt: ['$resetAt', now] }, '$resetAt', reset] } } }],
    { upsert: true, returnDocument: 'after' },
  )
  if (result.count > limit) throw Object.assign(new Error('Too many requests. Please try again later.'), { status: 429 })
}

function publicUser(user) {
  return { id: user._id.toString(), email: user.email, name: user.name, farm: user.farm, district: user.district, role: user.role }
}

function requireRole(user, role) {
  if (!user) throw Object.assign(new Error('Sign in to continue.'), { status: 401 })
  if (role && user.role !== role) throw Object.assign(new Error('This action requires a cooperative administrator account.'), { status: 403 })
}

async function openMeteo(district) {
  const coordinates = districts[district]
  if (!coordinates) throw Object.assign(new Error('Select a valid Lesotho district.'), { status: 400 })
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.search = new URLSearchParams({
    latitude: String(coordinates[0]),
    longitude: String(coordinates[1]),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,cloud_cover',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,precipitation_sum,wind_gusts_10m_max',
    timezone: 'Africa/Maseru',
    forecast_days: '7',
  }).toString()
  const result = await fetch(url, { signal: AbortSignal.timeout(9000) })
  if (!result.ok) throw Object.assign(new Error('The live weather service is temporarily unavailable.'), { status: 502 })
  return result.json()
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
    const path = url.pathname.replace(/\/+$/, '') || '/'
    const method = req.method || 'GET'
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && req.headers.origin) {
      const host = req.headers['x-forwarded-host'] || req.headers.host
      const protocol = req.headers['x-forwarded-proto'] || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
      if (!host || req.headers.origin !== `${protocol}://${host}`) {
        throw Object.assign(new Error('Cross-site requests are not allowed.'), { status: 403 })
      }
    }

    if (path === '/api/health' && method === 'GET') {
      const databaseConfigured = Boolean(process.env.MONGODB_URI)
      let databaseConnected = false
      if (databaseConfigured) {
        try {
          const db = await database()
          await db.command({ ping: 1 })
          databaseConnected = true
        } catch (error) {
          console.error('AgriConnect database health check failed:', error)
        }
      }
      return response(res, 200, { status: 'ok', databaseConfigured, databaseConnected, authenticationConfigured: Boolean(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32), adminSetupConfigured: Boolean(process.env.ADMIN_BOOTSTRAP_KEY && process.env.ADMIN_BOOTSTRAP_KEY.length >= 32), weatherProvider: 'Open-Meteo' })
    }

    if (path === '/api/weather' && method === 'GET') {
      const district = url.searchParams.get('district') || 'Maseru'
      const weather = await openMeteo(district)
      res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300')
      return response(res, 200, { source: 'Open-Meteo', district, timezone: weather.timezone, current: weather.current, daily: weather.daily })
    }

    if (path === '/api/market-prices' && method === 'GET') {
      const data = await getMarketPriceData()
      return response(res, 200, data, { 'Cache-Control': 'public, max-age=900' })
    }

    const db = await database()
    const users = db.collection('users')
    if (!indexesPromise) {
      indexesPromise = Promise.all([
        users.createIndex({ email: 1 }, { unique: true }),
        db.collection('rate_limits').createIndex({ resetAt: 1 }, { expireAfterSeconds: 86400 }),
        db.collection('story_images').createIndex({ storyId: 1 }),
        db.collection('stories').createIndex({ createdAt: -1 }),
        db.collection('crops').createIndex({ name: 1 }, { unique: true }),
      ]).catch((error) => { indexesPromise = undefined; throw error })
    }
    await indexesPromise

    if (path === '/api/auth/register' && method === 'POST') {
      await enforceRateLimit(db, req, 'register', 5, 60 * 60 * 1000)
      const body = parseBody(req)
      const email = validateFarmerEmail(body.email)
      const passwordHash = await hashPassword(body.password)
      const name = validateText(body.name, 'Name')
      const farm = validateText(body.farm, 'Farm name')
      const district = validateText(body.district, 'District', 40)
      if (!Object.hasOwn(districts, district)) throw Object.assign(new Error('Select a valid Lesotho district.'), { status: 400 })
      const user = { email, passwordHash, name, farm, district, role: 'farmer', disabled: false, createdAt: new Date(), updatedAt: new Date() }
      try {
        const inserted = await users.insertOne(user)
        user._id = inserted.insertedId
      } catch (error) {
        if (error.code === 11000) throw Object.assign(new Error('An account with that email already exists.'), { status: 409 })
        throw error
      }
      setSessionCookie(res, createToken(user))
      return response(res, 201, { user: publicUser(user) })
    }

    if (path === '/api/auth/login' && method === 'POST') {
      await enforceRateLimit(db, req, 'login', 10, 15 * 60 * 1000)
      const body = parseBody(req)
      const audience = body.audience === 'admin' ? 'admin' : 'farmer'
      const email = audience === 'farmer' ? validateFarmerEmail(body.email) : validateEmail(body.email)
      const user = await users.findOne({ email })
      const valid = await verifyPassword(body.password, user?.passwordHash || await dummyPasswordHash())
      if (!user || !valid || user.disabled || user.role !== audience) throw Object.assign(new Error('Email or password is incorrect.'), { status: 401 })
      setSessionCookie(res, createToken(user))
      return response(res, 200, { user: publicUser(user) })
    }

    if (path === '/api/auth/logout' && method === 'POST') {
      clearSessionCookie(res)
      return response(res, 200, { ok: true })
    }

    if (path === '/api/auth/admin/bootstrap' && method === 'POST') {
      await enforceRateLimit(db, req, 'admin-bootstrap', 5, 60 * 60 * 1000)
      const configuredKey = process.env.ADMIN_BOOTSTRAP_KEY
      const suppliedKey = parseBody(req).bootstrapKey
      if (!configuredKey || typeof suppliedKey !== 'string' || configuredKey.length < 32) {
        throw Object.assign(new Error('Administrator setup is not configured.'), { status: 503 })
      }
      const expected = Buffer.from(configuredKey)
      const actual = Buffer.from(suppliedKey)
      if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw Object.assign(new Error('Administrator setup key is incorrect.'), { status: 403 })
      const body = parseBody(req)
      const email = validateEmail(body.email)
      const passwordHash = await hashPassword(body.password)
      const name = validateText(body.name, 'Name')
      const user = { email, passwordHash, name, farm: validateText(body.farm || 'Cooperative administration', 'Farm name'), district: Object.hasOwn(districts, body.district) ? body.district : 'Maseru', role: 'admin', disabled: false, createdAt: new Date(), updatedAt: new Date() }
      const setup = db.collection('setup')
      await setup.updateOne({ _id: 'initial-admin' }, { $setOnInsert: { state: 'ready' } }, { upsert: true })
      const lock = await setup.findOneAndUpdate({ _id: 'initial-admin', state: 'ready' }, { $set: { state: 'creating', startedAt: new Date() } }, { returnDocument: 'after' })
      if (!lock) throw Object.assign(new Error('Initial administrator setup has already been used or is in progress.'), { status: 409 })
      if (await users.countDocuments({ role: 'admin' }) > 0) {
        await setup.updateOne({ _id: 'initial-admin' }, { $set: { state: 'complete' } })
        throw Object.assign(new Error('An administrator account already exists.'), { status: 409 })
      }
      try {
        const inserted = await users.insertOne(user)
        user._id = inserted.insertedId
      } catch (error) {
        await setup.updateOne({ _id: 'initial-admin', state: 'creating' }, { $set: { state: 'ready' } })
        if (error.code === 11000) throw Object.assign(new Error('An account with that email already exists.'), { status: 409 })
        throw error
      }
      await setup.updateOne({ _id: 'initial-admin' }, { $set: { state: 'complete', completedAt: new Date() } })
      setSessionCookie(res, createToken(user))
      return response(res, 201, { user: publicUser(user) })
    }

    const user = await authenticatedUser(req, db)
    if (path === '/api/auth/me' && method === 'GET') {
      if (!user) return response(res, 200, { user: null })
      return response(res, 200, { user })
    }

    if (path === '/api/profile' && method === 'GET') {
      requireRole(user)
      return response(res, 200, { profile: user })
    }
    if (path === '/api/profile' && method === 'PATCH') {
      requireRole(user)
      const body = parseBody(req)
      const fields = {
        name: validateText(body.name, 'Name'),
        farm: validateText(body.farm, 'Farm name'),
        district: validateText(body.district, 'District', 40),
        phone: typeof body.phone === 'string' ? body.phone.trim().slice(0, 30) : '',
      }
      if (!Object.hasOwn(districts, fields.district)) throw Object.assign(new Error('Select a valid Lesotho district.'), { status: 400 })
      await users.updateOne({ _id: new ObjectId(user._id) }, { $set: { ...fields, updatedAt: new Date() } })
      return response(res, 200, { profile: { ...user, ...fields } })
    }

    if (path === '/api/cooperative/members' && method === 'GET') {
      requireRole(user)
      const members = await users.find({ role: 'farmer', disabled: { $ne: true }, cooperativeMember: true }, { projection: { name: 1, farm: 1, district: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(200).toArray()
      return response(res, 200, { members: members.map((member) => ({ id: member._id.toString(), name: member.name, farm: member.farm, district: member.district })) })
    }
    if (path === '/api/cooperative/members' && method === 'POST') {
      requireRole(user)
      await users.updateOne({ _id: new ObjectId(user._id), role: 'farmer' }, { $set: { cooperativeMember: true, updatedAt: new Date() } })
      return response(res, 200, { ok: true, member: { id: user._id.toString(), name: user.name, farm: user.farm, district: user.district } })
    }
    if (path === '/api/cooperative/produce' && method === 'GET') {
      requireRole(user)
      const products = await db.collection('produce').find({ status: 'available' }).sort({ createdAt: -1 }).limit(300).toArray()
      return response(res, 200, { products: products.map(({ _id, ownerId, createdAt, ...product }) => ({ id: _id.toString(), ownerId: ownerId.toString(), ...product })) })
    }
    if (path === '/api/cooperative/produce' && method === 'POST') {
      requireRole(user)
      const body = parseBody(req)
      const type = validateText(body.type, 'Produce type', 20)
      if (type !== 'Vegetables') throw Object.assign(new Error('Select a valid produce type.'), { status: 400 })
      const quantity = Number(body.quantity)
      if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 10000000) throw Object.assign(new Error('Enter a valid produce quantity.'), { status: 400 })
      const unit = validateText(body.unit, 'Unit', 20)
      if (!['kg', 'crates', 'bales'].includes(unit)) throw Object.assign(new Error('Select a valid produce unit.'), { status: 400 })
      const product = { ownerId: new ObjectId(user._id), type, quantity, unit, district: user.district, farmer: user.name, farm: user.farm, status: 'available', createdAt: new Date() }
      const inserted = await db.collection('produce').insertOne(product)
      return response(res, 201, { product: { id: inserted.insertedId.toString(), type, quantity, unit, district: product.district, farmer: product.farmer, farm: product.farm } })
    }
    const productId = path.match(/^\/api\/cooperative\/produce\/([a-f\d]{24})$/i)
    if (productId && method === 'DELETE') {
      requireRole(user)
      const result = await db.collection('produce').deleteOne({ _id: new ObjectId(productId[1]), ownerId: new ObjectId(user._id) })
      if (!result.deletedCount) throw Object.assign(new Error('Produce listing not found.'), { status: 404 })
      return response(res, 200, { ok: true })
    }

    if (path === '/api/cooperative/announcements' && method === 'GET') {
      requireRole(user)
      const announcements = await db.collection('announcements').find({}).sort({ createdAt: -1 }).limit(100).toArray()
      return response(res, 200, { announcements: announcements.map(({ _id, createdAt, ...item }) => ({ id: _id.toString(), ...item })) })
    }
    if (path === '/api/cooperative/announcements' && method === 'POST') {
      requireRole(user, 'admin')
      const body = parseBody(req)
      const announcement = { title: validateText(body.title, 'Announcement title'), detail: validateText(body.detail, 'Announcement details', 500), author: user.name, createdAt: new Date() }
      const inserted = await db.collection('announcements').insertOne(announcement)
      return response(res, 201, { announcement: { id: inserted.insertedId.toString(), ...announcement } })
    }
    if (path === '/api/market-alerts' && method === 'GET') {
      requireRole(user)
      const preferences = await users.findOne({ _id: new ObjectId(user._id) }, { projection: { marketAlerts: 1 } })
      return response(res, 200, { enabled: Boolean(preferences?.marketAlerts) })
    }
    if (path === '/api/market-alerts' && method === 'PUT') {
      requireRole(user)
      const enabled = parseBody(req).enabled
      if (typeof enabled !== 'boolean') throw Object.assign(new Error('Choose whether market alerts are enabled.'), { status: 400 })
      await users.updateOne({ _id: new ObjectId(user._id) }, { $set: { marketAlerts: enabled, updatedAt: new Date() } })
      return response(res, 200, { enabled })
    }
    if (path === '/api/admin/users' && method === 'GET') {
      requireRole(user, 'admin')
      const records = await users.find({}, { projection: { passwordHash: 0 } }).sort({ createdAt: -1 }).limit(500).toArray()
      return response(res, 200, { users: records.map((record) => ({ ...publicUser(record), disabled: record.disabled })) })
    }
    if (path === '/api/admin/users' && method === 'PATCH') {
      requireRole(user, 'admin')
      const body = parseBody(req)
      if (!ObjectId.isValid(body.id) || typeof body.disabled !== 'boolean') throw Object.assign(new Error('Provide a user ID and disabled status.'), { status: 400 })
      if (body.id === user._id.toString()) throw Object.assign(new Error('You cannot disable your own administrator account.'), { status: 400 })
      await users.updateOne({ _id: new ObjectId(body.id), role: { $ne: 'admin' } }, { $set: { disabled: body.disabled, updatedAt: new Date() } })
      return response(res, 200, { ok: true })
    }


    const storiesCol = db.collection('stories')
    const storyImagesCol = db.collection('story_images')
    const storyImage = path.match(/^\/api\/stories\/images\/([a-f\d]{24})$/i)
    const storyImages = path.match(/^\/api\/stories\/([a-f\d]{24})\/images$/i)
    const storyById = path.match(/^\/api\/stories\/([a-f\d]{24})$/i)
    if (storyImage && method === 'GET') {
      const image = await storyImagesCol.findOne({ _id: new ObjectId(storyImage[1]) })
      if (!image) throw Object.assign(new Error('Picture not found.'), { status: 404 })
      res.setHeader('Content-Type', 'image/jpeg')
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      return res.status(200).send(Buffer.from(image.data, 'base64'))
    }
    if (storyImage && method === 'DELETE') {
      requireRole(user, 'admin')
      await storyImagesCol.deleteOne({ _id: new ObjectId(storyImage[1]) })
      return response(res, 200, { ok: true })
    }
    if (path === '/api/stories' && method === 'GET') {
      const stories = await storiesCol.find({}).sort({ createdAt: -1 }).limit(100).toArray()
      const pictures = await storyImagesCol.find({}, { projection: { storyId: 1 } }).sort({ createdAt: 1 }).toArray()
      const grouped = {}
      for (const picture of pictures) (grouped[picture.storyId.toString()] ||= []).push(picture._id.toString())
      return response(res, 200, { stories: stories.map(({ _id, ...story }) => ({ id: _id.toString(), ...story, imageIds: grouped[_id.toString()] || [] })) })
    }
    if (path === '/api/stories' && method === 'POST') {
      requireRole(user, 'admin')
      const body = parseBody(req)
      const story = { title: validateText(body.title, 'Story title', 120), body: validateText(body.body, 'Story text', 6000), author: user.name, createdAt: new Date(), updatedAt: new Date() }
      const inserted = await storiesCol.insertOne(story)
      return response(res, 201, { story: { id: inserted.insertedId.toString() } })
    }
    if (storyById && method === 'PUT') {
      requireRole(user, 'admin')
      const body = parseBody(req)
      const result = await storiesCol.updateOne({ _id: new ObjectId(storyById[1]) }, { $set: { title: validateText(body.title, 'Story title', 120), body: validateText(body.body, 'Story text', 6000), updatedAt: new Date() } })
      if (!result.matchedCount) throw Object.assign(new Error('Story not found.'), { status: 404 })
      return response(res, 200, { ok: true })
    }
    if (storyById && method === 'DELETE') {
      requireRole(user, 'admin')
      await storyImagesCol.deleteMany({ storyId: new ObjectId(storyById[1]) })
      await storiesCol.deleteOne({ _id: new ObjectId(storyById[1]) })
      return response(res, 200, { ok: true })
    }
    if (storyImages && method === 'POST') {
      requireRole(user, 'admin')
      const storyId = new ObjectId(storyImages[1])
      if (!(await storiesCol.findOne({ _id: storyId }, { projection: { _id: 1 } }))) throw Object.assign(new Error('Story not found.'), { status: 404 })
      if (await storyImagesCol.countDocuments({ storyId }) >= 8) throw Object.assign(new Error('A story can have up to 8 pictures.'), { status: 400 })
      const data = parseBody(req).data
      const prefix = 'data:image/jpeg;base64,'
      if (typeof data !== 'string' || !data.startsWith(prefix) || data.length > 700000 || !/^[A-Za-z0-9+/=]+$/.test(data.slice(prefix.length))) throw Object.assign(new Error('Upload a JPEG picture under 500 KB.'), { status: 400 })
      const inserted = await storyImagesCol.insertOne({ storyId, data: data.slice(prefix.length), createdAt: new Date() })
      return response(res, 201, { id: inserted.insertedId.toString() })
    }


    const cropsCol = db.collection('crops')
    const cropStatuses = ['Not yet researched', 'Price available', 'Not yet available in Lesotho']
    const cropUnits = ['kg', '10 kg bag', '50 kg bag', 'crate', 'bunch', 'head', 'each']
    const cropSeed = [
      ['Maize', 'Grains & oilseeds', 'Maize'], ['Wheat', 'Grains & oilseeds', 'Wheat'], ['Sorghum', 'Grains & oilseeds', 'Sorghum'], ['Barley', 'Grains & oilseeds', 'Barley'], ['Oats', 'Grains & oilseeds', 'Oat'], ['Sunflower', 'Grains & oilseeds', 'Sunflower'], ['Canola', 'Grains & oilseeds', 'Rapeseed'], ['Soybeans', 'Grains & oilseeds', 'Soybean'],
      ['Dry beans', 'Legumes', 'Common bean'], ['Peas', 'Legumes', 'Pea'], ['Green beans', 'Legumes', 'Green bean'], ['Groundnuts', 'Legumes', 'Peanut'],
      ['Cabbage', 'Vegetables', 'Cabbage'], ['Spinach', 'Vegetables', 'Spinach'], ['Tomatoes', 'Vegetables', 'Tomato'], ['Onions', 'Vegetables', 'Onion'], ['Carrots', 'Vegetables', 'Carrot'], ['Beetroot', 'Vegetables', 'Beetroot'], ['Butternut', 'Vegetables', 'Butternut squash'], ['Pumpkin', 'Vegetables', 'Pumpkin'], ['Green peppers', 'Vegetables', 'Bell pepper'], ['Chillies', 'Vegetables', 'Chili pepper'], ['Cucumber', 'Vegetables', 'Cucumber'], ['Lettuce', 'Vegetables', 'Lettuce'], ['Cauliflower', 'Vegetables', 'Cauliflower'], ['Broccoli', 'Vegetables', 'Broccoli'], ['Garlic', 'Vegetables', 'Garlic'], ['Leeks', 'Vegetables', 'Leek'], ['Celery', 'Vegetables', 'Celery'], ['Eggplant', 'Vegetables', 'Eggplant'], ['Sweet corn', 'Vegetables', 'Sweet corn'], ['Swiss chard', 'Vegetables', 'Chard'],
      ['Potatoes', 'Root crops', 'Potato'], ['Sweet potatoes', 'Root crops', 'Sweet potato'], ['Turnips', 'Root crops', 'Turnip'], ['Radish', 'Root crops', 'Radish'],
      ['Apples', 'Fruit', 'Apple'], ['Peaches', 'Fruit', 'Peach'], ['Apricots', 'Fruit', 'Apricot'], ['Pears', 'Fruit', 'Pear'], ['Plums', 'Fruit', 'Plum'], ['Strawberries', 'Fruit', 'Strawberry'], ['Watermelon', 'Fruit', 'Watermelon'], ['Grapes', 'Fruit', 'Grape'],
    ]
    const cropFields = (body) => {
      const status = cropStatuses.includes(body.status) ? body.status : 'Not yet researched'
      let price = null
      if (body.price !== null && body.price !== undefined && body.price !== '') {
        price = Number(body.price)
        if (!Number.isFinite(price) || price < 0 || price > 1000000) throw Object.assign(new Error('Enter a valid price in maloti.'), { status: 400 })
      }
      if (status === 'Price available' && price === null) throw Object.assign(new Error('Enter a price, or change the status.'), { status: 400 })
      const unit = cropUnits.includes(body.unit) ? body.unit : 'kg'
      const note = typeof body.note === 'string' ? body.note.trim().slice(0, 300) : ''
      const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : ''
      if (imageUrl && (!imageUrl.startsWith('https://') || imageUrl.length > 400)) throw Object.assign(new Error('The photo link must start with https://'), { status: 400 })
      return { status, price: status === 'Price available' ? price : null, unit, note, imageUrl }
    }
    const cropById = path.match(/^\/api\/crops\/([a-f\d]{24})$/i)
    if (path === '/api/crops' && method === 'GET') {
      if (!(await cropsCol.countDocuments({}, { limit: 1 }))) {
        try { await cropsCol.insertMany(cropSeed.map(([name, category, wiki]) => ({ name, category, wiki, status: 'Not yet researched', price: null, unit: 'kg', note: '', imageUrl: '', createdAt: new Date(), updatedAt: null })), { ordered: false }) } catch (error) { if (error.code !== 11000 && !error.writeErrors) throw error }
      }
      const crops = await cropsCol.find({}).sort({ category: 1, name: 1 }).limit(500).toArray()
      return response(res, 200, { crops: crops.map(({ _id, ...crop }) => ({ id: _id.toString(), ...crop })) })
    }
    if (path === '/api/crops' && method === 'POST') {
      requireRole(user, 'admin')
      const body = parseBody(req)
      const name = validateText(body.name, 'Crop name', 60)
      const crop = { name, category: validateText(body.category, 'Category', 40), wiki: name, ...cropFields(body), createdAt: new Date(), updatedAt: new Date() }
      try { await cropsCol.insertOne(crop) } catch (error) { if (error.code === 11000) throw Object.assign(new Error('That crop is already on the list.'), { status: 409 }); throw error }
      return response(res, 201, { ok: true })
    }
    if (cropById && method === 'PUT') {
      requireRole(user, 'admin')
      const result = await cropsCol.updateOne({ _id: new ObjectId(cropById[1]) }, { $set: { ...cropFields(parseBody(req)), updatedAt: new Date() } })
      if (!result.matchedCount) throw Object.assign(new Error('Crop not found.'), { status: 404 })
      return response(res, 200, { ok: true })
    }
    if (cropById && method === 'DELETE') {
      requireRole(user, 'admin')
      await cropsCol.deleteOne({ _id: new ObjectId(cropById[1]) })
      return response(res, 200, { ok: true })
    }
    return response(res, 404, { error: 'API route not found.' })
  } catch (error) {
    const status = Number.isInteger(error.status) ? error.status : 500
    if (status >= 500) console.error('AgriConnect API error:', error)
    return response(res, status, { error: status >= 500 ? 'The service could not complete the request.' : error.message })
  }
}
