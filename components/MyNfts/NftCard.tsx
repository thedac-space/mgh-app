import { formatEther } from 'ethers/lib/utils'
import React from 'react'
import { OptimizedImage } from '../General'

interface Props {
  stats: {
    amountStaked: string
    lastTimeRewardsUpdate: number
    rewardsDue: string | undefined
    hasWithdrawnInEpoche: boolean
    coin: string
    tokenId: string
  }
}
const array = Array(10)
const NftCard = ({ stats }: Props) => {
  const rewardsDue =
    Number(stats.rewardsDue) >= 1
      ? `Rewards Due: ${stats.rewardsDue}`
      : `No Rewards Due`

  console.log({ stats })
  return (
    <div className='text-gray-200 w-full  max-w-md p-8 rounded-[6rem] bg-grey-darkest relative'>
      {/* Top Border */}
      <span className='absolute top-2 left-2/4 text-gray-400 -translate-x-2/4 flex whitespace-nowrap italic gap-4'>
        {[...Array(3)].map((_, i) => (
          <span key={i}>MGH DAO</span>
        ))}
      </span>
      {/* Left Border */}
      <span className='text-gray-400 nft-border-left text-xs'>
        {[...Array(4)].map((_, i) => (
          <span key={i}>MGH DAO</span>
        ))}
      </span>
      {/* Right Border */}

      <span className='text-gray-400 nft-border-right text-xs'>
        {[...Array(4)].map((_, i) => (
          <span key={i}>MGH DAO</span>
        ))}
      </span>
      <OptimizedImage
        src='/images/nft_mock.png'
        height={300}
        width={250}
        layout='responsive'
        className='mb-4'
      />
      <div className='flex flex-col gap-1 text-lg font-medium'>
        <p className='flex justify-between w-full'>
          <span>Id:</span> <span>{stats.tokenId}</span>
        </p>
        <p className='flex justify-between w-full'>
          <span>Stake:</span>{' '}
          <span>
            {Number(stats.amountStaked).toFixed(2)}${stats.coin}
          </span>
        </p>
        <p className='flex justify-between w-full'>
          <span>Rewards:</span> <span>{rewardsDue} $MGH</span>
        </p>
      </div>
    </div>
  )
}

export default NftCard
