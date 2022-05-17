import React from 'react'
import { IPredictions } from '../../../lib/types'

interface Props {
  currentPriceEth?: number
  predictions?: IPredictions
}

/**
 * Box that shows comparison of current and predicted price of a land
 */
const DataComparisonBox = ({ currentPriceEth, predictions }: Props) => {
  const ethPredictionPrice = predictions?.ethPrediction
  const comparedValue =
    !ethPredictionPrice || !currentPriceEth
      ? NaN
      : (currentPriceEth / ethPredictionPrice) * 100
  const isUnderValued = comparedValue < 100

  return (
    //Current Listing Price || Not Listed Message
    <div className='relative left-1  flex gap-2 flex-col pt-4 text-md text-left font-medium '>
      <p className={currentPriceEth ? 'text-green-500' : 'text-gray-400 '}>
        {currentPriceEth
          ? `Listed: ${currentPriceEth?.toFixed(2)} ETH`
          : 'Not Listed'}
      </p>
      {/* Comparison Percentage  */}
      {currentPriceEth && (
        <p className={isUnderValued ? 'text-blue-400' : 'text-red-400'}>
          {comparedValue.toFixed()}% of Predicted Price
        </p>
      )}
    </div>
  )
}

export default DataComparisonBox
