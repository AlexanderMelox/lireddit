import 'reflect-metadata'
import { __prod__ } from './constants'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createConnection, Connection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import { PostResolver, UserResolver } from './resolvers'
import { Post, User } from './entity'

const main = async () => {
  // Connect to the db
  const connection: Connection = await createConnection({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'lireddit',
    entities: [Post, User],
    synchronize: false,
    logging: false,
  })

  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ connection }),
  })

  apolloServer.applyMiddleware({ app })

  app.get('/', (_, res) => {
    res.send('hello')
  })
  app.listen(4000, () => {
    console.log('server started on http://localhost:4000')
  })
}

main().catch(console.error)
