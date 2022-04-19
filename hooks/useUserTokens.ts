import { paths, setParams } from '@reservoir0x/client-sdk'
import fetcher from 'lib/fetcher'
import useSWR from 'swr'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS

type Tokens =
  paths['/users/{user}/tokens/v2']['get']['responses']['200']['schema']

export default function useUserTokens(user: string | undefined) {
  function getUrl() {
    if (!API_BASE || !user) return undefined

    const url = new URL(`/users/${user}/tokens/v2`, API_BASE)

    let query: paths['/users/{user}/tokens/v2']['get']['parameters']['query'] =
      {
        limit: 1,
        collection: CONTRACT_ADDRESS,
      }

    setParams(url, query)

    return url.href
  }

  const href = getUrl()

  const tokens = useSWR<Tokens>(href, fetcher)

  return tokens
}
