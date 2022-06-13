import React, { useContext } from 'react'
import { purchaseCoinOptions } from '.'
import { typedKeys } from '../../lib/utilities'
import { OptimizedImage } from '../General'
import { purchaseContext } from './purchaseContext'
import { PurchaseCoin } from './purchaseTypes'

const PurchaseCoinList = () => {
  const {
    coinsBalance,
    setCoin,
    coin: selectedCoin,
  } = useContext(purchaseContext)

  const handleClick = (coin: PurchaseCoin) => {
    setCoin(selectedCoin === coin ? undefined : coin)
  }
  return (
    <ul className='flex gap-4 justify-around'>
      {typedKeys(purchaseCoinOptions).map((coin) => (
        <li>
          <button onClick={() => handleClick(coin)}>
            <OptimizedImage
              width={100}
              height={100}
              src={purchaseCoinOptions[coin].img}
              className={
                (!selectedCoin && coinsBalance && coinsBalance[coin] > 0) ||
                selectedCoin === coin
                  ? ''
                  : 'grayscale'
              }
            />
          </button>
        </li>
      ))}
    </ul>
  )
}

export default PurchaseCoinList
