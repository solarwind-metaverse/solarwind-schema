import { types } from 'cassandra-driver'
import { getClient as getPgClient } from './postgres/client.js'
import { getClient as getCassandraClient } from './cassandra/client.js'

const args = process.argv.slice(2)
const tableName = args[0]
const fromCassandra = args.includes('--from-cassandra')
const deleteTarget = args.includes('--delete-target')

async function copyTable(tableName: string) {

  const { 
    LOCAL_PG_HOST, REMOTE_PG_HOST,
    LOCAL_CASSANDRA_HOST, REMOTE_CASSANDRA_HOST
  } = process.env

  const pgClient = await getPgClient(REMOTE_PG_HOST!)
  const cassandraClient = await getCassandraClient(REMOTE_CASSANDRA_HOST!)
  
  let rows: {
    [columnName: string]: any
  }[] = []

  if (fromCassandra) {
    const result = await cassandraClient.execute(`SELECT * FROM solarwind.${tableName}`)
    rows = result.rows
    if (deleteTarget) {
      if (rows.length === 0) throw new Error('No rows to copy, abort delete.')
      console.log(`Deleting from ${tableName}`)
      const deleteResult = await pgClient.query(`DELETE FROM ${tableName}`)
      console.log(`${deleteResult.rowCount} rows deleted`)
    }
  } else {
    const result = await pgClient.query(`SELECT * FROM ${tableName}`)
    rows = result.rows
  }

  for (const row of rows) {

    const keys = Object.keys(row)

    const columnNameList = `(${keys.join(', ')})`
    const placeHolderList = `(${keys.map((_, i) => `$${i + 1}`).join(', ')})`
    const valueList = Object.values(row).map(value => {
      if (value instanceof types.Uuid) return value.toString()
      else if (value instanceof types.Long) return Number(value.toString())
      return value
    })

    const insertQuery = `INSERT INTO ${tableName} ${columnNameList} VALUES ${placeHolderList}`

    console.log(insertQuery, valueList)

    await pgClient.query(
      insertQuery,
      valueList
    )
    
  }

}

copyTable(tableName).then(() => {
  console.log('OK')
  process.exit(0)
})