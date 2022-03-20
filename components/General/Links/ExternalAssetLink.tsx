import { FiExternalLink } from 'react-icons/fi'
import { ExternalLink } from '.'
import { OptimizedImage } from '..'
import { IAPIData } from '../../../lib/types'
import { handleTokenID } from '../../../lib/valuation/valuationUtils'
interface Props {
  apiData: IAPIData
  width?: number
  height?: number
  layout?: 'intrinsic' | 'fixed' | 'fill' | 'responsive' | undefined
}
const ExternalAssetLink = ({ apiData, width, height, layout }: Props) => {
  return (
    <div className='w-full relative flex lg:flex-col gap-3 lg:gap-4 xl:gap-6'>
      {/* External Img Link */}
      <a
        href={apiData.external_link}
        target='_blank'
        className='hover:shadow-dark block relative w-[50vw] xs:w-32 sm:w-36 lg:w-full h-full'
      >
        <OptimizedImage
          src={apiData.images.image_url}
          rounded='lg'
          layout={layout}
          width={width || 150}
          height={height || 150}
        />

        <FiExternalLink className='absolute top-0 right-0 text-white text-xs backdrop-filter backdrop-blur-sm rounded-xl w-6 h-6 p-1' />
      </a>

      {/* Links and Info */}
      <div className='flex flex-col gap-6 md:gap-3'>
        {/* Name and Id */}
        <div>
          {/* Asset Name */}
          <h3 className='text-base xs:text-xl lg:font-bold 2xl:text-2xl lg:text-2xl md:text-lg p-0 leading-4  text-gray-200'>
            {apiData.name}
          </h3>
          {/* Asset ID */}
          <p className='text-xs text-gray-400'>
            Token ID: {handleTokenID(apiData.tokenId)}
          </p>
        </div>
        {/* External Links */}
        <div className='flex flex-col lg:flex-row gap-5 lg:items-center'>
          <ExternalLink
            // className='text-xs md:text-sm'
            href={apiData.opensea_link}
            text='OpenSea'
          />
          <ExternalLink
            href={apiData.external_link}
            text={
              apiData.metaverse[0].toUpperCase() +
              apiData.metaverse.substring(1)
            }
          />
        </div>
      </div>
    </div>
  )
}

export default ExternalAssetLink
