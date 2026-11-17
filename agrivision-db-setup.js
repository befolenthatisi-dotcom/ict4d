// AgriVision database setup (MongoDB Atlas)
// Run:  mongosh "<your MONGODB_URI>" agrivision-db-setup.js
// Safe to re-run: existing collections are updated, not dropped.
// Matches the collections used by api/[...path].js

const dbName = 'agriconnect'            // same as MONGODB_DATABASE default
const d = db.getSiblingDB(dbName)

function ensure(name, validator) {
  const exists = d.getCollectionInfos({ name }).length > 0
  const opts = { validator: { $jsonSchema: validator }, validationLevel: 'moderate', validationAction: 'error' }
  if (exists) d.runCommand({ collMod: name, ...opts })
  else d.createCollection(name, opts)
}

// users: farmers and cooperative admins
ensure('users', {
  bsonType: 'object',
  required: ['email', 'passwordHash', 'name', 'role', 'createdAt'],
  properties: {
    email: { bsonType: 'string' },
    passwordHash: { bsonType: 'string' },
    name: { bsonType: 'string' },
    farm: { bsonType: 'string' },
    district: { bsonType: 'string' },
    phone: { bsonType: 'string' },
    role: { enum: ['farmer', 'admin'] },
    disabled: { bsonType: 'bool' },
    cooperativeMember: { bsonType: 'bool' },
    marketAlerts: { bsonType: 'bool' },
    createdAt: { bsonType: 'date' },
    updatedAt: { bsonType: 'date' },
  },
})
d.users.createIndex({ email: 1 }, { unique: true })
d.users.createIndex({ role: 1, cooperativeMember: 1, disabled: 1 })

// produce: cooperative marketplace listings
ensure('produce', {
  bsonType: 'object',
  required: ['ownerId', 'type', 'quantity', 'unit', 'status', 'createdAt'],
  properties: {
    ownerId: { bsonType: 'objectId' },
    type: { enum: ['Vegetables'] },
    quantity: { bsonType: ['int', 'long', 'double'], minimum: 0 },
    unit: { enum: ['kg', 'crates', 'bales'] },
    district: { bsonType: 'string' },
    farmer: { bsonType: 'string' },
    farm: { bsonType: 'string' },
    status: { bsonType: 'string' },
    createdAt: { bsonType: 'date' },
  },
})
d.produce.createIndex({ status: 1, createdAt: -1 })
d.produce.createIndex({ ownerId: 1 })

// announcements: posted by cooperative admins
ensure('announcements', {
  bsonType: 'object',
  required: ['title', 'detail', 'author', 'createdAt'],
  properties: {
    title: { bsonType: 'string' },
    detail: { bsonType: 'string', maxLength: 500 },
    author: { bsonType: 'string' },
    createdAt: { bsonType: 'date' },
  },
})
d.announcements.createIndex({ createdAt: -1 })

// rate_limits: login/register throttling (auto-deleted after 24h)
if (!d.getCollectionInfos({ name: 'rate_limits' }).length) d.createCollection('rate_limits')
d.rate_limits.createIndex({ resetAt: 1 }, { expireAfterSeconds: 86400 })

// setup: one-time admin bootstrap flag (created by the API)
if (!d.getCollectionInfos({ name: 'setup' }).length) d.createCollection('setup')

print('Done. Collections: ' + d.getCollectionNames().join(', '))
