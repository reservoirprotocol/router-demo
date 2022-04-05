import React from 'react'
import { useAccount, useConnect } from 'wagmi'
import EthAccount from './EthAccount'

const ConnectWallet = () => {
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData, loading }, disconnect] = useAccount({
    fetchEns: true,
  })
  const wallet = connectData.connectors[0]

  return (
    <article className="mb-28">
      <div className="reservoir-h6 mb-11">
        Connect wallet to Rinkeby testnet
      </div>
      {accountData ? (
        <button
          className="btn-primary-outline rounded-full border-transparent bg-gray-100 normal-case"
          onClick={() => disconnect()}
        >
          <EthAccount
            address={accountData.address}
            ens={{
              avatar: accountData.ens?.avatar,
              name: accountData.ens?.name,
            }}
          />
        </button>
      ) : (
        <button onClick={() => connect(wallet)} className="btn-primary-fill">
          Connect Wallet
        </button>
      )}
    </article>
  )
}

export default ConnectWallet
