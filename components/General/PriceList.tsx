import { Metaverse } from '../../lib/enums'
import { IPredictions } from '../../lib/types'

interface PriceProps {
  predictions: IPredictions
  metaverse: Metaverse
}

const PriceList = ({ predictions, metaverse }: PriceProps) => {
  return (
    <div className='flex flex-col self-start flex-grow min-w-max pt-2 pl-5'>
      <p className='text-gray-200 font-medium pb-1 w-full'>Price Estimation:</p>

      <div
        className={`flex ${
          !predictions.ethPrediction && 'invisible'
        } space-x-4 items-center w-full justify-start py-2 h-full`}
      >
        <img
          src='/images/ethereum-eth-logo.png'
          className='rounded-full  h-9 md:h-10 w-9 md:w-10 p-1 shadow-button'
        />
        <p className='text-xl md:text-2xl font-medium text-gray-300 pt-0.5'>
          {predictions.ethPrediction.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}{' '}
          <span className='font-light text-lg md:text-xl'>ETH</span>
        </p>
      </div>

      <div
        className={`flex ${
          !predictions.usdPrediction && 'invisible'
        } space-x-4 items-center w-full justify-start py-2 h-full`}
      >
        <img
          src='/images/usd-coin-usdc-logo.png'
          className='rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button'
        />
        <p className='text-xl md:text-2xl font-medium text-gray-300 pt-0.5'>
          {predictions.usdPrediction.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}{' '}
          <span className='font-light text-lg md:text-xl'>USDC</span>
        </p>
      </div>

      {metaverse === Metaverse.SANDBOX && (
        <div
          className={`flex ${
            !predictions.sandPrediction && 'invisible'
          } space-x-4 items-center w-full justify-start py-2 h-full`}
        >
          <img
            src='/images/the-sandbox-sand-logo.png'
            className='rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button'
          />
          <p className='text-xl md:text-2xl font-medium text-gray-300 pt-0.5'>
            {predictions.sandPrediction?.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{' '}
            <span className='font-light text-lg md:text-xl'>SAND</span>
          </p>
        </div>
      )}

      {metaverse === Metaverse.DECENTRALAND && (
        <div
          className={`flex ${
            !predictions.manaPrediction && 'invisible'
          } space-x-4 items-center w-full justify-start py-2 h-full`}
        >
          <img
            src='/images/decentraland-mana-logo.png'
            className='rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button'
          />
          <p className='text-xl md:text-2xl font-medium text-gray-300 pt-0.5'>
            {predictions.manaPrediction?.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{' '}
            <span className='font-light text-lg md:text-xl'>MANA</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default PriceList
