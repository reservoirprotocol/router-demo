import { FC } from 'react'

/**
 * Ensure that an Ethereum address does not overflow
 * by removing the middle characters
 * @param address An Ethereum address
 * @param shrinkInidicator Visual indicator to show address is only
 * partially displayed
 * @returns A shrinked version of the Ethereum address
 * with the middle characters removed.
 */
function shrinkAddress(address: string, shrinkInidicator?: string) {
  return address.slice(0, 4) + (shrinkInidicator || '…') + address.slice(-4)
}

/**
 * Ensure the ENS names do not overflow by removing the
 * middle characters
 * @param ensName An ENS name
 * @param shrinkInidicator Visual indicator to show address is only
 * partially displayed
 * @returns A shrinked version of the ENS name if and
 * and only if the ENS name is longer than 24 characters
 * such that the displayed string does not overflow
 */
function shrinkEns(ensName: string, shrinkInidicator?: string) {
  if (ensName.length < 24) return ensName

  return ensName.slice(0, 20) + (shrinkInidicator || '…') + ensName.slice(-3)
}

type Props = {
  address: string | undefined
  ens?: {
    avatar: string | null | undefined
    name: string | null | undefined
  }
  title?: string
}

const EthAccount: FC<Props> = ({ address, ens, title }) => {
  return (
    <div className="flex items-center gap-2">
      {title && (
        <p className="reservoir-label-l capitalize text-gray-400">{title}</p>
      )}
      {ens?.name ? (
        <div title={address}>{shrinkEns(ens.name)}</div>
      ) : (
        <div
          className="reservoir-label-l block whitespace-nowrap font-mono"
          title={address}
        >
          {shrinkAddress(address || '')}
        </div>
      )}
      {ens?.avatar ? (
        <img
          className="block h-6 w-6 rounded-full"
          src={ens.avatar}
          alt="ENS Avatar"
        />
      ) : (
        <div className="rounded-full overflow-hidden bg-primary-300 h-6 w-6"></div>
      )}
    </div>
  )
}

export default EthAccount
