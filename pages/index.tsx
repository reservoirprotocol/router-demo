import Accept from 'components/Accept'
import Buy from 'components/Buy'
import Cancel from 'components/Cancel'
import ConnectWallet from 'components/ConnectWallet'
import Layout from 'components/Layout'
import List from 'components/List'

const IndexPage = () => (
  <Layout>
    <h1 className="reservoir-h1 mb-20 mt-28">Reservoir Client SDK Demo</h1>
    <ConnectWallet />
    <Buy />
    <List />
    <Cancel />
    <Accept />
  </Layout>
)

export default IndexPage
