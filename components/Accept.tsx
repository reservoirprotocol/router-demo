import React, { FC, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CgSpinner } from 'react-icons/cg'
import ModalCard from './ModalCard'
import { acceptOffer, Execute } from '@reservoir0x/client-sdk'
import { useAccount, useSigner } from 'wagmi'
import useUserTokens from 'hooks/useUserTokens'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const API_BASE = process.env.NEXT_PUBLIC_API_BASE

const Accept: FC = () => {
  const [{ data: accountData }] = useAccount()
  const [{ data: signer }] = useSigner()
  const [steps, setSteps] = useState<Execute['steps']>()
  const [waitingTx, setWaitingTx] = useState<boolean>(false)
  const [error, setError] = useState<any>(undefined)

  const tokens = useUserTokens(accountData?.address)

  const [open, setOpen] = useState(false)

  const tokenId = tokens.data?.tokens?.[0]?.token?.tokenId
  const token = `${CONTRACT_ADDRESS}:${tokenId}`

  const close = () => {
    // Close modal
    setOpen(false)
    // Reset steps
    setSteps(undefined)
    // Toggle off waiting state
    setWaitingTx(false)
  }

  const handleSuccess: Parameters<
    typeof acceptOffer
  >[0]['handleSuccess'] = () => {
    tokens && tokens.mutate()
    setError(undefined)
  }

  const handleError: Parameters<typeof acceptOffer>[0]['handleError'] = (
    err: any
  ) => {
    close()

    setError(
      <p className="text-[#FF3B3B] reservoir-body mb-4">
        No MultiFaucet NFT found.{' '}
        <a
          href="https://faucet.paradigm.xyz/"
          rel="noopener noreferrer nofollow"
          className="underline"
        >
          Mint a free token
        </a>{' '}
        and try again.
      </p>
    )
  }

  const execute = async () => {
    setWaitingTx(true)

    await acceptOffer({
      token,
      signer,
      apiBase: API_BASE,
      setState: setSteps,
      handleSuccess,
      handleError,
    })

    setWaitingTx(false)
  }

  return (
    <article className="mb-28">
      <div className="reservoir-h6 mb-11">Accept offer on MultiFaucet NFT</div>
      {error}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          disabled={waitingTx}
          onClick={execute}
          className="btn-primary-fill"
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
    </article>
  )
}

export default Accept
