import { BsTwitter } from 'react-icons/bs'
import { FiExternalLink } from 'react-icons/fi'
import { SocialMediaOptions } from '../lib/socialMediaOptions'
import { IAPIData, IPredictions } from '../lib/types'
import { ellipseAddress } from '../lib/utilities'
import { useAppSelector } from '../state/hooks'
import { PriceList } from './General'
import { AddToWatchlistButton, LandLikeBox } from './Valuation'

export interface PriceCardProps {
  showCard: boolean
  processing: boolean
  apiData: IAPIData | undefined
  predictions: IPredictions | undefined
}

const PriceCard = ({
  showCard,
  processing,
  apiData,
  predictions,
}: PriceCardProps) => {
  const { address } = useAppSelector((state) => state.account)
  const options = SocialMediaOptions(apiData, predictions)

  if (!apiData || !predictions) {
    return <></>
  }

  const handleTokenID = (tokenID: string) => {
    if (tokenID.toString().length > 6) {
      return ellipseAddress(tokenID.toString(), 3)
    } else {
      return tokenID
    }
  }

  return (
    <div
      className={`${showCard ? 'animate__fadeIn' : 'hidden'} ${
        processing && 'animate__fadeOut animate__fast'
      } animate__animated relative w-full h-full space-y-5 flex flex-col items-center`}
    >
      {/* Image and Name + Links Wrapper */}
      <div className='w-full justify-center flex gap-4'>
        {/* Image */}
        <a
          href={apiData.external_link}
          target='_blank'
          className='w-full h-full relative hover:shadow-dark'
        >
          <img
            src={apiData.images?.image_url}
            className='rounded-md object-cover min-h-[159px] w-full h-full'
          />
          <FiExternalLink className='absolute top-1 right-1 text-white text-xs backdrop-filter backdrop-blur-sm rounded-xl w-6 h-6 p-1' />
        </a>
        {/* Text Wrapper  */}
        <div className='w-full flex flex-col justify-between'>
          {/* Land Name & Id */}
          <div>
            {/* Land Name */}
            <p className='text-lg mb-2 font-semibold whitespace-nowrap text-gray-200'>
              {apiData.name}
            </p>
            {/* Token Id */}
            <p className='text-xs flex-nowrap text-gray-400 flex gap-2'>
              Token ID: {handleTokenID(apiData.tokenId)}
              {/* <BsTwitter
                        title='Share Valuation'
                        onClick={() => window.open(options.twitter.valuationLink)}
                        className='h-4 w-4 relative bottom-[0.1rem] text-gray-200 hover:text-blue-400 transition ease-in-out duration-300 cursor-pointer'
                        /> */}
            </p>
          </div>
          {/* Add To Watchlist Button */}
          {address && (
            <AddToWatchlistButton
              landId={apiData.tokenId}
              metaverse={apiData.metaverse}
            />
          )}
          {/* Links */}
          <div className='flex flex-col gap-1 justify-center'>
            {/* Open Sea Link */}
            {apiData.metaverse !== 'axie-infinity' && (
              <a
                href={apiData.opensea_link}
                target='_blank'
                className='flex items-center max-w-max space-x-1 text-gray-300 text-sm hover:text-blue-400 transition duration-300 ease-in-out'
              >
                <p className='font-medium'>Opensea</p>
                <FiExternalLink className='mb-0.5' />
              </a>
            )}
            {/* Metaverse Link */}
            <a
              href={apiData.external_link}
              target='_blank'
              className='flex items-center max-w-max space-x-1 text-gray-300 text-sm hover:text-blue-400 transition duration-300 ease-in-out'
            >
              <p className='font-medium capitalize'>{apiData.metaverse}</p>
              <FiExternalLink className='mb-0.5' />
            </a>
          </div>
        </div>
      </div>

      <hr className='block border-gray-500 w-5/6' />
      {/* Price Estimation */}
      <div className='flex flex-col self-start flex-grow min-w-max'>
        <p className='text-gray-200 font-medium pb-1 w-full'>
          Price Estimation:
        </p>

        <div>
          <PriceList predictions={predictions} metaverse={apiData.metaverse} />
        </div>
      </div>

      {/* Likes */}
      <div className='flex flex-start w-full'>
        <LandLikeBox
          landId={apiData.tokenId}
          metaverse={apiData.metaverse}
          twitterLink={options.twitter.valuationLink}
        />
      </div>
    </div>
  )
}

export default PriceCard
