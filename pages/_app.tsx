import type { AppProps } from "next/app";
import { WebSocketProvider } from "../providers/WebSocketProvider";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>TuringFest</title>
        <meta
          name="description"
          content="TuringFest is an online platform for performing Turing Tests."
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>"
        ></link>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <ChakraProvider theme={theme}>
        <WebSocketProvider>
          <Component {...pageProps} />
        </WebSocketProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
