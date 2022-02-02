import { useEffect, useState } from 'react'
import { ExternalLink, OptimizedImage, PriceList } from '../General'
import { IPredictions } from '../../lib/types'
import { FiExternalLink } from 'react-icons/fi'
import { IPriceCard } from '../../lib/valuation/valuationTypes'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
interface IWatchListCard extends IPriceCard {
  currentPrice?: number
  remove: (arg: number) => void
}
const LandItem = ({
  apiData,
  predictions,
  currentPrice,
  remove,
}: IWatchListCard) => {
  const [expanded, setExpanded] = useState(false)
  const [prices, setPrices] = useState<Partial<IPredictions>>({
    usdPrediction: predictions.usdPrediction,
  })
  console.log(typeof apiData.tokenId)
  useEffect(() => {
    if (expanded) {
      setPrices(predictions)
    } else {
      setPrices({ usdPrediction: predictions.usdPrediction })
    }
  }, [expanded])
  return (
    <li className='gray-box p-4 hoverlift hover:bg-opacity-20'>
      <div
        onClick={() => setExpanded(!expanded)}
        className='flex cursor-pointer text-white items-start relative justify-between w-full '
      >
        {/* LEFT */}
        <div className='flex gap-4 transition-all'>
          <a
            href={apiData?.external_link}
            target='_blank'
            className='hover:shadow-dark relative flex'
          >
            <OptimizedImage
              height={expanded ? 170 : 70}
              width={expanded ? 170 : 70}
              src={apiData.images.image_url}
              rounded='lg'
            />
            <FiExternalLink className='absolute top-0 right-0 text-white text-xs backdrop-filter backdrop-blur-sm rounded-xl w-6 h-6 p-1' />
          </a>
          <div className='flex flex-col justify-between'>
            <div>
              <p className='text-2xl'>{apiData?.name}</p>
              <p className='text-md text-gray-400'>ID: {apiData?.tokenId}</p>
            </div>
            {expanded && (
              <>
                <nav className='flex flex-col gap-2'>
                  <ExternalLink href={apiData.opensea_link} text='OpenSea' />
                  <ExternalLink
                    href={apiData.external_link}
                    text={apiData.metaverse}
                  />
                </nav>
                <button
                  className='rounded-b-xl flex gap-2 text-white z-20'
                  onClick={() => remove(Number(apiData.tokenId))}
                >
                  <span>Remove</span>
                  <FaTrash className='text-white' />
                </button>
              </>
            )}
          </div>
        </div>
        {/* RIGHT */}
        <div className='transition-all'>
          <PriceList predictions={prices} />
          <p className='text-md text-gray-400 text-right'>
            {isNaN(currentPrice!)
              ? 'Not Listed'
              : `Listed: ${currentPrice} USDC`}
          </p>
        </div>
      </div>
    </li>
  )
}

export default React.memo(LandItem)
