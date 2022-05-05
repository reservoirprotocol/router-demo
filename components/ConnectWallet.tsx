import { FC } from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import EthAccount from './EthAccount'
import ConnectWalletModal from './ConnectWalletModal'

const ConnectWallet: FC = () => {
  const { data: account, isLoading } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })
  const { disconnect } = useDisconnect()

  if (isLoading) return null

  if (account)
    return (
      <button
        onClick={() => disconnect()}
        className="btn-primary-outline rounded-full border-transparent bg-gray-100 normal-case"
      >
        <EthAccount
          address={account?.address}
          ens={{
            avatar: ensAvatar,
            name: ensName,
          }}
        />
      </button>
    )

  return <ConnectWalletModal />
}

export default ConnectWallet
