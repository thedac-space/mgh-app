import { Contracts } from '../contracts'
import { Metaverse } from '../enums'
import { IAPIData, IPredictions } from '../types'
import { typedKeys } from '../utilities'
import { ICoinPrices } from '../valuation/valuationTypes'
import { convertETHPrediction } from '../valuation/valuationUtils'
import { LandCoords, ValuationTile } from './heatmapCommonTypes'

export const fetchHeatmapLand = async (
  map: Record<string, ValuationTile>,
  prices: ICoinPrices,
  metaverse: Metaverse,
  tokenId?: string,
  coords?: LandCoords
) => {
  const landOptions = {
    sandbox: { contract: Contracts.LAND.ETHEREUM_MAINNET.newAddress },
    decentraland: { contract: Contracts.PARCEL.ETHEREUM_MAINNET.address },
  }
  let currentPrice = NaN
  let apiData!: IAPIData
  let landCoords = { x: NaN, y: NaN }
  // let predictions: IPredictions
  typedKeys(map).map((key) => {
    // When user searches by Coords
    if (coords?.x && coords.y) {
      const name = coords.x + ',' + coords.y
      if (key === name) {
        apiData = {
          ...map[key],
          metaverse: metaverse,
          tokenId: map[key].land_id!,
          prices: {
            eth_predicted_price: map[key].eth_predicted_price,
            predicted_price: map[key].eth_predicted_price * prices.ethereum.usd,
          },
        }
        landCoords = { x: Number(coords.x), y: Number(coords.y) }
        if (metaverse !== 'axie-infinity') {
          apiData.opensea_link = `https://opensea.io/assets/${landOptions[metaverse].contract}/${map[key].land_id}`
        }
      }
    }

    // When user searches by TokenId
    if (tokenId) {
      if (tokenId === map[key].land_id) {
        apiData = {
          ...map[key],
          metaverse: metaverse,
          tokenId: map[key].land_id!,
          prices: {
            eth_predicted_price: map[key].eth_predicted_price,
            predicted_price: map[key].eth_predicted_price * prices.ethereum.usd,
          },
        }
        landCoords = { x: map[key].coords.x, y: map[key].coords.y }
      }
    }
  })
  if (!apiData) return
  const predictions = convertETHPrediction(
    prices,
    apiData.prices.eth_predicted_price,
    metaverse
  )
  return { apiData, predictions, currentPrice, landCoords }
}