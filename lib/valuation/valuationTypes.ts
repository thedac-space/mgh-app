import { IAPIData, IPredictions } from '../types'

export interface ICoinPrices {
  decentraland: { usd: number }
  ethereum: { usd: number }
  'the-sandbox': { usd: number }
}

export interface IPriceCard {
  showCard?: boolean
  processing?: boolean
  apiData?: IAPIData
  predictions?: IPredictions
  verticalUnder?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export type LandsKey = 'sandbox' | 'decentraland'

export interface IWatchListCard extends IPriceCard {
  currentPrice?: number
}
