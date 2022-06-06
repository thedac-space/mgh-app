import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import {
  PurchaseKeyFeatures,
  PurchaseOptionButton,
} from '../components/Purchase'

const Purchase: NextPage = () => {
  return (
    <>
      <Head>
        <title>MGH | Purchase</title>
        <meta name='description' content='Purchase VIP Status' />
      </Head>
      <section className='text-gray-200'>
        {/* Header */}
        <h1 className='text-4xl'>Unlock premium Metaverse Tools!</h1>
        {/* Role Sign */}
        <div>
          <h3>Role: "Premium"</h3>
          <p>Active until: 12.12.2012</p>
        </div>
        {/* Purchase Options */}
        <div className='flex gap-4'>
          {([1, 3, 12] as const).map((option) => (
            <PurchaseOptionButton key={option} option={option} />
          ))}
        </div>

        {/* Features */}
        <PurchaseKeyFeatures />
      </section>
    </>
  )
}

export default Purchase
