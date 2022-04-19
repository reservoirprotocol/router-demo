import { paths, setParams } from '@reservoir0x/client-sdk'
import fetcher from 'lib/fetcher'
import useSWR from 'swr'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS
const API_BASE = process.env.NEXT_PUBLIC_API_BASE

type Orders = paths['/collection/v1']['get']['responses']['200']['schema']

export default function useCollection(address?: string) {
  function getUrl() {
    if (!API_BASE || !CONTRACT_ADDRESS) return undefined

    const url = new URL('/collection/v1', API_BASE)

    const contractAddress = address || CONTRACT_ADDRESS

    let query: paths['/collection/v1']['get']['parameters']['query'] = {
      id: contractAddress,
    }

    setParams(url, query)

    return url.href
  }

  const href = getUrl()

  const orders = useSWR<Orders>(href, fetcher)

  return orders
}
