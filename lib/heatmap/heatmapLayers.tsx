import { Layer } from './heatmapCommonTypes'
import { getTileColor } from './valuationColoring'

export const filteredLayer: Layer = (x, y, atlas, filter) => {
  const id = x + ',' + y
  if (!atlas || !(id in atlas)) return null
  // const formattedFilter =
  //   filter === 'transfers' ? atlas[id].history?.length : atlas[id][filter]

  // const color = '#00d3ff'
  const color = getTileColor(atlas[id].percent ?? 0)
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
