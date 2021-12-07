import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WebSocketProvider } from '../providers/WebSocketProvider'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <WebSocketProvider>
      <Component {...pageProps} />
    </WebSocketProvider>
  )
}

export default MyApp
