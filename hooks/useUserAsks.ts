import { paths, setParams } from '@reservoir0x/client-sdk'
import fetcher from 'lib/fetcher'
import useSWR from 'swr'

type Orders = paths['/orders/asks/v1']['get']['responses']['200']['schema']

export default function useUserAsks(
  API_BASE: string | undefined,
  maker: string | undefined
) {
  function getUrl() {
    if (!API_BASE || !maker) return undefined

    const url = new URL(`/orders/asks/v1`, API_BASE)

    let query: paths['/orders/asks/v1']['get']['parameters']['query'] = {
      limit: 20,
      maker,
      status: 'active',
    }

    setParams(url, query)

    return url.href
  }

  const href = getUrl()

  const orders = useSWR<Orders>(href, fetcher)

  return orders
}
