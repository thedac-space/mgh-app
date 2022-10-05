import { Contracts } from '../contracts'
import { Metaverse } from '../metaverse'
import { IAPIData } from '../types'
import { typedKeys } from '../utilities'
import { ICoinPrices } from '../valuation/valuationTypes'
import { convertETHPrediction } from '../valuation/valuationUtils'
import { LandCoords, MapFilter, ValuationTile } from './heatmapCommonTypes'

export const findHeatmapLand = (
  map: Record<string, ValuationTile>,
  prices: ICoinPrices,
  metaverse: Metaverse,
  tokenId?: string,
  coords?: LandCoords,
  filterBy?: MapFilter
) => {
  const landOptions = {
    sandbox: { contract: Contracts.LAND.ETHEREUM_MAINNET.newAddress },
    decentraland: { contract: Contracts.PARCEL.ETHEREUM_MAINNET.address },
    'somnium-space': { contract: Contracts.CUBES.ETHEREUM_MAINNET.address }
  }

  const setOpenSeaLink = (key: string) => {
    if (apiData && metaverse !== 'axie-infinity') {
      apiData.opensea_link = `https://opensea.io/assets/${landOptions[metaverse].contract}/${map[key].land_id}`
    }
  }

  let land: string | undefined
  // When user searches by Coords (using != null here to handle if user types/clicks on a 0)
  if (coords?.x != null && coords.y != null) {
    const name = coords.x + ',' + coords.y
    land = typedKeys(map).find((key) => key === name)
  }

  // When user searches by TokenId
  if (tokenId) {
    land = typedKeys(map).find((key) => tokenId === map[key].land_id)
  }

  if (!land) return
  let apiData: IAPIData
  if (filterBy === 'floor_adjusted_predicted_price') {
    apiData = {
      ...map[land],
      metaverse: metaverse,
      tokenId: map[land].land_id!,
      prices: {
        eth_predicted_price: map[land].floor_adjusted_predicted_price || 0,
        predicted_price: (map[land].floor_adjusted_predicted_price || 0) * prices.ethereum.usd,
      },
    }
  } else {
    apiData = {
      ...map[land],
      metaverse: metaverse,
      tokenId: map[land].land_id!,
      prices: {
        eth_predicted_price: map[land].eth_predicted_price,
        predicted_price: map[land].eth_predicted_price * prices.ethereum.usd,
      },
    }
  }

  const name = map[land].name ? map[land].name : undefined
  const landCoords = { x: map[land].coords ? map[land].coords.x : map[land].center.x, y: map[land].coords ? map[land].coords.y : map[land].center.y }
  setOpenSeaLink(land)

  const predictions = convertETHPrediction(
    prices,
    apiData.prices.eth_predicted_price,
    metaverse
  )
  return { apiData, predictions, landCoords, name }
}
