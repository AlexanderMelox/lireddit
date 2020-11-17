import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import {
  createClient,
  dedupExchange,
  fetchExchange,
  Provider as URQLProvider,
} from 'urql'
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache'
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql'
import theme from '../theme'
import '../index.css'

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(queryInput, (data) => fn(result, data as any) as any)
}

/** Creates the urql client */
const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query
                } else {
                  return {
                    me: result.login.user,
                  }
                }
              }
            )
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.registerUser.errors) {
                  return query
                } else {
                  return {
                    me: result.registerUser.user,
                  }
                }
              }
            )
          },
        },
      },
    }),
    fetchExchange,
  ],
})

function MyApp({ Component, pageProps }: any) {
  return (
    <URQLProvider value={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </URQLProvider>
  )
}

export default MyApp
