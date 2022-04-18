import { Execute, placeBid } from '@reservoir0x/client-sdk'
import * as Dialog from '@radix-ui/react-dialog'
import React, { FC, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { CgSpinner } from 'react-icons/cg'
import ModalCard from './ModalCard'
import { DateTime } from 'luxon'
import { ethers } from 'ethers'
import Error from './Error'
import useIsWrongNetwork from 'hooks/useIsWrongNetwork'

// Load environment variables using the appropiate Next.js
// nomenclature
// https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const API_BASE = process.env.NEXT_PUBLIC_API_BASE

const AttributeOffer: FC = () => {
  // wagmi hooks
  const [{ data: signer }] = useSigner()
  const [{ data: accountData }] = useAccount()

  // Check if the user is connected to the wrong Ethereum Network
  const isWrongNetwork = useIsWrongNetwork()

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
  // failed
  const handleError: Parameters<typeof placeBid>[0]['handleError'] = (
    err: any
  ) => {
    // Close the steps modal
    close()

    // Differentiate error messages
    if (err?.message === 'Maker does not have sufficient balance') {
      // Set the error message in the UI
      setError(
        <Error>
          Insufficient funds.{' '}
          <a
            href="https://faucet.paradigm.xyz/"
            rel="noopener noreferrer nofollow"
            className="underline"
          >
            Top up your Rinkeby ETH
          </a>{' '}
          and try again.
        </Error>
      )
    }
  }

  const maker = accountData?.address

  // Execute this function to buy a token
  const execute = async (maker: string) => {
    // Set the loading state on
    setWaitingTx(true)

    // Use the client SDK to place a collection offer
    await placeBid({
      query: {
        // Get the Ethereum address for the current user
        maker,
        // Set the list price to 0.01 ETH
        weiPrice: ethers.utils.parseEther('0.01').toString(),
        // Set the expiration time for the listing order
        // to one hour
        expirationTime: DateTime.now()
          .plus({ hours: 1 })
          .toMillis()
          .toString()
          .slice(0, -3),
        // The contract address for the collection
        collection: CONTRACT_ADDRESS,
        // The attribute key
        attributeKey: 'Rarity',
        // The attribute value
        attributeValue: 'Mythic',
      },
      // Signer is an Ethereum signer object, usually generated by the browser
      signer,
      // The API base url for reservoir
      apiBase: API_BASE,
      setState: setSteps,
      handleError,
    })

    // Set the loading state off
    setWaitingTx(false)
  }

  return (
    <article>
      {error}
      {/* Use Radix UI to create a modal to display the current state */}
      {/* of execution for the chosen transaction */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          disabled={waitingTx || !maker || !signer || isWrongNetwork}
          onClick={() => maker && execute(maker)}
          className="btn-primary-fill w-[222px] mx-auto"
        >
          {waitingTx ? (
            <CgSpinner className="h-4 w-4 animate-spin" />
          ) : (
            'Make an Attribute Offer'
          )}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay>
            <ModalCard
              loading={waitingTx}
              title="Make an Attribute Offer"
              close={close}
              steps={steps}
            />
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </article>
  )
}

export default AttributeOffer
