import React from 'react'
import { useAccount, useConnect } from 'wagmi'
import EthAccount from './EthAccount'

const ConnectWallet = () => {
  // wagmi hooks
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  const wallet = connectData.connectors[0]

  return (
    <article className="mb-28">
      <div className="reservoir-h6 mb-11">
        Connect wallet to Rinkeby testnet
      </div>
      {accountData ? (
        // If the user is connected, make the button disconnect when clicked
        <button
          className="btn-primary-outline rounded-full border-transparent bg-gray-100 normal-case"
          onClick={() => disconnect()}
        >
          {/* When the user is connected, display his ENS or Ethereum account  */}
          <EthAccount
            address={accountData.address}
            ens={{
              avatar: accountData.ens?.avatar,
              name: accountData.ens?.name,
            }}
          />
        </button>
      ) : (
        // Create a connect wallet button
        <button onClick={() => connect(wallet)} className="btn-primary-fill">
          Connect Wallet
        </button>
      )}
    </article>
  )
}

export default ConnectWallet
