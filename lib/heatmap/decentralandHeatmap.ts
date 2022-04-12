import { ethers } from 'ethers'
import useConnectWeb3 from '../../backend/connectWeb3'
import { Chains } from '../chains'
import { Contracts } from '../contracts'
import { Metaverse } from '../enums'
import { addHeatmapData } from '../FirebaseUtilities'
import { getNftTransfersAmount } from '../nftUtils'
import { getCurrentPrice } from '../valuation/valuationUtils'
import { AtlasTile, Coord, Layer, ValuationTile } from './heatmapCommonTypes'
import { getTileColor, setColours } from './valuationColoring'

let atlas: Record<string, AtlasTile> | null = null
const provider = new ethers.providers.InfuraProvider(
  Chains.ETHEREUM_MAINNET.chainId,
  '03bfd7b76f3749c8bb9f2c91bdba37f3'
)

async function loadTiles() {
  const resp = await fetch('https://api.decentraland.org/v1/tiles')
  const json = await resp.json()
  atlas = json.data as Record<string, AtlasTile>
}

loadTiles().catch(console.error)

export const COLOR_BY_TYPE: Record<number, string> = Object.freeze({
  0: '#ff9990', // my parcels
  1: '#ff4053', // my parcels on sale
  2: '#ff9990', // my estates
  3: '#ff4053', // my estates on sale
  4: '#ffbd33', // parcels/estates where I have permissions
  5: '#5054D4', // districts
  6: '#563db8', // contributions
  7: '#716C7A', // roads
  8: '#70AC76', // plazas
  9: '#3D3A46', // owned parcel/estate
  10: '#3D3A46', // parcels on sale (we show them as owned parcels)
  11: '#09080A', // unowned pacel/estate
  12: '#18141a', // background
  13: '#110e13', // loading odd
  14: '#0d0b0e', // loading even
})

export const atlasLayer: Layer = (x, y) => {
  const id = x + ',' + y
  if (atlas !== null && id in atlas) {
    const tile = atlas[id]
    const color = COLOR_BY_TYPE[tile.type]

    const top = !!tile.top
    const left = !!tile.left
    const topLeft = !!tile.topLeft

    return {
      color,
      top,
      left,
      topLeft,
    }
  } else {
    return {
      color: (x + y) % 2 === 0 ? COLOR_BY_TYPE[12] : COLOR_BY_TYPE[13],
    }
  }
}

// export const onSaleLayer: Layer = (x, y, l) => {
//   const id = x + ',' + y
//   if (atlas && id in valuationAtlas) {
//     const color = getTileColor(valuationAtlas[id].percent)
//     // const top = !!atlas[id].top
//     // const left = !!atlas[id].left
//     // const topLeft = !!atlas[id].topLeft
//     return {
//       color,
//       // top,
//       // left,
//       // topLeft,
//     }
//   }
//   return null
// }
export const onSaleLayer: Layer = (x, y) => {
  const id = x + ',' + y
  if (atlas && id in atlas && atlas[id].price) {
    const color = '#00d3ff'
    const top = !!atlas[id].top
    const left = !!atlas[id].left
    const topLeft = !!atlas[id].topLeft
    return {
      color,
      top,
      left,
      topLeft,
    }
  }
  return null
}