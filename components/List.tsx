import React, { FC, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { Execute, listToken } from '@reservoir0x/client-sdk'
import * as Dialog from '@radix-ui/react-dialog'
import { DateTime } from 'luxon'
import { ethers } from 'ethers'
import useUserTokens from 'hooks/useUserTokens'
import ModalCard from './ModalCard'
import { CgSpinner } from 'react-icons/cg'
import Error from './Error'
import useUserAsks from 'hooks/useUserAsks'

// Load environment variables using the appropiate Next.js
// nomenclature
// https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
const API_BASE = process.env.NEXT_PUBLIC_API_BASE

type Props = {
  orders: ReturnType<typeof useUserAsks>
}

const List: FC<Props> = ({ orders }) => {
  // wagmi hooks
  const [{ data: accountData }] = useAccount()
  const [{ data: signer }] = useSigner()

  // Steps are shown in the modal to inform user about the
  // progress of execution for the current action.
  // The steps variable will be updated by the client SDK
  const [steps, setSteps] = useState<Execute['steps']>()

  // Loading state for the action button
  const [waitingTx, setWaitingTx] = useState<boolean>(false)

  // Error state for the action button
  const [error, setError] = useState<any>(undefined)

  // Control the open state for the modal
  const [open, setOpen] = useState(false)

  // Load the user's tokens using
  // the `/users/{user}/tokens/v2` endpoint
  // MAINNET: https://api.reservoir.tools/#/4.%20NFT%20API/getUsersUserTokensV2
  // RINKEBY: https://api-rinkeby.reservoir.tools/#/4.%20NFT%20API/getUsersUserTokensV2
  const tokens = useUserTokens(accountData?.address)

  // Extract the contract address from the response
  const contract = tokens.data?.tokens?.[0]?.token?.contract
  // Extract the token ID from the response
  const tokenId = tokens.data?.tokens?.[0]?.token?.tokenId

  // Close the modal and reset parameters
  const close = () => {
    // Close modal
    setOpen(false)
    // Reset steps
    setSteps(undefined)
    // Toggle off waiting state
    setWaitingTx(false)
  }

  // Execute the following function when the transaction has been
  // completed sucessfully
  const handleSuccess: Parameters<
    typeof listToken
  >[0]['handleSuccess'] = () => {
    // Refetch data from `/users/{user}/tokens/v2`
    tokens && tokens.mutate()
    // Refetch data from `/orders/asks/v1`
    orders && orders.mutate()
    // Remove the error message, if any
    setError(undefined)
  }

  // Execute the following function when the transaction has been
  // failed
  const handleError: Parameters<typeof listToken>[0]['handleError'] = (
    err: any
  ) => {
    // Close the steps modal
    close()

    // Set the error message in the UI
    setError(
      <Error>No Rinkeby Loot found. Please buy a token and try again.</Error>
    )
  }

  // Execute this function to list a token
  const execute = async (maker: string) => {
    // Set the loading state on
    setWaitingTx(true)

    await listToken({
      query: {
        // Set the order book to reservoir
        orderbook: 'reservoir',
        // Get the Ethereum address for the current user
        maker,
        // Set the list price to 0.01 ETH
        weiPrice: ethers.utils.parseEther('0.01').toString(),
        // The token format is `{contract-address}:{token-id}`
        token: `${contract}:${tokenId}`,
        // Set the expiration time for the listing order
        // to one hour
        expirationTime: DateTime.now()
          .plus({ hours: 1 })
          .toMillis()
          .toString()
          .slice(0, -3),
      },
      // Signer is an Ethereum signer object, usually generated by the browser
      signer,
      // The API base url for reservoir
      apiBase: API_BASE,
      setState: setSteps,
      handleSuccess,
      handleError,
    })

    // Set the loading state off
    setWaitingTx(false)
  }

  const maker = accountData?.address

  return (
    <article>
      {error}
      {/* Use Radix UI to create a modal to display the current state */}
      {/* of execution for the chosen transaction */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          disabled={waitingTx || !signer || !maker}
          onClick={() => maker && execute(maker)}
          className="btn-primary-fill w-[222px] mx-auto"
        >
          {waitingTx ? (
            <CgSpinner className="h-4 w-4 animate-spin" />
          ) : (
            'List for Sale'
          )}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay>
            <ModalCard
              loading={waitingTx}
              title="List for Sale"
              close={close}
              steps={steps}
            />
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </article>
  )
}

export default List
