import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import { createClient, Provider as URQLProvider } from 'urql'
import theme from '../theme'

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
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
