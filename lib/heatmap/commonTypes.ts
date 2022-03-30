export type Coord = {
  x: number
  y: number
}

export type Layer = (x: number, y: number, atlas?: any) => Tile | null

export type Tile = {
  color: string
  top?: boolean
  left?: boolean
  topLeft?: boolean
  scale?: number
}

export type AtlasTile = {
  x: number
  y: number
  type: number
  district_id?: number
  estate_id?: number
  left?: number
  top?: number
  topLeft?: number
  price?: number
}

export type ValuationTile = {
  coords: { x: number; y: number }
  eth_predicted_price: number
  predicted_price: number
  percent: number
  current_price?: number
  transfers?: number
}
