import React from 'react'

interface Props {
  option: 1 | 3 | 12
}

const PurchaseOptionButton = ({ option }: Props) => {
  const purchaseSwitch = {
    1: { monthlyPrice: 200, discount: undefined },
    3: { monthlyPrice: 150, discount: 25 },
    12: { monthlyPrice: 100, discount: 50 },
  }
  return (
    // Wrapper
    <button className='gray-box flex flex-col items-center gap-2'>
      {/* Header */}
      <h4 className='text-2xl border-0 font-medium'>
        {option} Month{option > 1 ? 's' : ''}
      </h4>
      {/* Price per Month */}
      <p className='font-medium text-gray-300'>
        {purchaseSwitch[option].monthlyPrice}$/Month
      </p>
      {/* Discount (if any) */}
      {purchaseSwitch[option].discount && (
        <span className='bg-red-800 px-2 text-white'>
          Save {purchaseSwitch[option].discount}%
        </span>
      )}{' '}
    </button>
  )
}

export default PurchaseOptionButton
