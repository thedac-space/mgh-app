import { FiExternalLink } from 'react-icons/fi'
import { ExternalLink, PriceList } from '.'
import { IPriceCard } from '../../lib/valuation/valuationTypes'
import { handleTokenID } from '../../lib/valuation/valuationUtils'
import Image from 'next/image'

const HorizontalPriceCard = ({
  showCard,
  processing,
  apiData,
  predictions,
}: IPriceCard) => {
  if (!apiData || !predictions) {
    return <></>
  }

  return (
    <div
      className={`${showCard ? 'animate__fadeIn' : 'hidden'} ${
        processing && 'animate__fadeOut animate__fast'
      } animate__animated flex gap-8 flex-col sm:flex-col lg:flex-row justify-between `}
    >
      {/* LEFT/TOP */}
      <div className='w-full relative'>
        {/* External Img Link */}
        <a
          href={apiData.external_link}
          target='_blank'
          className='hover:shadow-dark'
        >
          <Image
            placeholder='blur'
            blurDataURL={apiData.images.image_url}
            src={apiData.images.image_url}
            width={150}
            layout='responsive'
            height={150}
            loading='lazy'
            objectFit='cover'
            className='rounded-lg'
          />
          <FiExternalLink className='absolute top-0 right-0 text-white text-xs backdrop-filter backdrop-blur-sm rounded-xl w-6 h-6 p-1' />
        </a>
        {/* Asset Name */}
        <p className='text-xl 2xl:text-2xl font-bold text-gray-200 pt-3'>
          {apiData.name}
        </p>
        {/* Asset ID */}
        <p className='text-xs text-gray-400 pb-3'>
          Token ID: {handleTokenID(apiData.tokenId)}
        </p>
        {/* Links */}
        <nav className='flex space-x-5 items-center'>
          <ExternalLink href={apiData.opensea_link} text='OpenSea' />
          <ExternalLink href={apiData.external_link} text={apiData.metaverse} />
        </nav>
      </div>
      {/* RIGHT/BOTTOM - PriceList */}
      <div className='w-full'>
        <h4 className='border-none text-white'>Price Estimation:</h4>
        <PriceList predictions={predictions} />
      </div>
    </div>
  )
}

export default HorizontalPriceCard
