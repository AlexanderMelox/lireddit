import 'reflect-metadata'
import { __prod__ } from './constants'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import mongoose from 'mongoose'
import { buildSchema } from 'type-graphql'
import { PostResolver, UserResolver } from './resolvers'

const main = async () => {
  // Connect to the db
  try {
    mongoose.connect('mongodb://localhost/lireddit', {
      useNewUrlParser: true,
    })
    console.log('Connected to Mongodb database')
  } catch (err) {
    console.error(`💣ERROR:`, err)
  }

  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    // Pass db as context
    context: () => ({}),
  })

  apolloServer.applyMiddleware({ app })

  app.get('/', (_, res) => {
    res.send('hello')
  })
  app.listen(4000, () => {
    console.log('server started on http://localhost:4000')
  })
}

main().catch((err) => {
  console.error(err)
})
