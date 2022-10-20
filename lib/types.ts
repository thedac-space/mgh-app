import { Network } from './enums'
import { Metaverse } from './metaverse'

export interface NetworkState {
  value: Network
}

export interface AccountState {
  connected: boolean
  address: string | undefined
  chainId: number | undefined
}

export interface AddEthereumChainParameter {
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string // 2-6 characters long
    decimals: 18
  }
  rpcUrls: string[]
}

export interface IAssetData {
  name: string
  symbol: string
  decimals: number
  contractAddress?: string
}

export interface IChainData {
  name: string
  chainId: number
  chainIdHex: string
  rpcUrl: string
  nativeCurrency: IAssetData
  blockExplorer: string
}

export interface IPoolData {
  id: number
  name: string
  APY: number | string
  lockingMonth: number
}

export interface IAPIData {
  coords: { x: number; y: number }
  metaverse: Metaverse
  name?: string
  opensea_link?: string
  external_link: string
  images: {
    image_url: string
  }
  tokenId: string

    predicted_price: number
    floor_adjusted_predicted_price: number
    history: { price: number; timestamp: number }[] | never[]
    variation_last_four_weeks?: number
    variation_last_six_months?: number
    variation_last_week?: number
  
}

export interface IAPIDataAxie {
  coords: { x: number; y: number }
  metaverse: Metaverse
  name?: string
  opensea_link?: string
  external_link: string
  images: {
    image_url: string
  }
  tokenId: string
  prices: {
    predicted_price: number
    eth_predicted_price: number
    history: { price: number; timestamp: number }[] | never[]
    variation_last_four_weeks?: number
    variation_last_six_months?: number
    variation_last_week?: number
  
}}

export interface IPredictions {
  ethPrediction: number
  usdPrediction: number
  metaversePrediction?: number
}
