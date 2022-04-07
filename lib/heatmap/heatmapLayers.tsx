import { AtlasTile, Layer } from './heatmapCommonTypes'
import { getTileColor } from './valuationColoring'

export const filteredLayer: Layer = (x, y, atlas) => {
  const id = x + ',' + y
  if (!atlas.ITRM || !(id in atlas.ITRM)) return null
  if (
    atlas.decentraland &&
    (!(id in atlas.decentraland) ||
      [5, 6, 7, 8, 12].includes(atlas.decentraland[id].type))
  )
    return null
  const color = getTileColor(atlas.ITRM[id].percent ?? 0)
  const top = undefined
  const left = undefined
  const topLeft = undefined
  return {
    color,
    top,
    left,
    topLeft,
  }
}

export const decentralandAPILayer: Layer = (x, y, atlas) => {
  const COLOR_BY_TYPE: Record<number, string> = Object.freeze({
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
  const id = x + ',' + y
  if (atlas.decentraland && id in atlas.decentraland) {
    const tile = atlas.decentraland[id]
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
