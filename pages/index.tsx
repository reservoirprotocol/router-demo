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

const IndexPage = () => {
  // wagmi hooks
  const [{ data: accountData }] = useAccount()

  // Load an user's active list order using
  //the `/orders/asks/v1` endpoint
  // MAINNET: https://api.reservoir.tools/#/4.%20NFT%20API/getOrdersAsksV1
  // RINKEBY: https://api-rinkeby.reservoir.tools/#/4.%20NFT%20API/getOrdersAsksV1
  const orders = useUserAsks(accountData?.address)

  return (
    <Layout>
      <h1 className="reservoir-h1 mb-2 mt-28">Reservoir Client SDK Demo</h1>
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
      <ConnectWallet />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-28">
        <Buy />
        <List orders={orders} />
        <Cancel orders={orders} />
        <Accept />
        <TokenOffer />
        <CollectionOffer />
        <AttributeOffer />
      </div>
    </Layout>
  )
}

export default IndexPage
