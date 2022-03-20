import { NextPage } from 'next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import useConnectWeb3 from '../backend/connectWeb3'
import { getUserNFTs, viewNftStats } from '../backend/metaverseStaking'
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
  const [ids, setIds] = useState<string[]>([])
  const { address } = useAppSelector((state) => state.account)
  const { web3Provider } = useConnectWeb3()

  useEffect(() => {
    if (!address || !web3Provider) {
      setIds([])
      return setNfts([])
    }
    const setState = async () => {
      const tokenIds = await getUserNFTs(web3Provider, address)
      if (!tokenIds) {
        setIds([])
        return setNfts([])
      }
      await Promise.all(
        tokenIds.map(async (tokenId) => {
          const stats = await viewNftStats(tokenId, web3Provider)
          const nft = { ...stats, tokenId: tokenId }
          if (ids.includes(nft.tokenId)) return
          setIds((previous) => [...previous, nft.tokenId])
          setNfts((previous) => [...previous, nft])
        })
      )
    }
    setState()
  }, [address, web3Provider])
  return (
    <section className='w-full sm:w-full max-w-5xl 2xl:max-w-7xl pt-12 xl:pt-0 relative'>
      <h1 className='text-center mb-8 text-6xl green-text-gradient'>My NFTs</h1>

      <a className='absolute left-0 top-2'>
        <Link href={'/stake-metaverse'}>
          <span className='flex text-gray-400 items-center gap-2 cursor-pointer font-medium text-lg hover:text-blue-400 transition ease-in-out'>
            <FaArrowLeft className='relative bottom-[1px]' /> Go Back
          </span>
        </Link>
      </a>

      <div className='flex flex-wrap w-full gap-8 justify-center'>
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
