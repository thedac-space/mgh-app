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
  const mobile = window.innerWidth < 640
  const [expanded, setExpanded] = useState(mobile)
  const imgSize = mobile ? 170 : expanded ? 170 : 70
  const [prices, setPrices] = useState<Partial<IPredictions>>({
    usdPrediction: predictions.usdPrediction,
  })

  const handleExpanded = () => {
    window.innerWidth < 640 ? setExpanded(true) : setExpanded(!expanded)
  }

  useEffect(() => {
    if (expanded) {
      setPrices(predictions)
    } else {
      setPrices({ usdPrediction: predictions.usdPrediction })
    }
    const setSizes = () => {
      const mobile = window.innerWidth < 640
      setExpanded(mobile)
    }
    window.addEventListener('resize', setSizes)

    return () => window.removeEventListener('resize', setSizes)
  }, [expanded])

  return (
    <li
      onClick={handleExpanded}
      className='gray-box p-4 hoverlift hover:bg-opacity-20 flex xs:w-[22rem] sm:w-full sm:flex-row flex-col cursor-pointer text-white items-start relative justify-between gap-4 sm:gap-0 '
    >
      {/* LEFT */}
      <div className='flex flex-row sm:justify-start gap-4 sm:w-fit w-full  transition-all'>
        {/* Image Link */}
        <a
          href={apiData?.external_link}
          target='_blank'
          className='hover:shadow-dark relative flex'
        >
          <OptimizedImage
            height={imgSize}
            width={imgSize}
            src={apiData.images.image_url}
            rounded='lg'
          />
          <FiExternalLink className='absolute top-0 right-0 text-white text-xs backdrop-filter backdrop-blur-sm rounded-xl w-6 h-6 p-1' />
        </a>
        {/* Main Land Info */}
        <div className='flex flex-col justify-between'>
          <div>
            {/* <h3 className='text-base sm:text-2xl p-0 leading-4'>{apiData?.name}</h3> */}
            <p className='sm:text-2xl'>{apiData?.name}</p>
            <p className='text-gray-400'>ID: {apiData?.tokenId}</p>
          </div>
          {expanded && (
            <>
              {/* External Links */}
              <nav className='flex flex-col gap-2'>
                <ExternalLink href={apiData.opensea_link} text='OpenSea' />
                <ExternalLink
                  href={apiData.external_link}
                  text={apiData.metaverse}
                />
              </nav>
              {/* Remove Button */}
              <button
                className='relative hover:text-red-600 transition font-medium ease-in-out rounded-b-xl flex gap-1 text-sm text-white z-20'
                onClick={() => remove(Number(apiData.tokenId))}
              >
                <span>Remove</span>
                <FaTrash className='relative -bottom-005' />
              </button>
            </>
          )}
        </div>
      </div>
      {/* RIGHT */}
      <div className='transition-all sm:relative static bottom-1'>
        {/* Price List */}
        <PriceList predictions={prices} />
        {/* Current Listing Price */}
        <p className='text-md text-gray-400 sm:text-right pt-2 sm:pt-0'>
          {isNaN(currentPrice!) ? 'Not Listed' : `Listed: ${currentPrice} USDC`}
        </p>
      </div>
    </li>
  )
}

export default React.memo(LandItem)
