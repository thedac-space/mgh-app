import { OptimizedImage } from '.'
import { IPredictions } from '../../lib/types'

const COINS = {
  ethPrediction: {
    src: '/images/ethereum-eth-logo.png',
    name: 'ETH',
  },
  usdPrediction: {
    src: '/images/usd-coin-usdc-logo.png',
    name: 'USDC',
  },
  sandPrediction: {
    src: '/images/the-sandbox-sand-logo.png',
    name: 'SAND',
  },
  manaPrediction: {
    src: '/images/decentraland-mana-logo.png',
    name: 'MANA',
  },
}

type coinKey =
  | 'manaPrediction'
  | 'sandPrediction'
  | 'usdPrediction'
  | 'ethPrediction'

interface Props {
  predictions: Partial<IPredictions>
  className?: string
}

const PriceList = ({ predictions, className }: Props) => {
  const keys = Object.keys(predictions) as coinKey[]
  return (
    <ul className={'flex flex-col flex-grow min-w-max gap-4 ' + className}>
      {/* Iterating through each Coin.  */}
      {keys.map((key) => (
        <li
          key={COINS[key].name}
          className='animate-fade-in-slow flex gap-4 items-center w-full justify-start h-full'
        >
          {/* Coin Image */}
          <img
            src={COINS[key].src}
            className='rounded-full  h-9 md:h-10 w-9 md:w-10 p-1 shadow-button'
            loading='lazy'
          />
          {/* Coin Prediction Number */}
          <p className='text-xl 2xl:text-2xl font-medium text-gray-300 pt-0.5'>
            {predictions[key]?.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
            {/* Coin Name */}
            <span className='font-light text-lg md:text-xl'>
              {' ' + COINS[key].name}
            </span>
          </p>
        </li>
      ))}
    </ul>
  )
}

export default PriceList
