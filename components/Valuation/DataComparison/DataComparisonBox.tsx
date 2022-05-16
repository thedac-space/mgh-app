import React from 'react'
import { useState, useEffect } from 'react'
import { IAPIData, IPredictions } from '../../../lib/types'

interface Props {
  apiData: IAPIData | undefined
  predictions: IPredictions | undefined
}

function getAssetData(apiData: IAPIData | undefined) {
  const metaverse = apiData?.metaverse
  let tokenID: String | undefined
  if (metaverse != 'axie-infinity') {
    tokenID = apiData?.tokenId
  }
  const X = apiData?.coords.x
  const Y = apiData?.coords.y
  return { metaverse, tokenID, X, Y }
}

/**
 * Box that shows comparison of real and prediction price of a land
 */
const DataComparisonBox = ({ apiData, predictions }: Props) => {
  const [lastPrice, setLastPrice] = useState<number>()
  const [showOffer, setShowOffer] = useState<Boolean>(false)
  const ethPredictionPrice = predictions?.ethPrediction
  const currentPriceEth = apiData?.current_price_eth
  const listed = currentPriceEth

  const handleData = async (getOffer: boolean) => {
    const { metaverse, tokenID, X, Y } = getAssetData(apiData)
    let res
    // if getOffer search offers on opensea, else search last sale price on itrm
    if (getOffer) {
      res = await fetch(
        `/api/getLandOffers?metaverse=${metaverse}&tokenID=${tokenID}&flag=${getOffer}`,
        {
          method: 'GET',
        }
      )
    }
    // axie infinity needs search by coords
    else if (metaverse == 'axie-infinity') {
      res = await fetch(
        `/api/getLandOffers?metaverse=${metaverse}&X=${X}&Y=${Y}`
      )
    } else {
      res = await fetch(
        `/api/getLandOffers?metaverse=${metaverse}&tokenID=${tokenID}`
      )
    }
    const data = await res.json()
    return data
  }

  useEffect(() => {
    if (currentPriceEth) return
    // let data = handleData(false)
    // data
    //   .then((res) => {
    //     let ethPrice =
    //       res?.prices?.history[res?.prices?.history.length - 1]?.price
    //     if (ethPrice) {
    //       setLastPrice(ethPrice)
    //     } else {
    //       setLastPrice(0)
    //     }
    //     setShowOffer(false)
    //   })
    //   .catch((err) => console.log(err))

    // // if we cant retrieve last sale price, we search for best offer
    // if (!lastPrice) {
    //   data = handleData(true)
    //   data
    //     .then((res) => {
    //       let offerPrice = res?.offers[0]?.current_price
    //       offerPrice = parseFloat(offerPrice) / 1e18
    //       if (offerPrice) {
    //         setLastPrice(offerPrice)
    //         setShowOffer(true)
    //       } else {
    //         setLastPrice(0)
    //       }
    //     })
    //     .catch((err) => console.log(err))
    // }
  }, [apiData])

  let comparedValue = 0
  if (ethPredictionPrice && currentPriceEth) {
    comparedValue = (currentPriceEth / ethPredictionPrice) * 100
    // comparedValue =
    //   ((currentPriceEth - ethPredictionPrice) /
    //     ((ethPredictionPrice + currentPriceEth) / 2)) *
    //   100
    comparedValue = parseFloat(comparedValue.toFixed())
  }
  const isUnderValued = comparedValue < 100

  return (
    /* Current Listing Price */
    <div>
      <div className='relative left-1  flex gap-2 flex-col pt-4 text-md text-left font-medium '>
        <p className={listed ? 'text-green-500' : 'text-gray-400 '}>
          {listed ? `Listed: ${currentPriceEth?.toFixed(2)} ETH` : 'Not Listed'}
        </p>

        {listed && (
          <p className={isUnderValued ? 'text-blue-400' : 'text-red-400'}>
            {comparedValue}% of Predicted Price
          </p>
        )}
      </div>
    </div>
    // <div className='mt-4 text-xl font-medium text-gray-300 pt-0.5'>
    //   {lastPrice && !showOffer ? (
    //     <ul className='flex flex-col flex-grow min-w-max gap-4'>
    //       <li className='animate-fade-in-slow flex gap-4 items-center w-full justify-start h-full '>
    //         Last sale price:
    //         <img
    //           src='/images/ethereum-eth-logo.png'
    //           className='rounded-full  h-9 xl:h-10 w-9 xl:w-10 p-1 shadow-button'
    //           loading='lazy'
    //         />{' '}
    //         {lastPrice}
    //         <span className='font-light text-lg md:text-xl'> ETH</span>
    //       </li>
    //       <li className='font-bold'>
    //         <div className={isUnderValued ? 'text-green-500' : 'text-red-500'}>
    //           {comparedValue}% {isUnderValued ? 'undervalued' : 'overvalued'}
    //         </div>
    //       </li>
    //     </ul>
    //   ) : lastPrice && showOffer ? (
    //     <ul>
    //       <li className='animate-fade-in-slow flex gap-4 items-center w-full justify-start h-full '>
    //         Best Offer:
    //         <img
    //           src='/images/ethereum-eth-logo.png'
    //           className='rounded-full  h-9 xl:h-10 w-9 xl:w-10 p-1 shadow-button'
    //           loading='lazy'
    //         />{' '}
    //         {lastPrice}
    //         <span className='font-light text-lg md:text-xl'> ETH</span>
    //       </li>
    //     </ul>
    //   ) : (
    //     <div>We can't retrieve land's prices :(</div>
    //   )}
    // </div>
  )
}

export default DataComparisonBox
