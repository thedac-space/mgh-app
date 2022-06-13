import { ethers } from 'ethers'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { useContext, useEffect } from 'react'
import {
  PurchaseBuyForm,
  PurchaseCoinList,
  purchaseCoinOptions,
  PurchaseKeyFeatures,
  PurchaseOptionButton,
  PurchaseRoleSign,
} from '../components/Purchase'
import {
  purchaseContext,
  PurchaseProvider,
} from '../components/Purchase/purchaseContext'
import { createERC20Contract } from '../lib/erc20utils'
import { makeOwnProvider, typedKeys } from '../lib/utilities'
import { useAppSelector } from '../state/hooks'

const Purchase: NextPage = () => {
  const { address } = useAppSelector((state) => state.account)
  const { setCoinsBalance } = useContext(purchaseContext)

  useEffect(() => {
    const getCoinBalances = async () => {
      if (!address) return

      // Retrieving coin Balances from user
      await Promise.allSettled(
        typedKeys(purchaseCoinOptions).map(async (coin) => {
          let balance = NaN
          const provider = makeOwnProvider(purchaseCoinOptions[coin].chain)
          if (!['eth', 'matic'].includes(coin)) {
            const coinContract = createERC20Contract(
              provider,
              purchaseCoinOptions[coin].contractAddress
            )
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
    <PurchaseProvider>
      <Head>
        <title>MGH | Purchase</title>
        <meta name='description' content='Purchase VIP Status' />
      </Head>
      <section className='text-gray-200 max-w-7xl'>
        {/* Header */}
        <h1 className='text-center md:text-4xl lg:text-5xl text-3xl green-text-gradient mb-8'>
          Unlock premium Metaverse Tools!
        </h1>
        {/* Role Sign */}
        <PurchaseRoleSign />
        {/* Purchase Options */}
        <div className='flex gap-4 mb-8 justify-around'>
          {([1, 3, 12] as const).map((option) => (
            <PurchaseOptionButton key={option} option={option} />
          ))}
        </div>
        {/* Features */}
        <PurchaseKeyFeatures />
        {/* Coin List */}
        <PurchaseCoinList />
        {/* Buy Form */}
        <PurchaseBuyForm />
      </section>
    </PurchaseProvider>
  )
}

export default Purchase
