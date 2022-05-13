import { Metaverse } from '../enums'
import { IAPIData } from '../types'
import { ellipseAddress } from '../utilities'
import { ICoinPrices, IPriceCard } from './valuationTypes'

export const convertETHPrediction = (
  coinPrices: ICoinPrices,
  ethPrediction: number = 0
) => {
  const ethUSD = coinPrices.ethereum.usd
  const sandUSD = coinPrices['the-sandbox'].usd
  const usdPrediction = ethPrediction * ethUSD
  const sandPrediction = usdPrediction / sandUSD
  return { ethPrediction, usdPrediction, sandPrediction }
}

export const convertMANAPrediction = (
  coinPrices: ICoinPrices,
  manaPrediction = 0
) => {
  const ethUSD = coinPrices.ethereum.usd
  const manaUSD = coinPrices.decentraland.usd
  const usdPrediction = manaPrediction * manaUSD
  const ethPrediction = usdPrediction / ethUSD
  return { ethPrediction, usdPrediction, manaPrediction }
}

// Get Data for Single Land Asset
export const getLandData = async (
  metaverse: Metaverse,
  tokenID?: string,
  coordinates?: { X: string; Y: string }
) => {
  try {
    const predictionRes = await fetch('/api/getLandData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenID: tokenID,
        X: coordinates?.X,
        Y: coordinates?.Y,
        metaverse: metaverse,
      }),
    })
    const data = await predictionRes.json()
    return data
  } catch (e) {
    console.log(e)
  }
}

/* Formatting a Land Asset received from OpenSea into our Cards.
 The asset: any comes from the OpenSea API*/
export const formatLandAsset = async (
  assetId: any,
  coinPrices: ICoinPrices,
  metaverse: Metaverse
) => {
  const apiData: IAPIData = await getLandData(metaverse, assetId)
  const formattedAsset = {
    apiData: apiData,
    showCard: true,
    processing: false,
  }

  if (metaverse === 'sandbox') {
    Object.defineProperty(formattedAsset, 'predictions', {
      value: convertETHPrediction(coinPrices, apiData.prices?.predicted_price),
    })
  } else if (metaverse === 'decentraland') {
    Object.defineProperty(formattedAsset, 'predictions', {
      value: convertMANAPrediction(coinPrices, apiData.prices?.predicted_price),
    })
  }
  return formattedAsset as IPriceCard
}

// Formatting Token Id if its too long
export const handleTokenID = (tokenID: string) => {
  if (tokenID.toString().length > 6) {
    return ellipseAddress(tokenID.toString(), 3)
  } else {
    return tokenID
  }
}

/**
 * @param orders Array of order objects from each OpenSea Asset
 * @returns current price for asset & best offered price for asset
 */
export function getBoundaryPrices(orders: any[]) {
  let currentPrice: number | undefined
  let bestOfferedPrice: number | undefined

  let result = {
    current_price: currentPrice,
    best_offered_price: bestOfferedPrice,
  }

  if (orders) {
    for (let order of orders) {
      let value = getPrice(order)
      if (order.side == 0)
        result.best_offered_price = result.best_offered_price
          ? Math.max(result.best_offered_price, value)
          : value
      else if (order.side == 1 && order.static_extradata === '0x')
        result.current_price = result.current_price
          ? Math.min(result.current_price, value)
          : value
    }
  }
  return result
}
function getPrice(order: any) {
  if (order.payment_token_contract.symbol === 'USDC')
    return (order.current_price / 1e6) * order.payment_token_contract.eth_price
  if (order.payment_token_contract.symbol === 'SAND')
    return (
      (order.current_price / 1e18) * 3 * order.payment_token_contract.eth_price
    )
  return (order.current_price / 1e18) * order.payment_token_contract.eth_price
}
