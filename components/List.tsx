import React, { FC, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { Execute, listToken } from '@reservoir0x/client-sdk'
import * as Dialog from '@radix-ui/react-dialog'
import { DateTime } from 'luxon'
import { ethers } from 'ethers'
import useUserTokens from 'hooks/useUserTokens'
import ModalCard from './ModalCard'
import { CgSpinner } from 'react-icons/cg'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

const List: FC = () => {
  const [{ data: accountData }] = useAccount()
  const [{ data: signer }] = useSigner()
  const [steps, setSteps] = useState<Execute['steps']>()
  const [waitingTx, setWaitingTx] = useState<boolean>(false)
  const [error, setError] = useState<any>(undefined)

  const tokens = useUserTokens(accountData?.address)

  const [open, setOpen] = useState(false)

  const contract = tokens.data?.tokens?.[0]?.token?.contract
  const tokenId = tokens.data?.tokens?.[0]?.token?.tokenId

  const close = () => {
    // Close modal
    setOpen(false)
    // Reset steps
    setSteps(undefined)
    // Toggle off waiting state
    setWaitingTx(false)
  }

  const handleSuccess: Parameters<
    typeof listToken
  >[0]['handleSuccess'] = () => {
    tokens && tokens.mutate()
    setError(undefined)
  }

  const handleError: Parameters<typeof listToken>[0]['handleError'] = (
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

    await listToken({
      query: {
        orderbook: 'reservoir',
        maker: accountData?.address,
        weiPrice: ethers.utils.parseEther('0.01').toString(),
        token: `${contract}:${tokenId}`,
        expirationTime: DateTime.now()
          .plus({ hours: 1 })
          .toMillis()
          .toString()
          .slice(0, -3),
      },
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
      <div className="reservoir-h6 mb-11">List MultiFaucet NFT for sale</div>
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
            'List for sale'
          )}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay>
            <ModalCard
              loading={waitingTx}
              title="List Token for Sale"
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
