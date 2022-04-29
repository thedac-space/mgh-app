import { Layer } from './heatmapCommonTypes'
import {
  DECENTRALAND_API_COLORS,
  DICTIONARY_COLORS,
  FILTER_COLORS,
  getTileColor,
} from './valuationColoring'

export const filteredLayer: Layer = (
  x,
  y,
  atlas,
  mapFilter,
  percentFilter,
  legendFilter
) => {
  const id = x + ',' + y
  if (!atlas || !atlas.ITRM || !(id in atlas.ITRM)) return null
  /** This second Statement checks that in Decentraland
   * the land is an actual land and not a Road, Plaza, etc...
   */
  if (
    atlas.decentraland &&
    (!(id in atlas.decentraland) ||
      [5, 6, 7, 8, 12].includes(atlas.decentraland[id].type))
  )
    return null
  /* Don't show a layer if user is tier0 and metaverse is decentraland. (we already have decentralands Map for that)  */
  let color!: string
  const scaleOptions = {
    big: 1.4,
    mid: 1.2,
    base: 1,
  }
  let scale!: number
  // Will make this prettier at some stage.. but works fine for now
  if (legendFilter === 'on-sale') {
    atlas.ITRM[id].current_price_eth
      ? mapFilter === 'basic'
        ? (color = DICTIONARY_COLORS['on-sale'])
        : (color = getTileColor(
            atlas.ITRM[id].percent ?? 0,
            percentFilter,
            mapFilter
          ))
      : (color = FILTER_COLORS[0])
  } else if (legendFilter === 'watchlist') {
    atlas.ITRM[id].watchlist
      ? mapFilter === 'basic'
        ? (color = DICTIONARY_COLORS.watchlist) && (scale = scaleOptions.big)
        : (color = getTileColor(
            atlas.ITRM[id].percent ?? 0,
            percentFilter,
            mapFilter
          )) && (scale = scaleOptions.big)
      : (color = FILTER_COLORS[0])
  } else if (legendFilter === 'portfolio') {
    atlas.ITRM[id].portfolio
      ? mapFilter === 'basic'
        ? (color = DICTIONARY_COLORS.portfolio) && (scale = scaleOptions.big)
        : (color = getTileColor(
            atlas.ITRM[id].percent ?? 0,
            percentFilter,
            mapFilter
          )) && (scale = scaleOptions.big)
      : (color = FILTER_COLORS[0])
  } else if (mapFilter === 'basic') {
    if (
      atlas.decentraland &&
      !atlas.ITRM[id].portfolio &&
      !atlas.ITRM[id].watchlist &&
      !atlas.ITRM[id].current_price_eth
    ) {
      return null
    } else if (atlas.ITRM[id].portfolio) {
      color = DICTIONARY_COLORS.portfolio
      scale = scaleOptions.mid
    } else if (atlas.ITRM[id].watchlist) {
      color = DICTIONARY_COLORS.watchlist
      scale = scaleOptions.mid
    } else if (atlas.ITRM[id].current_price_eth) {
      color = DICTIONARY_COLORS['on-sale']
    } else {
      color = '#43ba58' //'#12b630' // Green color for basic view with no filters
    }
  } else {
    color = getTileColor(atlas.ITRM[id].percent ?? 0, percentFilter, mapFilter)
  }

  const top = undefined
  const left = undefined
  const topLeft = undefined
  return {
    scale,
    color,
    top,
    left,
    topLeft,
  }
}

export const decentralandAPILayer: Layer = (x, y, atlas) => {
  const id = x + ',' + y
  if (atlas && atlas.decentraland && id in atlas.decentraland) {
    const tile = atlas.decentraland[id]
    const color = DECENTRALAND_API_COLORS[tile.type]

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
      color:
        (x + y) % 2 === 0
          ? DECENTRALAND_API_COLORS[12]
          : DECENTRALAND_API_COLORS[13],
    }
  }
}
