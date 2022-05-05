import { useNetwork, useSigner } from 'wagmi'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

export default function useIsWrongNetwork() {
  // wagmi hooks
  const { activeChain } = useNetwork()
  const { data: signer } = useSigner()

  const isWrongNetwork = Boolean(
    !!CHAIN_ID && !!signer && activeChain?.id !== +CHAIN_ID
  )

  return isWrongNetwork
}
