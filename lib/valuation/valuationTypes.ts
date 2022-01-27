import { IAPIData, IPredictions } from '../types'

export interface ICoinPrices {
  decentraland: { usd: number }
  ethereum: { usd: number }
  'the-sandbox': { usd: number }
}

export interface IPriceCard {
  showCard: boolean
  processing: boolean
  apiData: IAPIData | undefined
  predictions: IPredictions | undefined
  verticalUnder: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}
