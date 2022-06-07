import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import {
  PurchaseCoinList,
  PurchaseKeyFeatures,
  PurchaseOptionButton,
  PurchaseRoleSign,
} from '../components/Purchase'

const Purchase: NextPage = () => {
  return (
    <>
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
      </section>
    </>
  )
}

export default Purchase
