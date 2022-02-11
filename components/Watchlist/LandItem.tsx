import { useEffect, useState } from 'react'
import { ExternalLink, OptimizedImage, PriceList, SharePopup } from '../General'
import { IPredictions } from '../../lib/types'
import { FiExternalLink, FiShare2 } from 'react-icons/fi'
import { IPriceCard } from '../../lib/valuation/valuationTypes'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { Fade } from 'react-awesome-reveal'
import { useVisible } from '../../lib/hooks'
import { Metaverse } from '../../lib/enums'
import { handleTokenID } from '../../lib/valuation/valuationUtils'
interface IWatchListCard extends IPriceCard {
  currentPrice?: number
  remove: (landId: string, metaverse: Metaverse) => Promise<void>
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
    usdPrediction: predictions?.usdPrediction,
  })

  // Hook for Popup
  const { ref, isVisible: showPopup, setIsVisible } = useVisible(false)
  // Mobile view is always expanded
  const handleExpanded = () => {
    window.innerWidth < 640 ? setExpanded(true) : setExpanded(!expanded)
  }
  const notListed = isNaN(currentPrice!)

  useEffect(() => {
    // Changing the ammount of prices shown depending of expanded state
    if (expanded) {
      setPrices(predictions!)
    } else {
      setPrices({ usdPrediction: predictions?.usdPrediction })
    }
    // Img sizes
    const setSizes = () => {
      const mobile = window.innerWidth < 640
      const between = window.innerWidth < 700
      setExpanded(mobile ? true : between ? false : expanded)
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
            src={apiData!.images.image_url}
            rounded='lg'
          />
          <FiExternalLink className='absolute top-0 right-0 text-white text-xs backdrop-filter backdrop-blur-sm rounded-xl w-6 h-6 p-1' />
        </a>
        {/* Main Land Info */}
        <div className='flex flex-col justify-between'>
          <div>
            <h3 className='text-base sm:text-xl font-normal md:text-2xl p-0 leading-4'>
              {apiData?.name}
            </h3>
            {/* <p className='sm:text-2xl'>{apiData?.name}</p> */}
            <p className='text-gray-400'>
              ID: {handleTokenID(apiData!.tokenId)}{' '}
              <FiShare2
                title='Share Valuation'
                onClick={() => setIsVisible(true)}
                className=' hidden sm:inline-block relative bottom-005  h-4 w-4 z-50 text-gray-200 hover:text-blue-400 transition ease-in-out duration-300 cursor-pointer'
              />{' '}
            </p>
          </div>
          {expanded && (
            <>
              {/* External Links */}
              <nav className='flex flex-col gap-2'>
                <ExternalLink href={apiData!.opensea_link} text='OpenSea' />
                <ExternalLink
                  href={apiData!.external_link}
                  text={apiData!.metaverse}
                />
              </nav>
              {/* Remove Button */}
              <button
                className='relative transition font-medium  ease-in-out flex gap-1 text-sm hover:text-red-500 text-red-600 z-20'
                onClick={() => remove(apiData!.tokenId, apiData!.metaverse)}
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
        <p
          className={`text-md text-left sm:text-right pt-2 sm:pt-0  relative left-1 sm:left-0 ${
            !notListed
              ? 'relative top-2 font-medium text-green-500'
              : 'text-gray-400 sm:static'
          }`}
        >
          {notListed ? 'Not Listed' : `Listed: ${currentPrice} USDC`}
        </p>
      </div>

      {/* Share Button */}
      <FiShare2
        title='Share Valuation'
        onClick={() => setIsVisible(true)}
        className='absolute sm:hidden h-5 w-5 z-30 bottom-4 right-4 text-gray-200 hover:text-blue-400 transition ease-in-out duration-300 cursor-pointer'
      />
      {/* Share Popup */}
      <div className='contents' ref={ref}>
        {showPopup && (
          <Fade className='z-30 absolute -bottom-3 left-1/2 -translate-x-2/4'>
            <SharePopup
              apiData={apiData}
              sharing='valuation'
              predictions={predictions}
              onPopupSelect={() => setIsVisible(false)}
            />
          </Fade>
        )}
      </div>
    </li>
  )
}

export default React.memo(LandItem)
