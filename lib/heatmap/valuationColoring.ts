import { typedKeys } from '../utilities'
import { MapFilter, ValuationTile } from './heatmapCommonTypes'

export const getMax = (array: (number | undefined)[]) => {
  const filteredArray = array.filter((e) => typeof e === 'number') as number[]
  return Math.max(...filteredArray.sort((a, b) => a + b).slice(1))
}

export const getMin = (array: (number | undefined)[]) => {
  const filteredArray = array.filter((e) => typeof e === 'number') as number[]
  return Math.min(...filteredArray.sort((a, b) => a + b).slice(1))
}

export const getAvg = (array: (number | undefined)[]) => {
  const filteredArray = array.filter((e) => typeof e === 'number') as number[]
  const sum = filteredArray.reduce((prev, current) => prev + current)
  return sum / array.length
}

export const getPercentage = (
  partialValue: number | undefined,
  totalValue: number | undefined
) => {
  if (!partialValue || !totalValue) return 0
  return parseInt(((partialValue * 100) / totalValue).toFixed(0))
}

export const setColours = async (
  valuationAtlas: Record<string, ValuationTile>,
  element: MapFilter
) => {
  let predictions: (number | undefined)[]
  if (element === 'transfers') {
    predictions = typedKeys(valuationAtlas).map(
      (valuation) => valuationAtlas[valuation].history?.length
    )
  } else if (element === 'none') {
    predictions = []
  } else {
    predictions = typedKeys(valuationAtlas).map(
      (valuation) => valuationAtlas[valuation][element]
    )
  }
  let max = NaN

  max = getMax(predictions)
  await Promise.all(
    typedKeys(valuationAtlas).map((valuation) => {
      let percent = NaN
      if (element === 'transfers') {
        percent = getPercentage(valuationAtlas[valuation].history?.length, max)
      } else if (element === 'current_price') {
        percent = getPercentage(
          valuationAtlas[valuation].current_price,
          valuationAtlas[valuation].predicted_price
        )
      } else if (element === 'none') {
        percent = 20
      } else {
        percent = getPercentage(valuationAtlas[valuation][element], max)
      }
      valuationAtlas[valuation] = {
        ...valuationAtlas[valuation],
        percent: percent,
      }
      return true
    })
  )
  return valuationAtlas
}
const between = (x: number, max: number, min: number) => {
  return x >= min && x <= max
}

export const TILE_COLORS = {
  5: 'rgb(255,0,0)', // Max
  4: 'rgb(255,137,0)',
  3: 'rgb(255,255,0)',
  2: 'rgb(0,255,0)',
  1: 'rgb(0,255,255)', // Min
  0: 'rgb(10,10,10)', // None

  // if (percent > 100) return 'rgb(120,0,0)'
  // if (between(percent, 100, 90)) return 'rgb(255,0,0)'
  // if (between(percent, 89, 80)) return 'rgb(255,95,0)'
  // if (between(percent, 79, 70)) return 'rgb(255,175,0)'
  // if (between(percent, 69, 60)) return 'rgb(255,255,0)'
  // if (between(percent, 59, 50)) return 'rgb(205,255,0)'
  // if (between(percent, 49, 40)) return 'rgb(130,255,0)'
  // if (between(percent, 39, 30)) return 'rgb(0,255,155)'
  // if (between(percent, 29, 20)) return 'rgb(0,230,255)'
  // if (between(percent, 19, 15)) return 'rgb(0,155,255)'
  // if (between(percent, 14, 10)) return 'rgb(0,85,255)'
  // if (between(percent, 9, 5)) return 'rgb(135,0,255)'
  // if (between(percent, 4, 1)) return 'rgb(230,255,255)'
  // else return 'rgb(10,10,10)'
}

export const getTileColor = (percent: number) => {
  if (between(percent, 100, 20)) return TILE_COLORS[5]
  if (between(percent, 19, 15)) return TILE_COLORS[4]
  if (between(percent, 14, 10)) return TILE_COLORS[3]
  if (between(percent, 9, 5)) return TILE_COLORS[2]
  if (between(percent, 4, 1)) return TILE_COLORS[1]
  else return TILE_COLORS[0]
}
