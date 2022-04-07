import React, { FC, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CgSpinner } from 'react-icons/cg'
import ModalCard from './ModalCard'
import { acceptOffer, Execute } from '@reservoir0x/client-sdk'
import { useAccount, useSigner } from 'wagmi'
import useUserTokens from 'hooks/useUserTokens'
import Error from './Error'
import Card from './Card'

// Load environment variables using the appropiate Next.js
// nomenclature
// https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const API_BASE = process.env.NEXT_PUBLIC_API_BASE

const Accept: FC = () => {
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

  // Extract the token ID of the first index of the user's tokens
  const tokenId = tokens.data?.tokens?.[0]?.token?.tokenId
  // Construct the token with the format `{contract-address}:{token-id}`
  const token = `${CONTRACT_ADDRESS}:${tokenId}`

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
    typeof acceptOffer
  >[0]['handleSuccess'] = () => {
    // Refetch data from `/users/{user}/tokens/v2`
    tokens && tokens.mutate()
    // Remove the error message, if any
    setError(undefined)
  }

  // Execute the following function when the transaction has been
  // failed
  const handleError: Parameters<typeof acceptOffer>[0]['handleError'] = (
    err: any
  ) => {
    // Close the steps modal
    close()

    // Set the error message in the UI
    setError(
      <Error>No Rinkeby Loot found. Please buy one and try again.</Error>
    )
  }

  // Execute this function to accept an offer to buy
  const execute = async () => {
    // Set the loading state on
    setWaitingTx(true)

    // Use the client SDK to accept an offer to buy
    await acceptOffer({
      // The token format is `{contract-address}:{token-id}`
      token,
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

  return (
    <Card>
      <div className="reservoir-h6 mb-8">Accept offer on Rinkeby Loot</div>
      {error}
      {/* Use Radix UI to create a modal to display the current state */}
      {/* of execution for the chosen transaction */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          disabled={waitingTx || !signer}
          onClick={execute}
          className="btn-primary-fill w-[222px]"
        >
          {waitingTx ? (
            <CgSpinner className="h-4 w-4 animate-spin" />
          ) : (
            'Accept Offer'
          )}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay>
            <ModalCard
              loading={waitingTx}
              title="Accept Offer"
              close={close}
              steps={steps}
            />
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </Card>
  )
}

export default Accept
