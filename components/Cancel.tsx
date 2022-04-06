import { cancelOrder, Execute } from '@reservoir0x/client-sdk'
import useUserAsks from 'hooks/useUserAsks'
import React, { FC, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import * as Dialog from '@radix-ui/react-dialog'
import { CgSpinner } from 'react-icons/cg'
import ModalCard from './ModalCard'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

const Cancel: FC = () => {
  const [{ data: accountData }] = useAccount()
  const [{ data: signer }] = useSigner()
  const [steps, setSteps] = useState<Execute['steps']>()
  const [waitingTx, setWaitingTx] = useState<boolean>(false)
  const [error, setError] = useState<any>(undefined)

  const orders = useUserAsks(accountData?.address)

  const id = orders.data?.orders?.[0]?.id
  const maker = orders.data?.orders?.[0]?.maker

  const [open, setOpen] = useState(false)

  const close = () => {
    // Close modal
    setOpen(false)
    // Reset steps
    setSteps(undefined)
    // Toggle off waiting state
    setWaitingTx(false)
  }

  const handleSuccess: Parameters<
    typeof cancelOrder
  >[0]['handleSuccess'] = () => {
    orders && orders.mutate()
    setError(undefined)
  }

  const handleError: Parameters<typeof cancelOrder>[0]['handleError'] = (
    err: any
  ) => {
    close()

    setError(
      <p className="text-[#FF3B3B] reservoir-body mb-4">
        No listing found. List MultiFaucet NFT for sale above and try again.
      </p>
    )
  }

  const execute = async () => {
    setWaitingTx(true)

    await cancelOrder({
      id,
      maker,
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
      <div className="reservoir-h6 mb-11">Cancel MultiFaucet NFT listing</div>
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
            'Cancel order'
          )}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay>
            <ModalCard
              loading={waitingTx}
              title="Cancel order"
              close={close}
              steps={steps}
            />
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </article>
  )
}

export default Cancel
