import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Contracts } from '../../lib/contracts'
import { typedKeys, makeOwnProvider } from '../../lib/utilities'
import { useAppSelector } from '../../state/hooks'
import { TokenAbiETHMainnet } from '../../types/ethers-contracts'
import { OptimizedImage } from '../General'

const PurchaseCoinList = () => {
  const erc20Abi = Contracts.MGH_TOKEN.ETHEREUM_MAINNET.abi
  const { address } = useAppSelector((state) => state.account)
  const [coinsBalance, setCoinsBalance] =
    useState<Record<keyof typeof coinSwitch, number>>()
  const coinSwitch = {
    mgh: {
      img: '/images/mgh_logo.png',
      contractAddress: '0x8765b1a0eb57ca49be7eacd35b24a574d0203656',
      chain: 1,
    },
    eth: { img: '/images/mgh_logo.png', contractAddress: '', chain: 1 },
    usdc: {
      img: '/images/mgh_logo.png',
      contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      chain: 1,
    },
    usdt: {
      img: '/images/mgh_logo.png',
      contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      chain: 1,
    },
    matic: { img: '/images/mgh_logo.png', contractAddress: '', chain: 137 },
    ocean: {
      img: '/images/mgh_logo.png',
      contractAddress: '0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
      chain: 1,
    },
    sand: {
      img: '/images/mgh_logo.png',
      contractAddress: '0x3845badade8e6dff049820680d1f14bd3903a5d0',
      chain: 1,
    },
    mana: {
      img: '/images/mgh_logo.png',
      contractAddress: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
      chain: 1,
    },
  }

  useEffect(() => {
    const getCoinBalances = async () => {
      if (!address) return
      await Promise.allSettled(
        typedKeys(coinSwitch).map(async (coin) => {
          let balance = NaN
          const provider = makeOwnProvider(coinSwitch[coin].chain)
          if (!['eth', 'matic'].includes(coin)) {
            const coinContract = new ethers.Contract(
              coinSwitch[coin].contractAddress,
              erc20Abi,
              provider
            ) as TokenAbiETHMainnet
            balance = (await coinContract.balanceOf(address)).toNumber()
          } else {
            balance = (await provider.getBalance(address)).toNumber()
          }
          setCoinsBalance((previousState) => {
            return { ...previousState!, [coin]: balance }
          })
        })
      )
    }
    getCoinBalances()
  }, [address])

  return (
    <ul className='flex gap-4 justify-around'>
      {typedKeys(coinSwitch).map((coin) => (
        <li>
          <OptimizedImage
            width={100}
            height={100}
            src={coinSwitch[coin].img}
            className={
              coinsBalance && coinsBalance[coin] > 0 ? '' : 'grayscale'
            }
          />
        </li>
      ))}
    </ul>
  )
}

export default PurchaseCoinList
