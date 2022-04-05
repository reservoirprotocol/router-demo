import React, { FC, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { HiX } from 'react-icons/hi'
import { Execute } from '@reservoir0x/client-sdk'
import Steps from './Steps'

type Props = {
  loading: boolean
  close?: () => any
  actionButton?: ReactNode
  steps: Execute['steps']
  title: string
}

const ModalCard: FC<Props> = ({
  actionButton,
  loading,
  close,
  steps,
  title,
}) => {
  // If all executed succesfully, then success is true
  const success =
    !loading && steps && !steps.find(({ status }) => status === 'incomplete')

  return (
    <Dialog.Content className="fixed inset-0 bg-[#000000b6]">
      <div className="fixed top-1/2 left-1/2 w-[460px] -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-11 shadow-md ">
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="reservoir-h4">{title}</Dialog.Title>
          <Dialog.Close onClick={close} className="btn-primary-outline p-1.5">
            <HiX className="h-5 w-5" />
          </Dialog.Close>
        </div>
        <Steps steps={steps} />
        {success ? (
          <Dialog.Close onClick={close} className="btn-primary-outline w-full">
            Success, close this menu
          </Dialog.Close>
        ) : (
          <div className="flex gap-4">
            <Dialog.Close
              onClick={close}
              className="btn-primary-outline w-full"
            >
              Cancel
            </Dialog.Close>
            {actionButton}
          </div>
        )}
      </div>
    </Dialog.Content>
  )
}

export default ModalCard
