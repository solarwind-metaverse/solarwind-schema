import { executeMigrations } from './postgres/client.js'

const args = process.argv.slice(2)

const { LOCAL_PG_HOST, REMOTE_PG_HOST } = process.env

const host = (args.length > 0 && args[0] === 'remote') ? REMOTE_PG_HOST : LOCAL_PG_HOST

if (!host) throw new Error('Host not provided for PostgreSQL connection')

executeMigrations(host).then(() => {
  console.log('Migration OK')
  process.exit(0)
})