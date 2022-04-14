import Accept from 'components/Accept'
import AttributeOffer from 'components/AttributeOffer'
import Buy from 'components/Buy'
import Cancel from 'components/Cancel'
import CollectionOffer from 'components/CollectionOffer'
import ConnectWallet from 'components/ConnectWallet'
import Layout from 'components/Layout'
import List from 'components/List'
import TokenOffer from 'components/TokenOffer'
import useUserAsks from 'hooks/useUserAsks'
import { useAccount } from 'wagmi'
import { FiExternalLink } from 'react-icons/fi'
import MultiBuy from 'components/MultiBuy'

const IndexPage = () => {
  // wagmi hooks
  const [{ data: accountData }] = useAccount()

  // Load an user's active list order using
  //the `/orders/asks/v1` endpoint
  // MAINNET: https://api.reservoir.tools/#/4.%20NFT%20API/getOrdersAsksV1
  // RINKEBY: https://api-rinkeby.reservoir.tools/#/4.%20NFT%20API/getOrdersAsksV1
  const orders = useUserAsks(accountData?.address)
  const userAddress = accountData?.address

  return (
    <Layout>
      <h1 className="reservoir-h1 mb-2 mt-6 md:mt-28">
        Reservoir Client SDK Demo
      </h1>
      <a
        className="reservoir-h5 inline-flex items-center mb-2"
        href="https://github.com/reservoirprotocol/client-sdk-demo"
        rel="norefereer noopener"
      >
        Source code
        <FiExternalLink className="w-4 h-4 ml-2" />
      </a>
      <br />
      <a
        className="reservoir-h5 inline-flex items-center mb-14"
        href="https://www.npmjs.com/package/@reservoir0x/client-sdk"
        rel="norefereer noopener"
      >
        @reservoir0x/client-sdk
        <FiExternalLink className="w-4 h-4 ml-2" />
      </a>
      <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-12">
        <ConnectWallet />
        <Buy />
        <List orders={orders} />
        <Cancel orders={orders} />
        <Accept />
        <TokenOffer />
        <CollectionOffer />
        <AttributeOffer />
        <MultiBuy />
      </div>
      <p className="mb-4">
        This demo is using the{' '}
        <a
          className="underline"
          target="_blank"
          href="https://www.reservoir.fun/collections/0x79e2d470f950f2cf78eef41720e8ff2cf4b3cd78"
          rel="norefereer noopener"
        >
          Loot Contract
        </a>{' '}
        on Rinkeby.
      </p>
      {userAddress && (
        <p>
          View your Rinkeby orders on{' '}
          <a
            className="underline"
            target="_blank"
            href={`https://www.reservoir.fun/address/${userAddress}`}
          >
            Reservoir Market Testnet
          </a>
          .
        </p>
      )}
    </Layout>
  )
}

export default IndexPage
