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

// Calculating Percentages depending on the current chosen filter.
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
        // This just makes all lands have 20 as their percent in order to make them all green.
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

// Calculate if number is within a certain range
const between = (x: number, max: number, min: number) => {
  return x <= max && x > min
}

// Using this to display those 5 squares on the map to use as filter buttons
export const FILTER_COLORS = {
  5: 'rgb(255,0,0)', //RED - Max
  4: 'rgb(255,137,0)', // ORANGE
  3: 'rgb(255,255,0)', // YELLOW
  2: 'rgb(0,255,0)', // GREEN
  1: 'rgb(0,255,255)', // BLUE -  Min
  0: 'rgb(50,50,50)', // GRAY - None
}

/*
 * Sadly, some prices on the eth_predicted_price are super high, making all the other lands very low
 * priced in % compared to them. If we were to divide lands into colors by percentage,
 * the high lands would be on 100% and the rest of them would end up on the lower 30/20%.
 * If we used normal percentages, most lands would be blue the higher ones red, defeating the purpose of the map since there would barely be
 * any yellow/orange or green.
 * To balance this out and make the map have more contrast between the lower lands we write that
 * lands using RED color are the ones that spawn from 100% til 30%. ORANGE from 10% til 5%. YELLOW from 5% til 2%
 * and Light-Blue from 2% till 0%. For the other filters we just use normal percentage, but with any case were the high numbers
 * are way too high compared to the other ones it might make the map more worthy of using to switch the % like we are doing with
 * eth_predicted_price.
 */
const filterPercentages = {
  eth_predicted_price: { 4: 30, 3: 10, 2: 5, 1: 2 },
  normal: { 4: 80, 3: 60, 2: 40, 1: 20 },
}

const filterKey = (mapFilter: MapFilter | undefined) => {
  return mapFilter === 'eth_predicted_price' ? 'eth_predicted_price' : 'normal'
}

/*
 *  We calculate percentages within a range with the formula ((X−Min%)/(Max%−Min%)) × 100
 * so If max number was 20 and min was 5 and we wanted to calculate what % is 10
 * we would do ((10-5)/(20-5)) * 100 = colorFromPercentage
 * we multiply by 255 if we wanted the result to be a number between 0 and 255 for RGB colors
 * and if we want it to end up being a number between Y = 255 and Z = 170 to fit a certain color,
 *              ((X−Min%)/(Max%−Min%)) * (Y - Z) + Z = colorFromPercentage
 * we could do  ((10-5)/(20-5)) * (255 - 170) + 170 = colorFromPercentage. The higher the number the closer to 255.
 * If we want to do it so that the lower the number the closer to 255 and the higher the closer to 170
 *                     Y - ((X−Min%)/(Max%−Min%)) * (Y - Z) = colorFromReversePercentage
 *  then we can do: 255 - ((10-5)/ (20-5)) * (255 - 170) = colorFromReversePercentage
 * */
export const generateColor = (percent: number, mapFilter?: MapFilter) => {
  if (percent === 0 || !mapFilter) return 'rgb(50,50,50)'
  const colors = {
    // CAREFUL WITH FORGETTING THE COMAS BETWEEN NUMBERS ON THE RGB!!!

    // RED: rgb(255, 0..70, 0)
    5: `rgb(255, ${
      70 -
      Math.ceil(
        ((percent - filterPercentages[filterKey(mapFilter)][4]) /
          (100 - filterPercentages[filterKey(mapFilter)][4])) *
          70
      )
    },0)`,
    // ORANGE: rgb(255, 100..170, 0)
    4: `rgb(255,${
      170 -
      Math.ceil(
        ((percent - filterPercentages[filterKey(mapFilter)][3]) /
          (filterPercentages[filterKey(mapFilter)][4] -
            filterPercentages[filterKey(mapFilter)][3])) *
          (170 - 100)
      )
    },0)`,
    // YELLOW: rgb(255, 190..255, 0)
    3: `rgb(255,${
      255 -
      Math.ceil(
        ((percent - filterPercentages[filterKey(mapFilter)][2]) /
          (filterPercentages[filterKey(mapFilter)][3] -
            filterPercentages[filterKey(mapFilter)][2])) *
          (255 - 190)
      )
    },0)`,
    // GREEN: rgb(0..170, 255, 0)
    2: `rgb(${Math.ceil(
      ((percent - filterPercentages[filterKey(mapFilter)][1]) /
        (filterPercentages[filterKey(mapFilter)][2] -
          filterPercentages[filterKey(mapFilter)][1])) *
        170
    )},255,0)`,
    // LIGHT-BLUE: rgb(0, 255, 160..255)
    1: `rgb(0,255,${
      255 -
      Math.ceil(
        (percent / filterPercentages[filterKey(mapFilter)][1]) * (255 - 160)
      )
    })`,
  }

  if (between(percent, 100, filterPercentages[filterKey(mapFilter)][4]))
    return colors[5] // REDS
  if (
    between(
      percent,
      filterPercentages[filterKey(mapFilter)][4],
      filterPercentages[filterKey(mapFilter)][3]
    )
  )
    return colors[4] // ORANGES
  if (
    between(
      percent,
      filterPercentages[filterKey(mapFilter)][3],
      filterPercentages[filterKey(mapFilter)][2]
    )
  )
    return colors[3] // YELLOWS
  if (
    between(
      percent,
      filterPercentages[filterKey(mapFilter)][2],
      filterPercentages[filterKey(mapFilter)][1]
    )
  )
    return colors[2] // GREENS
  if (between(percent, filterPercentages[filterKey(mapFilter)][1], 0))
    return colors[1]
  // LIGHT-BLUES
  else return 'rgb(50,50,50)' // GRAY
}

// Checking if A) the filter corresponds to the current range/color. B) if there is any filter at all
const filterIs = (number: PercentFilter, percentFilter: PercentFilter) => {
  return percentFilter === number || !percentFilter
}

export const getTileColor = (
  percent: number,
  percentFilter: PercentFilter,
  mapFilter?: MapFilter
) => {
  if (percent > 100)
    return filterIs(100, percentFilter) ? 'rgb(120,0,0)' : generateColor(0)
  /**
   *  If filter is 100 show only this RED tiles.
   * If no filter all color tiles will show
   * If filter is a different number then only tiles from that number/color
   * will show.
   * */

  if (between(percent, 100, filterPercentages[filterKey(mapFilter)][4]))
    /**
     *  If filter is 100 show only this RED tiles.
     * If no filter all color tiles will show
     * If filter is a different number then only tiles from that number/color
     * will show.
     * */
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
