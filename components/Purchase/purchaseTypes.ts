import { purchaseCoinOptions } from '.'

export type PurchaseMonthlyChoice = 200 | 150 | 100 | undefined
export type PurchaseCoin = keyof typeof purchaseCoinOptions

export type PurchaseCoinsBalance = Record<PurchaseCoin, number>
