import React, { useContext } from 'react'
import { purchaseContext } from './purchaseContext'
import { PurchaseMonthlyChoice } from './purchaseTypes'

interface Props {
  option: 1 | 3 | 12
}

const PurchaseOptionButton = ({ option }: Props) => {
  const { setMonthlyChoice } = useContext(purchaseContext)
  const trueOption = option! // option will always be true but using same type as monthlyChoice for convenience
  const purchaseSwitch = {
    1: { monthlyPrice: 200, fullPrice: 200, discount: undefined },
    3: { monthlyPrice: 150, fullPrice: 450, discount: 25 },
    12: { monthlyPrice: 100, fullPrice: 1200, discount: 50 },
  } as const
  return (
    // Wrapper
    <button
      className='gray-box flex flex-col items-center gap-2'
      onClick={() => setMonthlyChoice(purchaseSwitch[trueOption].fullPrice)}
    >
      {/* Header */}
      <h4 className='text-2xl border-0 font-medium'>
        {option} Month{+trueOption > 1 ? 's' : ''}
      </h4>
      {/* Price per Month */}
      <p className='font-medium text-gray-300'>
        {purchaseSwitch[trueOption].monthlyPrice}$/Month
      </p>
      {/* Discount (if any) */}
      {purchaseSwitch[trueOption].discount && (
        <span className='bg-red-800 px-2 text-white'>
          Save {purchaseSwitch[trueOption].discount}%
        </span>
      )}{' '}
    </button>
  )
}

export default PurchaseOptionButton
