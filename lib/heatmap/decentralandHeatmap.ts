import { ethers } from 'ethers'
import useConnectWeb3 from '../../backend/connectWeb3'
import { Chains } from '../chains'
import { Contracts } from '../contracts'
import { Metaverse } from '../enums'
import { addHeatmapData } from '../FirebaseUtilities'
import { getNftTransfersAmount } from '../nftUtils'
import { getCurrentPrice } from '../valuation/valuationUtils'
import { AtlasTile, Coord, Layer, ValuationTile } from './commonTypes'
import { getTileColor, setColours } from './valuationColoring'

let atlas: Record<string, AtlasTile> | null = null
const provider = new ethers.providers.InfuraProvider(
  Chains.ETHEREUM_MAINNET.chainId,
  '03bfd7b76f3749c8bb9f2c91bdba37f3'
)
// const setMetaverseData = async (atlas: Record<string, AtlasTile>) => {
//   const mvOptions: Record<Metaverse, { lands: number; contract?: string }> = {
//     sandbox: {
//       lands: 166604,
//       contract: Contracts.LAND.ETHEREUM_MAINNET.newAddress,
//     },
//     decentraland: {
//       lands: 90601,
//       contract: Contracts.PARCEL.ETHEREUM_MAINNET.address,
//     },
//     'axie-infinity': { lands: 90601 },
//   }
//   const metaArray = Object.keys(mvOptions) as Metaverse[]
//   // Mapping through metaverses
//   const time = Date.now()
//   metaArray.map(async (metaverse) => {
//     console.log('starting')
//     if (metaverse === 'axie-infinity') return
//     const valuationAtlas: Record<string, ValuationTile> = {}
//     // Getting all lands and dividing by 500 to make requests
//     // for (let i = 0; i <= [...Array(Math.ceil(10000 / 500))].length; i++) {
//     for (
//       let i = 0;
//       i <= [...Array(Math.ceil(mvOptions[metaverse].lands / 500))].length;
//       i++
//     ) {
//       console.log(i)
//       // 500 lands each time
//       try {
//         // Getting valuations from ITRM
//         const valuationRes = await fetch(
//           `https://services.itrmachines.com/${metaverse}/requestMap?from=${
//             i * 500
//           }&size=500`
//         )
//         const valuations = (await valuationRes.json()) as Record<
//           string,
//           ValuationTile | undefined
//         >
//         // Mapping through those valuations
//         const valuationKeys = Object.keys(valuations)
//         for (let key of valuationKeys) {
//           // Making a name to fit with our tile map
//           const name =
//             valuations[key]?.coords.x + ',' + valuations[key]?.coords.y
//           // // Getting current Price from openSea
//           // const res = await fetch(
//           //   `/api/fetchSingleAsset/${mvOptions[metaverse].contract}/${key}`
//           // )
//           // const currentPrice = getCurrentPrice(await res.json())
//           // Fetching transfers with Infura
//           const transfers = await getNftTransfersAmount(
//             provider,
//             mvOptions[metaverse].contract!,
//             key
//           )
//           // // Setting the land info in the valuation atlas
//           valuationAtlas[name] = valuations[key]!
//           // valuationAtlas[name].current_price = currentPrice
//           valuationAtlas[name].transfers = transfers
//           if (metaverse === 'decentraland') {
//             if (atlas && atlas[name])
//               valuationAtlas[name].current_price = atlas[name].price ?? NaN
//           }
//         }
//       } catch (e) {
//         console.log('error', e)
//       }
//     }
//     addHeatmapData(metaverse, valuationAtlas, time)
//   })
// }
// await setColours(valuationAtlas, 'predicted_price')

async function loadTiles() {
  const resp = await fetch('https://api.decentraland.org/v1/tiles')
  const json = await resp.json()
  atlas = json.data as Record<string, AtlasTile>
  // addHeatmapData(Metaverse.DECENTRALAND, atlas as any, Date.now())
  // await setMetaverseData(atlas)
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
