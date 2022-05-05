import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, chain, createClient, defaultChains } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

// API key for Ethereum node
// Two popular services are Alchemy (alchemy.com) and Infura (infura.io)
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID

const chains = defaultChains
const defaultChain = chain.mainnet

// Set up connectors
const client = createClient({
  autoConnect: true,
  connectors({ chainId }) {
    const chain = chains.find((x) => x.id === chainId) ?? defaultChain
    const rpcUrl = chain.rpcUrls.alchemy
      ? `${chain.rpcUrls.alchemy}/${alchemyId}`
      : chain.rpcUrls.default
    return [
      new InjectedConnector({
        chains,
        options: { name: 'Injected' },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
          rpc: { [chain.id]: rpcUrl },
        },
      }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'reservoir.market',
          chainId: chain.id,
          jsonRpcUrl: rpcUrl,
        },
      }),
    ]
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Use wagmi React Hooks to interact with Ethereum
    <Provider client={client}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
