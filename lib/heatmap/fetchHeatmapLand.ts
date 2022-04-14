import { Contracts } from '../contracts'
import { Metaverse } from '../enums'
import { ICoinPrices } from '../valuation/valuationTypes'
import {
  convertETHPrediction,
  getAxieLandData,
  getCurrentPrice,
  getLandData,
} from '../valuation/valuationUtils'

export const fetchHeatmapLand = async (
  prices: ICoinPrices,
  metaverse: Metaverse,
  tokenId?: string,
  coords?: { x?: string | number; y?: string | number }
) => {
  const landOptions = {
    sandbox: { contract: Contracts.LAND.ETHEREUM_MAINNET.newAddress },
    decentraland: { contract: Contracts.PARCEL.ETHEREUM_MAINNET.address },
    'axie-infinity': { contract: Contracts.AXIE_LANDS.RONIN_MAINNET.address },
  }
  let currentPrice: number
  // Getting Predictions from ITRM
  const apiData = await getLandData(metaverse, tokenId, {
    X: coords?.x,
    Y: coords?.y,
  })

  if (apiData.err) {
    return
  }
  const { coords: landCoords } = apiData
  if (metaverse === 'axie-infinity') {
    // Retrieving data from Axie Marketplace
    const axieLandData = await getAxieLandData(landCoords.x, landCoords.y)
    currentPrice = Number(axieLandData.auction?.currentPriceUSD)
  } else {
    // Retrieving data from OpenSea (Comes in ETH)
    const res = await fetch(
      `/api/fetchSingleAsset/${landOptions[metaverse].contract}/${apiData.tokenId}`
    )
    // Getting Current Price for each Asset
    const listings = (await res.json()).listings
    currentPrice = getCurrentPrice(listings) * prices.ethereum.usd
  }

  const predictions = convertETHPrediction(
    prices,
    apiData.prices?.eth_predicted_price,
    metaverse
  )

  return { apiData, predictions, currentPrice, landCoords }
}
