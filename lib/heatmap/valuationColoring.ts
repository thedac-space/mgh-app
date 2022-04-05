import { typedKeys } from '../utilities'
import { MapFilter, ValuationTile } from './heatmapCommonTypes'

export const getAvgAndMax = (array: (number | undefined)[]) => {
  console.log('filtering')
  const filteredArray = array.filter((e) => typeof e === 'number') as number[]
  console.log('getting max')
  const max = Math.max(...filteredArray.sort((a, b) => a + b).slice(1))
  console.log('summing')
  // const sum = filteredArray.reduce((prev, current) => prev + current)
  // const average = sum / array.length
  return max
}

export const getPercentage = (
  partialValue: number | undefined,
  totalValue: number
) => {
  if (!partialValue) return 0
  return parseInt(((partialValue * 100) / totalValue).toFixed(0))
}

export const setColours = async (
  valuationAtlas: Record<string, ValuationTile>,
  element: MapFilter
) => {
  console.log('setting colors')
  let predictions: (number | undefined)[]
  if (element === 'transfers') {
    predictions = typedKeys(valuationAtlas).map(
      (valuation) => valuationAtlas[valuation].history?.length
    )
  } else {
    predictions = typedKeys(valuationAtlas).map(
      (valuation) => valuationAtlas[valuation][element]
    )
  }
  let max = NaN

  max = getAvgAndMax(predictions)
  console.log({ max })
  await Promise.all(
    typedKeys(valuationAtlas).map((valuation) => {
      let percent = NaN
      if (element === 'transfers') {
        percent = getPercentage(valuationAtlas[valuation].history?.length, max)
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

export const getTileColor = (percent: number) => {
  if (between(percent, 100, 20)) return 'rgb(255,0,0)'
  if (between(percent, 19, 15)) return 'rgb(255,137,0)'
  if (between(percent, 14, 10)) return 'rgb(255,255,0)'
  if (between(percent, 9, 5)) return 'rgb(0,255,0)'
  if (between(percent, 4, 1)) return 'rgb(0,255,255)'
  else return 'rgb(10,10,10)'
}
