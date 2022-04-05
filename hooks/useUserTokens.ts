import { paths, setParams } from '@reservoir0x/client-sdk'
import fetcher from 'lib/fetcher'
import useSWR from 'swr'

type Tokens =
  paths['/users/{user}/tokens/v2']['get']['responses']['200']['schema']

export default function useUserTokens(
  API_BASE: string | undefined,
  user: string | undefined
) {
  function getUrl() {
    if (!API_BASE || !user) return undefined

    const url = new URL(`/users/${user}/tokens/v2`, API_BASE)

    let query: paths['/users/{user}/tokens/v2']['get']['parameters']['query'] =
      {
        limit: 20,
      }

    setParams(url, query)

    return url.href
  }

  const href = getUrl()

  const tokens = useSWR<Tokens>(href, fetcher)

  return tokens
}
