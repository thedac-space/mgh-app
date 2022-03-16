import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { FaEthereum } from 'react-icons/fa'
import { Metaverse } from '../lib/enums'
import { getLandData } from '../lib/valuation/valuationUtils'

const Map: NextPage = () => {
  const [lands, setLands] = useState<any[]>([])
  // 278784 Rough amount of squares
  useEffect(() => {
    const setData = async () => {
      console.log('setting')
      Promise.all(
        [...Array(200)].map(async (e, i) => {
          const land = await getLandData(Metaverse.SANDBOX, undefined, {
            X: String(i),
            Y: '31',
          })
          console.log({ land })
          setLands((previous) => [...previous, { ...land, x: i }])
        })
      )
      console.log({ lands })
    }
    setData()
  }, [])
  return (
    <section className='w-full h-full overflow-scroll'>
      <div className='map-grid'>
        {lands
          .sort((a, b) => a.x - b.x)
          .map((land, i) => (
            <div key={land.name} className='relative'>
              <div
                className={
                  (land.name
                    ? 'bg-green-600 hover:bg-purple-500'
                    : 'bg-black') +
                  ' text-white h-3 w-3 border border-white peer'
                }
              ></div>
              {land.name && (
                <div className='peer-hover:block hidden absolute z-10 bg-opacity-90 gray-box min-w-min text-center text-white '>
                  <span className='whitespace-nowrap'>{land.name}</span>
                  <span className='flex gap-1'>
                    {' '}
                    Price: <FaEthereum />
                    {land.prices.predicted_price.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  )
}

export default Map
