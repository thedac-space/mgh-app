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

const NftCard = ({ stats }: Props) => {
  const rewardsDue =
    Number(stats.rewardsDue) >= 1
      ? `Rewards Due: ${stats.rewardsDue}`
      : `No Rewards Due`
  return (
    <div className='text-gray-100 w-full max-w-xs p-8 rounded-[6rem] bg-grey-darkest'>
      <OptimizedImage
        src='/images/nft_mock.png'
        height={300}
        width={200}
        layout='responsive'
      />
      <p className='flex justify-between w-full'>
        <span>Staked:</span>{' '}
        <span>
          {Number(stats.amountStaked).toFixed(2)}${stats.coin}
        </span>
      </p>
      <p className='flex justify-between w-full'>
        <span>Token Id:</span> <span>{stats.tokenId}</span>
      </p>
      <p className='flex justify-between w-full'>
        <span>Staked:</span>{' '}
        <span>
          {Number(stats.amountStaked).toFixed(2)}${stats.coin}
        </span>
      </p>
    </div>
  )
}

export default NftCard
