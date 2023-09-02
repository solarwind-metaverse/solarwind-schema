import cassandra, { types } from 'cassandra-driver'

export const getClient = (dbHost?: string): cassandra.Client => {
  
  const { LOCAL_CASSANDRA_HOST } = process.env

  const host = dbHost || LOCAL_CASSANDRA_HOST
  console.log('Establishing Cassandra connection to', host)
  if (!host) throw new Error('Host not provided for Cassandra connection')

  const client = new cassandra.Client({
    contactPoints: [ host ],
    localDataCenter: 'datacenter1'
  })
      
  client.connect((err: any) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Connected to Cassandra')
  })

  return client

}