import React, { createContext, useContext, useState } from 'react'
import { purchaseCoinOptions } from './purchaseCoinOptions'
import {
  PurchaseCoin,
  PurchaseCoinsBalance,
  PurchaseMonthlyChoice,
} from './purchaseTypes'

interface PurchaseContent {
  coinsBalance: PurchaseCoinsBalance | undefined
  setCoinsBalance: React.Dispatch<
    React.SetStateAction<PurchaseCoinsBalance | undefined>
  >
  monthlyChoice: PurchaseMonthlyChoice | undefined
  setMonthlyChoice: React.Dispatch<
    React.SetStateAction<PurchaseMonthlyChoice | undefined>
  >
  coin: PurchaseCoin | undefined
  setCoin: React.Dispatch<React.SetStateAction<PurchaseCoin | undefined>>
}

export const purchaseContext = createContext<PurchaseContent>({
  coinsBalance: undefined,
  setCoinsBalance: () => {},
  monthlyChoice: 450,
  setMonthlyChoice: () => {},
  coin: 'mgh',
  setCoin: () => {},
})

export const PurchaseProvider: React.FC = ({ children }) => {
  const [coinsBalance, setCoinsBalance] = useState<PurchaseCoinsBalance>()
  const [monthlyChoice, setMonthlyChoice] = useState<PurchaseMonthlyChoice>()
  const [coin, setCoin] = useState<PurchaseCoin>()

  return (
    <purchaseContext.Provider
      value={{
        coinsBalance,
        setCoinsBalance,
        monthlyChoice,
        setMonthlyChoice,
        coin,
        setCoin,
      }}
    >
      {children}
    </purchaseContext.Provider>
  )
}
