import { FiShare2 } from 'react-icons/fi'
import { PriceList, SharePopup } from '.'
import { IPriceCard } from '../../lib/valuation/valuationTypes'
import { ExternalAssetLink } from './Links'
import { useVisible } from '../../lib/hooks'
import { Fade } from 'react-awesome-reveal'
import { BsTwitter } from 'react-icons/bs'
import { SocialMediaOptions } from '../../lib/socialMediaOptions'

const HorizontalPriceCard = ({
  showCard,
  processing,
  apiData,
  predictions,
  verticalUnder,
}: IPriceCard) => {
  if (!apiData || !predictions) {
    return <></>
  }

  // SocialMediaOptions contains all options with their texts, icons, etc..
  const options = SocialMediaOptions(apiData, predictions)
  return (
    <div
      className={`${showCard ? 'animate__fadeIn' : 'hidden'} ${
        processing && 'animate__fadeOut animate__fast'
      } animate__animated flex gap-6 flex-col w-full ${verticalUnder}:flex-row justify-between relative`}
    >
      {/* LEFT/TOP */}
      <ExternalAssetLink apiData={apiData} layout='responsive' />
      {/* RIGHT/BOTTOM - PriceList */}
      <div className='w-full'>
        <h4 className='border-none text-white mb-4'>Price Estimation:</h4>
        <PriceList predictions={predictions} />
      </div>
      <BsTwitter
        title='Share Valuation'
        onClick={() => window.open(options.twitter.valuationLink)}
        className='absolute h-5 w-5 bottom-0 right-0 text-gray-200 hover:text-blue-400 transition ease-in-out duration-300 cursor-pointer'
      />
      {/* Share POPUP, using only Twitter Icon for now */}
      {/* <div className='contents' ref={ref}>
        {showPopup && (
          <Fade className='z-10 absolute -bottom-3 left-1/2 -translate-x-2/4'>
            <SharePopup
              apiData={apiData}
              sharing='valuation'
              predictions={predictions}
              onPopupSelect={() => setIsVisible(false)}
            />
          </Fade>
        )}
      </div> */}
    </div>
  )
}

export default HorizontalPriceCard
