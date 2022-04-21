import { typedKeys } from '../utilities'
import { MapFilter, PercentFilter, ValuationTile } from './heatmapCommonTypes'

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
  return Math.floor((partialValue * 100) / totalValue)
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
  } else if (element === 'basic') {
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
      } else if (element === 'basic') {
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
  return x <= max && x > min
}

export const FILTER_COLORS = {
  5: 'rgb(255,0,0)', // Max
  4: 'rgb(255,137,0)',
  3: 'rgb(255,255,0)',
  2: 'rgb(0,255,0)',
  1: 'rgb(0,255,255)', // Min
  0: 'rgb(50,50,50)', // None
}

const filterPercentages = {
  eth_predicted_price: { 4: 30, 3: 10, 2: 5, 1: 2 },
  normal: { 4: 80, 3: 60, 2: 40, 1: 20 },
}

const filterKey = (mapFilter: MapFilter | undefined) => {
  return mapFilter === 'eth_predicted_price' ? 'eth_predicted_price' : 'normal'
}

export const generateColor = (percent: number, mapFilter?: MapFilter) => {
  if (percent === 0 || !mapFilter) return 'rgb(50,50,50)'

  const colors = {
    3: `rgb(255,${255 - Math.ceil((percent - 60 / 100 - 60) * 255)},0)`, // Orange and Red (until 60%) - MAX
    2: `rgb(${Math.ceil((percent - 20 / 60 - 20) * 255)},255,0)`, // Yello and Green (until 20%)
    1: `rgb(0,255,${255 - Math.ceil((percent / 20) * 255)})`, // Light-blue
  }
  // const colors = {
  //   3: `rgb(255,${255 - Math.ceil((percent - 60 / 100 - 60) * 255)},0)`, // Orange and Red (until 60%) - MAX
  //   2: `rgb(${Math.ceil((percent - 20 / 60 - 20) * 255)},255,0)`, // Yello and Green (until 20%)
  //   1: `rgb(0,255,${255 - Math.ceil((percent / 20) * 255)})`, // Light-blue
  // }
  if (between(percent, 100, 60)) return colors[3]
  if (between(percent, 60, 20)) return colors[2]
  if (between(percent, 20, 0)) return colors[1]
  else return 'rgb(50,50,50)'
}

const filterIs = (number: PercentFilter, percentFilter: PercentFilter) => {
  return percentFilter === number || !percentFilter
}

export const getTileColor = (
  percent: number,
  percentFilter: PercentFilter,
  mapFilter?: MapFilter
) => {
  if (between(percent, 100, filterPercentages[filterKey(mapFilter)][4]))
    return filterIs(100, percentFilter)
      ? generateColor(percent, mapFilter)
      : generateColor(0)
  if (
    between(
      percent,
      filterPercentages[filterKey(mapFilter)][4],
      filterPercentages[filterKey(mapFilter)][3]
    )
  )
    return filterIs(80, percentFilter)
      ? generateColor(percent, mapFilter)
      : generateColor(0)
  if (
    between(
      percent,
      filterPercentages[filterKey(mapFilter)][3],
      filterPercentages[filterKey(mapFilter)][2]
    )
  )
    return filterIs(60, percentFilter)
      ? generateColor(percent, mapFilter)
      : generateColor(0)
  if (
    between(
      percent,
      filterPercentages[filterKey(mapFilter)][2],
      filterPercentages[filterKey(mapFilter)][1]
    )
  )
    return filterIs(40, percentFilter)
      ? generateColor(percent, mapFilter)
      : generateColor(0)
  if (between(percent, filterPercentages[filterKey(mapFilter)][1], 0))
    return filterIs(20, percentFilter)
      ? generateColor(percent, mapFilter)
      : generateColor(0)
  else return generateColor(0)
}
