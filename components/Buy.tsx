import { buyToken, Execute } from '@reservoir0x/client-sdk'
import useCollection from 'hooks/useCollection'
import * as Dialog from '@radix-ui/react-dialog'
import React, { FC, useState } from 'react'
import { useSigner } from 'wagmi'
import { CgSpinner } from 'react-icons/cg'
import ModalCard from './ModalCard'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const API_BASE = process.env.NEXT_PUBLIC_API_BASE

const Buy: FC = () => {
  const [{ data: signer }] = useSigner()
  const [steps, setSteps] = useState<Execute['steps']>()
  const [waitingTx, setWaitingTx] = useState<boolean>(false)
  const [error, setError] = useState<any>(undefined)

  const collection = useCollection()

  const [open, setOpen] = useState(false)

  const tokenId = collection.data?.collection?.floorAsk?.token?.tokenId
  const token = `${CONTRACT_ADDRESS}:${tokenId}`

  const close = () => {
    // Close modal
    setOpen(false)
    // Reset steps
    setSteps(undefined)
    // Toggle off waiting state
    setWaitingTx(false)
  }

  const handleSuccess: Parameters<typeof buyToken>[0]['handleSuccess'] = () => {
    collection && collection.mutate()
    setError(undefined)
  }

  const handleError: Parameters<typeof buyToken>[0]['handleError'] = (
    err: any
  ) => {
    close()

    setError(
      <p className="text-[#FF3B3B] reservoir-body mb-4">
        Insufficent funds.{' '}
        <a
          href="https://faucet.paradigm.xyz/"
          rel="noopener noreferrer nofollow"
          className="underline"
        >
          Top up your Rinkeby ETH
        </a>{' '}
        and try again.
      </p>
    )
  }

  const execute = async () => {
    setWaitingTx(true)

    await buyToken({
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
      <div className="reservoir-h6 mb-11">Buy MultiFaucet NFT</div>
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
            'Buy Now'
          )}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay>
            <ModalCard
              loading={waitingTx}
              title="Buy Now"
              close={close}
              steps={steps}
            />
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </article>
  )
}

export default Buy
