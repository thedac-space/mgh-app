import { NextPage } from 'next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import useConnectWeb3 from '../backend/connectWeb3'
import { getUserDepositEvents, viewNftStats } from '../backend/metaverseStaking'
import { NftCard } from '../components/MyNfts'
import { useAppSelector } from '../state/hooks'

interface NFT {
  amountStaked: string
  lastTimeRewardsUpdate: number
  rewardsDue: string
  hasWithdrawnInEpoche: boolean
  coin: string
  tokenId: string
}
const MyNfts: NextPage = () => {
  const [nfts, setNfts] = useState<NFT[]>([])
  const { address } = useAppSelector((state) => state.account)
  const { web3Provider } = useConnectWeb3()

  useEffect(() => {
    if (!address || !web3Provider) return
    const setState = async () => {
      const [event] = await getUserDepositEvents(web3Provider, address)
      const tokenId = event?.args.tokenId.toString()
      if (!tokenId) return setNfts([])
      const stats = await viewNftStats(tokenId, web3Provider)
      const nft = { ...stats, tokenId: tokenId }
      setNfts([nft])
    }
    setState()
  }, [address, web3Provider])
  return (
    <section className='w-75vw sm:w-full max-w-5xl pt-12 xl:pt-0 relative'>
      <h1 className='text-center mb-8 text-6xl green-text-gradient'>My NFTs</h1>

      <button className='hoverlift text-white p-4 absolute left-0 top-3 rounded-xl bg-gradient-to-br transition-all duration-300 from-pink-600 to-blue-500 font-medium'>
        <Link href={'/stake-metaverse'}>
          <span className='flex gap-2 items-center'>
            <BsArrowLeft className='relative bottom-005' /> Go Back
          </span>
        </Link>
      </button>
      <div className='flex w-full justify-center'>
        {nfts.length > 0 &&
          nfts.map((nftStats, i) => <NftCard key={i} stats={nftStats} />)}
        {/* {nfts.length === 0 && (
          <h3 className='text-2xl text-gray-200'>Stake to mint an NFT</h3>
        )} */}
      </div>
    </section>
  )
}

export default MyNfts
