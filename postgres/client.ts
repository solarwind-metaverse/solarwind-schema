import fs from 'fs'
import pg from 'pg'

const { Client } = pg

// Define the directory where the files are located
const directoryPath = 'postgres/schema'

// Regular expression pattern to match filenames
const filenamePattern = /^V(\d+)_.*/

// Function to extract version number from filename
function extractVersion(filename: string): number {
  const match = filename.match(filenamePattern);
  return match ? parseInt(match[1]) : 0;
}

async function getClient(host: string): Promise<pg.Client> {

  const { DB_USER, DB_PASSWORD } = process.env

  console.log(`Establishing PostgreSQL connection ${DB_USER}@${host}`)

  const dbConfig = {
    user: DB_USER,
    host,
    database: 'solarwind',
    password: DB_PASSWORD,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync('postgres/certs/ca-certificate.pem'),
      key: fs.readFileSync('postgres/certs/client-key.pem'),
      cert: fs.readFileSync('postgres/certs/client-cert.pem'),
    }
  }

  const client = new Client(dbConfig)
  await client.connect()

  console.log('Connected to PostgreSQL')
  return client;

}

async function executeMigrations(host: string) {

  const client = await getClient(host)

  try {
    
    const sortedFiles = fs.readdirSync(directoryPath)
      .filter(filename => filename.match(filenamePattern))
      .sort((a, b) => extractVersion(a) - extractVersion(b))
    
    console.log(`Found ${sortedFiles.length} migration file(s)`)
    for (const file of sortedFiles) {
      console.log(`Executing ${file}`)
      const sqlQuery = fs.readFileSync(`${directoryPath}/${file}`, 'utf8')
      await client.query(sqlQuery);
    }
    
  } catch (err) {
    console.error('Error executing SQL script:', err)
  } finally {
    await client.end()
  }
}

export {
  getClient,
  executeMigrations
}
