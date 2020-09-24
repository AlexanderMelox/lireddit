import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { getMongoManager } from 'typeorm'
import { createConnection, Connection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import { PostResolver, UserResolver } from './resolvers'
import { Post, User } from './entity'
import { __prod__ } from './constants'
import redis from 'redis'
import session from 'express-session'
import connectReddis from 'connect-redis'
import { MyContext } from './types'
import cors from 'cors'

const main = async () => {
  // Connect to the db
  const connection: Connection = await createConnection({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'lireddit',
    entities: [Post, User],
    synchronize: false,
    logging: true,
  })

  const manager = getMongoManager()

  const app = express()

  const RedisStore = connectReddis(session)
  const redisClient = redis.createClient()
  const tenYears = 1000 * 60 * 60 * 24 * 365 * 10

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: tenYears,
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: 'lkasdlkahsdiodkajsndkajsndk',
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ connection, manager, req, res }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  })

  app.get('/', (_, res) => {
    res.send('hello')
  })
  app.listen(4000, () => {
    console.log('server started on http://localhost:4000')
  })
}

main().catch(console.error)
