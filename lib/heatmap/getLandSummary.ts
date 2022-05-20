import { Metaverse } from '../metaverse'
import { typedKeys } from '../utilities'
import { LandCoords, ValuationTile } from './heatmapCommonTypes'

export const getLandSummary = (
  map: Record<string, ValuationTile>,
  // metaverse: Metaverse,
  coords?: LandCoords
) => {
  console.time('getLandSummary')
  let landCoords: LandCoords | undefined
  let owner: string | undefined

  typedKeys(map).find((key) => {
    // When user searches by Coords (using != null here to handle if user types/clicks on a 0)
    if (coords?.x != null && coords.y != null) {
      const name = coords.x + ',' + coords.y
      if (key === name) {
        owner = map[key].owner
      }
      landCoords = { x: Number(coords.x), y: Number(coords.y) }
    }
  })
  console.timeEnd('getLandSummary')
  return { owner, landCoords }
}
