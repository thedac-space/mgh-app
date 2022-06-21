import { MapFilter } from '../../lib/heatmap/heatmapCommonTypes'

export function renderTile(args: {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  size: number
  padding: number
  offset: number
  color?: string
  left?: boolean
  top?: boolean
  topLeft?: boolean
  scale?: number
  filter: MapFilter
  img?: CanvasImageSource
}) {
  const {
    ctx,
    x,
    y,
    size,
    padding,
    offset,
    color,
    left,
    top,
    topLeft,
    scale,
    filter,
    img,
  } = args
  if (!color) return
  ctx.fillStyle = color

  const tileSize = scale ? size * scale : size

  if (!top && !left) {
    // disconnected everywhere: it's a square
    // TODO ADD LOGIC
    if (filter === 'skyView') {
      if (!img) return
      if (x % tileSize == 0 && y % tileSize == 0) {
        ctx.drawImage(
          img,
          x - tileSize + padding,
          y - tileSize + padding,
          10,
          10
        )
      }
    } else {
      ctx.fillRect(
        x - tileSize + padding,
        y - tileSize + padding,
        tileSize - padding,
        tileSize - padding
      )
    }
  } else if (top && left && topLeft) {
    // connected everywhere: it's a square
    ctx.fillRect(
      x - tileSize - offset,
      y - tileSize - offset,
      tileSize + offset,
      tileSize + offset
    )
  } else {
    if (left) {
      // connected left: it's a rectangle
      ctx.fillRect(
        x - tileSize - offset,
        y - tileSize + padding,
        tileSize + offset,
        tileSize - padding
      )
    }
    if (top) {
      // connected top: it's a rectangle
      ctx.fillRect(
        x - tileSize + padding,
        y - tileSize - offset,
        tileSize - padding,
        tileSize + offset
      )
    }
  }
}
