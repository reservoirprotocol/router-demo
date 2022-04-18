import { useNetwork, useSigner } from 'wagmi'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

export default function useIsWrongNetwork() {
  // wagmi hooks
  const [{ data: network }] = useNetwork()
  const [{ data: signer }] = useSigner()

  const isWrongNetwork =
    !!CHAIN_ID && !!signer && network.chain?.id !== +CHAIN_ID

  return isWrongNetwork
}
