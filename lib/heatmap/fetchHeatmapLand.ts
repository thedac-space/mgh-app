import { Contracts } from '../contracts'
import { Metaverse } from '../metaverse'
import { IAPIData } from '../types'
import { typedKeys } from '../utilities'
import { ICoinPrices } from '../valuation/valuationTypes'
import { convertETHPrediction } from '../valuation/valuationUtils'
import { LandCoords, ValuationTile } from './heatmapCommonTypes'

export const fetchHeatmapLand = (
  map: Record<string, ValuationTile>,
  prices: ICoinPrices,
  metaverse: Metaverse,
  tokenId?: string,
  coords?: LandCoords
) => {
  console.time('fetchHeatmapLand')

  const landOptions = {
    sandbox: { contract: Contracts.LAND.ETHEREUM_MAINNET.newAddress },
    decentraland: { contract: Contracts.PARCEL.ETHEREUM_MAINNET.address },
  }

  const setOpenSeaLink = (key: string) => {
    if (apiData && metaverse !== 'axie-infinity') {
      apiData.opensea_link = `https://opensea.io/assets/${landOptions[metaverse].contract}/${map[key].land_id}`
    }
  }

  let currentPrice = NaN
  let apiData!: IAPIData
  let landCoords = { x: NaN, y: NaN }

  typedKeys(map).find((key) => {
    // When user searches by Coords (using != null here to handle if user types/clicks on a 0)
    if (coords?.x != null && coords.y != null) {
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
        setOpenSeaLink(key)
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
        setOpenSeaLink(key)
      }
    }
  })
  if (!apiData) return
  const predictions = convertETHPrediction(
    prices,
    apiData.prices.eth_predicted_price,
    metaverse
  )
  console.timeEnd('fetchHeatmapLand')
  return { apiData, predictions, currentPrice, landCoords }
}
