import { PriceList } from '.'
import { IPriceCard } from '../../lib/valuation/valuationTypes'
import { ExternalAssetLink } from './Links'

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

  return (
    <div
      className={`${showCard ? 'animate__fadeIn' : 'hidden'} ${
        processing && 'animate__fadeOut animate__fast'
      } animate__animated flex gap-8 flex-col w-full ${verticalUnder}:flex-row justify-between `}
    >
      {/* LEFT/TOP */}
      <ExternalAssetLink apiData={apiData} layout='responsive' />
      {/* RIGHT/BOTTOM - PriceList */}
      <div className='w-full'>
        <h4 className='border-none text-white'>Price Estimation:</h4>
        <PriceList predictions={predictions} />
      </div>
    </div>
  )
}

export default HorizontalPriceCard
