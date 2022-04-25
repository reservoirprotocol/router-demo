import { Signer } from 'ethers'
import useCollection from 'hooks/useCollection'
import useIsWrongNetwork from 'hooks/useIsWrongNetwork'
import { Dispatch, SetStateAction, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { useAccount, useSigner } from 'wagmi'
import Error from './Error'

// Load environment variables using the appropiate Next.js
// nomenclature
// https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS
const API_BASE = process.env.NEXT_PUBLIC_API_BASE

async function executeBuy(
  token: string,
  taker: string,
  signer: Signer,
  setError: Dispatch<any>,
  setWaitingTx: Dispatch<SetStateAction<boolean>>
) {
  const url = new URL('/execute/buy/v1', API_BASE)

  const query = {
    // The token format is `{contract-address}:{token-id}`
    token,
    // The signer's Ethereum address
    taker,
  }

  // Add query paramenters to the URL object
  Object.entries(query).forEach(([key, value]) =>
    url.searchParams.set(key, value.toString())
  )

  try {
    // Turn on the loading indication for the Buy button
    setWaitingTx(true)

    const res = await fetch(url.href)

    const json = await res.json()

    // Prompt the user to sign the transaction
    const tx = await signer.sendTransaction(json?.steps[0]?.data)

    // Wait for the transaction to be mined
    await tx.wait()
    // Remove the error message, if any
    setError(undefined)
  } catch (error: any) {
    console.error(error)
    // Differentiate error messages
    if (error?.message === 'Taker does not have sufficient balance') {
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

  setWaitingTx(false)
}

const BuyNoSdk = () => {
  // wagmi hooks
  const [{ data: signer }] = useSigner()
  const [{ data: accountData }] = useAccount()

  // Check if the user is connected to the wrong Ethereum Network
  const isWrongNetwork = useIsWrongNetwork()

  // Loading state for the action button
  const [waitingTx, setWaitingTx] = useState<boolean>(false)

  // Error state for the action button
  const [error, setError] = useState<any>(undefined)

  // Load the collection's floor token using
  // the `/collection/v1` endpoint
  // MAINNET: https://api.reservoir.tools/#/4.%20NFT%20API/getCollectionV1
  // RINKEBY: https://api-rinkeby.reservoir.tools/#/4.%20NFT%20API/getCollectionV1
  const collection = useCollection()

  // Extract the token ID of the first index of the user's tokens
  const tokenId = collection.data?.collection?.floorAsk?.token?.tokenId
  // Construct the token with the format `{contract-address}:{token-id}`
  const token = `${CONTRACT_ADDRESS}:${tokenId}`

  const taker = accountData?.address

  return (
    <article>
      {error}
      <button
        disabled={waitingTx || !signer || isWrongNetwork}
        onClick={() =>
          token &&
          taker &&
          signer &&
          executeBuy(token, taker, signer, setError, setWaitingTx)
        }
        className="btn-primary-fill w-[222px] mx-auto"
      >
        {waitingTx ? (
          <CgSpinner className="h-4 w-4 animate-spin" />
        ) : (
          'Buy (No SDK)'
        )}
      </button>
    </article>
  )
}

export default BuyNoSdk
