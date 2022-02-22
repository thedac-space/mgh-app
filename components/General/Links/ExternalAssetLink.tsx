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
    <div className='w-full relative'>
      {/* External Img Link */}
      <a
        href={apiData.external_link}
        target='_blank'
        className='hover:shadow-dark'
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
      {/* Asset Name */}
      <p className='text-xl 2xl:text-2xl font-bold text-gray-200 pt-3'>
        {apiData.name}
      </p>
      {/* Asset ID */}
      <p className='text-xs text-gray-400 pb-3'>
        Token ID: {handleTokenID(apiData.tokenId)}
      </p>
      {/* External Links */}
      <nav className='flex space-x-5 items-center'>
        <ExternalLink href={apiData.opensea_link} text='OpenSea' />
        <ExternalLink
          href={apiData.external_link}
          text={
            apiData.metaverse[0].toUpperCase() + apiData.metaverse.substring(1)
          }
        />
      </nav>
    </div>
  )
}

export default ExternalAssetLink
