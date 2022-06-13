import { BigNumber, ethers } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import React, { useContext, useEffect, useState } from 'react'
import changeChain from '../../backend/changeChain'
import useProvider from '../../backend/provider'
import { Chains } from '../../lib/chains'
import { createERC20Contract } from '../../lib/erc20utils'
import { ValueOf } from '../../lib/types'
import { makeOwnProvider } from '../../lib/utilities'
import { useAppSelector } from '../../state/hooks'
import { purchaseCoinOptions } from './purchaseCoinOptions'
import { purchaseContext } from './purchaseContext'

const PurchaseBuyForm = () => {
  const { address, chainId } = useAppSelector((state) => state.account)
  const { monthlyChoice, coin } = useContext(purchaseContext)
  const [allowance, setAllowance] = useState(NaN)
  const provider = useProvider()
  const mghWallet = '0x2CE9f1CA1650B495fF8F7A81BB55828A53bfdd5A' // change to proper address
  const isERC20 = coin && !['eth', 'matic'].includes(coin)

  const apiTokenNames = {
    eth: 'ethereum',
    matic: 'wmatic',
    mgh: 'metagamehub-dao',
    usdc: 'usd-coin',
    usdt: 'tether',
    ocean: 'ocean-protocol',
    sand: 'the-sandbox',
    mana: 'decentraland',
  } as const

  useEffect(() => {
    const getAllowance = async () => {
      if (!coin || !address || !isERC20) return setAllowance(NaN)
      const provider = makeOwnProvider(purchaseCoinOptions[coin].chain)
      const coinContract = createERC20Contract(
        provider,
        purchaseCoinOptions[coin].contractAddress
      )
      setAllowance(
        (await coinContract.allowance(address, mghWallet)).toNumber()
      )
    }
    getAllowance()
  }, [coin])
  const approveToken = async () => {
    if (!provider) return
    const ethersWeb3Provider = new ethers.providers.Web3Provider(provider)
    if (!coin || !monthlyChoice) return
    if (isERC20) {
      const coinContract = createERC20Contract(
        ethersWeb3Provider.getSigner(),
        purchaseCoinOptions[coin].contractAddress
      )
      const tx = await coinContract.approve(
        mghWallet,
        ethers.constants.MaxUint256
      )

      await tx.wait()
    }
  }

  const transferToken = async () => {
    if (!coin || !provider || !address || !monthlyChoice) return
    // Using wmatic instead of matic cause coingecko isn't working for matic..
    const coinRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox%2Cdecentraland%2Cocean-protocol%2Cmetagamehub-dao%2Cwmatic%2Cusd-coin%2Ctether&vs_currencies=usd`
    )
    const coinValues = (await coinRes.json()) as Record<
      ValueOf<typeof apiTokenNames>,
      { usd: number }
    >

    const ethersWeb3Provider = new ethers.providers.Web3Provider(provider)
    const convertedMonthlyChoice =
      monthlyChoice / coinValues[apiTokenNames[coin]].usd
    const amountToPay =
      convertedMonthlyChoice * 10 ** purchaseCoinOptions[coin].decimals
    if (isERC20) {
      const coinContract = createERC20Contract(
        ethersWeb3Provider.getSigner(),
        purchaseCoinOptions[coin].contractAddress
      )
      if (allowance < amountToPay) return
      const tx = await coinContract.transferFrom(
        address,
        mghWallet,
        amountToPay.toString().toString()
      )

      await tx.wait()
    }
  }

  return (
    <div>
      {/* Show Amount */}
      <h3>
        Total Amount {monthlyChoice} {coin?.toUpperCase()}
      </h3>

      <button
        onClick={approveToken}
        className='z-30 disabled:opacity-50 disabled:hover:shadow-dark disabled:cursor-default mt-4 relative flex justify-center items-center  transition ease-in-out duration-500 shadow-dark rounded-xl w-full max-w-md py-3 sm:py-4 group'
      >
        <div className='h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80' />
        <span className='pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl'>
          Approve Token
        </span>
      </button>
      <button
        onClick={transferToken}
        className='z-30 disabled:opacity-50 disabled:hover:shadow-dark disabled:cursor-default mt-4 relative flex justify-center items-center  transition ease-in-out duration-500 shadow-dark rounded-xl w-full max-w-md py-3 sm:py-4 group'
      >
        <div className='h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80' />
        <span className='pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl'>
          Buy
        </span>
      </button>
      {chainId !== Chains.MATIC_MAINNET.chainId && (
        <button
          onClick={() => {
            changeChain(provider, Chains.MATIC_MAINNET.chainId)
          }}
          className='z-30 disabled:opacity-50 disabled:hover:shadow-dark disabled:cursor-default mt-4 relative flex justify-center items-center  transition ease-in-out duration-500 shadow-dark rounded-xl w-full max-w-md py-3 sm:py-4 group'
        >
          <div className='h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80' />
          <span className='pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl'>
            Switch to Polygon
          </span>
        </button>
      )}
    </div>
  )
}

export default PurchaseBuyForm
