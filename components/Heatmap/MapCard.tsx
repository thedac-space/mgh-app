import { useEffect, useState } from 'react'
import { ExternalLink, OptimizedImage, PriceList } from '../General'
import { IAPIData, IPredictions } from '../../lib/types'
import { FiExternalLink } from 'react-icons/fi'
import { ICoinPrices, IPriceCard } from '../../lib/valuation/valuationTypes'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { useVisible } from '../../lib/hooks'
import { Metaverse } from '../../lib/enums'
import {
  convertETHPrediction,
  getLandData,
  handleTokenID,
} from '../../lib/valuation/valuationUtils'
import { BsTwitter } from 'react-icons/bs'
import { SocialMediaOptions } from '../../lib/socialMediaOptions'
interface Props {
  x: string
  y: string
  metaverse: Metaverse
  prices: ICoinPrices
}
const MapCard = ({ x, y, metaverse, prices }: Props) => {
  const mobile = window.innerWidth < 640
  const [apiData, setApiData] = useState<IAPIData>()
  const [cardState, setCardState] = useState<'loading' | 'loaded' | 'error'>(
    'loading'
  )
  const [predictions, setPredictions] = useState<IPredictions>()
  const imgSize = 170

  // SocialMediaOptions contains all options with their texts, icons, etc..
  // const options = SocialMediaOptions(apiData, predictions)

  // const notListed = isNaN(currentPrice!)

  useEffect(() => {
    const setData = async () => {
      setCardState('loading')
      const landData = await getLandData(metaverse, undefined, { X: x, Y: y })
      console.log(x, y)
      // Converting Predictions
      if (!landData.prices) {
        console.log(landData)
        return setCardState('error')
      }
      const predictions = convertETHPrediction(
        prices,
        landData.prices.predicted_price,
        metaverse
      )
      setApiData(landData)
      setPredictions(predictions)
      setCardState('loaded')
      console.log(metaverse, landData, predictions)
    }
    setData()
  }, [])

  return (
    <div className='gray-box p-4 flex flex-col cursor-pointer text-white items-start justify-between gap-4 bg-opacity-100'>
      {cardState === 'loaded' && apiData && predictions && (
        <>
          {/* /* LEFT */}
          <div className='flex flex-row gap-4 w-full  transition-all'>
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
                  {apiData.name}
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
              {/* External Links */}
              <nav className='flex flex-col md:gap-4 gap-[1.40rem]'>
                {apiData.opensea_link && (
                  <ExternalLink href={apiData.opensea_link} text='OpenSea' />
                )}
                <ExternalLink
                  href={apiData.external_link}
                  text={
                    apiData.metaverse[0].toUpperCase() +
                    apiData.metaverse.substring(1)
                  }
                />
              </nav>
            </div>
          </div>
          {/* /* RIGHT */}
          <div className='transition-all static bottom-1'>
            {/* Price List */}
            <PriceList metaverse={metaverse} predictions={predictions} />
            {/* Current Listing Price */}
            <p
            // className={`text-md text-left pt-2 relative left-1 ${
            //   !notListed
            //     ? 'relative top-2 font-medium text-green-500'
            //     : 'text-gray-400 '
            // }`}
            >
              {/* {notListed ? 'Not Listed' : `Listed: ${currentPrice} USDC`} */}
            </p>
          </div>
          <BsTwitter
            title='Share Valuation'
            // onClick={() => window.open(options.twitter.valuationLink)}
            className='absolute h-5 w-5 z-30 bottom-6 right-4 text-gray-200 hover:text-blue-400 transition ease-in-out duration-300 cursor-pointer'
          />
        </>
      )}
    </div>
  )
}

export default React.memo(MapCard)
