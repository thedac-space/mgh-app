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
    <button className='gray-box h-full flex-grow'>
      <h3 className='text-xl'>
        {option} Month{option > 1 ? 's' : ''}
      </h3>
      <p>{purchaseSwitch[option].monthlyPrice} per Month</p>
      {purchaseSwitch[option].discount && (
        <span>Save {purchaseSwitch[option].discount}%</span>
      )}{' '}
    </button>
  )
}

export default PurchaseOptionButton
