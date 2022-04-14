import { useEffect, useState } from 'react'
import { RiLoader3Fill } from 'react-icons/ri'
import { ExternalLink, OptimizedImage, PriceList } from '../General'
import { IAPIData, IPredictions } from '../../lib/types'
import { FiExternalLink } from 'react-icons/fi'
import React from 'react'
import { Metaverse } from '../../lib/enums'
import { handleLandName } from '../../lib/valuation/valuationUtils'
import { BsTwitter } from 'react-icons/bs'
import Loader from '../Loader'
import { formatMetaverseName, getState } from '../../lib/utilities'
import { AddToWatchlistButton } from '../Valuation'
import { useAppSelector } from '../../state/hooks'
import { IoClose } from 'react-icons/io5'
import { HEATMAP_STATE } from '../../pages/heatmap'
interface Props {
  apiData?: IAPIData
  predictions?: IPredictions
  currentPrice?: number
  landCoords?: { x: string | number; y: string | number }
  metaverse: Metaverse
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  mapState: keyof typeof HEATMAP_STATE
}
const MapCard = ({
  apiData,
  predictions,
  currentPrice,
  landCoords,
  metaverse,
  setIsVisible,
  mapState,
}: Props) => {
  const imgSize = 150
  const [loadingQuery, loadedQuery, errorQuery] = getState(mapState, [
    'loadingQuery',
    'loadedQuery',
    'errorQuery',
  ])
  const notListed = !currentPrice || isNaN(currentPrice)
  const { address } = useAppSelector((state) => state.account)

  useEffect(() => {}, [])
  return errorQuery ? (
    <div className='gray-box bg-opacity-100'>
      <p className='text-lg font-semibold text-center text-gray-200'>
        No a Valid Land or not enough Data yet!
      </p>
    </div>
  ) : (
    <div className='gray-box py-4 px-4 flex flex-col cursor-pointer text-white items-start justify-between gap-4 bg-opacity-100 md:min-h-[362px] md:min-w-[359px] relative'>
      {loadingQuery ? (
        <div className='w-full flex flex-col gap-14 absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4'>
          <Loader />
          <p className='text-lg font-semibold text-center text-gray-200'>
            Calculating
          </p>
        </div>
      ) : (
        loadedQuery &&
        apiData &&
        landCoords && (
          <>
            <IoClose
              className='absolute top-1 right-1 text-xl hover:text-red-500 transition-all'
              onClick={() => setIsVisible(false)}
            />
            {/* /* LEFT */}
            <div className='flex flex-row gap-4 w-full'>
              {/* Image Link */}
              <a
                href={apiData.external_link}
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
                  <h3 className='text-base font-normal md:text-2xl p-0 leading-4'>
                    {handleLandName(metaverse, {
                      x: landCoords.x,
                      y: landCoords.y,
                    })}
                  </h3>
                  <p className='text-gray-400'>
                    {/* ID: {handleTokenID(apiData.tokenId)}{' '} */}
                    <BsTwitter
                      title='Share Valuation'
                      // onClick={() => window.open(options.twitter.valuationLink)}
                      className=' hidden relative bottom-[0.17rem] left-1  h-4 w-4 z-50 text-gray-200 hover:text-blue-400 transition ease-in-out duration-300 cursor-pointer'
                    />{' '}
                  </p>
                </div>
                {/* Add To Watchlist Button */}
                {address && (
                  <AddToWatchlistButton
                    landId={apiData.tokenId}
                    metaverse={apiData.metaverse}
                  />
                )}
                {/* External Links */}
                <nav className='flex flex-col md:gap-4 gap-[1.40rem]'>
                  {apiData.opensea_link && (
                    <ExternalLink href={apiData.opensea_link} text='OpenSea' />
                  )}
                  <ExternalLink
                    href={apiData.external_link}
                    text={formatMetaverseName(metaverse)}
                  />
                </nav>
              </div>
            </div>
            {/* /* RIGHT */}
            <div className='transition-all static bottom-1'>
              {/* Price List */}
              {predictions ? (
                <PriceList metaverse={metaverse} predictions={predictions} />
              ) : errorQuery ? (
                <span>Not enough Data.</span>
              ) : (
                <span className='flex gap-2 text-lg'>
                  Fetching Predictions
                  <RiLoader3Fill className='animate-spin-slow h-5 w-5 xs:h-6 xs:w-6' />
                </span>
              )}
              {/* Current Listing Price */}
              <p
                className={`text-md text-left pt-2 relative left-1 ${
                  !notListed
                    ? 'relative top-2 font-medium text-green-500'
                    : 'text-gray-400 '
                }`}
              >
                {!currentPrice || isNaN(currentPrice)
                  ? 'Not Listed'
                  : `Listed: ${currentPrice.toFixed(2)} USDC`}
              </p>
            </div>
            <BsTwitter
              title='Share Valuation'
              className='absolute h-5 w-5 z-30 bottom-6 right-4 text-gray-200 hover:text-blue-400 transition ease-in-out duration-300 cursor-pointer'
            />
          </>
        )
      )}
    </div>
  )
}

export default React.memo(MapCard)
