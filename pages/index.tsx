import Accept from 'components/Accept'
import Buy from 'components/Buy'
import Cancel from 'components/Cancel'
import ConnectWallet from 'components/ConnectWallet'
import Layout from 'components/Layout'
import List from 'components/List'
import useUserAsks from 'hooks/useUserAsks'
import { useAccount } from 'wagmi'

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
      <h1 className="reservoir-h1 mb-20 mt-28">Reservoir Client SDK Demo</h1>
      <ConnectWallet />
      <Buy />
      <List orders={orders} />
      <Cancel orders={orders} />
      <Accept />
    </Layout>
  )
}

export default IndexPage
