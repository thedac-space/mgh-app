import { typedKeys } from '../utilities'
import { ValuationTile } from './commonTypes'

export const getAverage = (array: (number | undefined)[]) => {
  console.log('filtering')
  const filteredArray = array.filter((e) => typeof e === 'number') as number[]
  console.log('getting max')
  const max = Math.max(...filteredArray.sort((a, b) => a + b).slice(1))
  console.log('summing')
  const sum = filteredArray.reduce((prev, current) => prev + current)
  const average = sum / array.length
  return { max, average }
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
  element:
    | 'eth_predicted_price'
    | 'predicted_price'
    | 'current_price'
    | 'transfers'
) => {
  console.log('setting colors')
  const predictions = typedKeys(valuationAtlas).map(
    (valuation) => valuationAtlas[valuation][element]
  )

  const { max, average } = getAverage(predictions)
  console.log({ max })
  await Promise.all(
    typedKeys(valuationAtlas).map((valuation) => {
      const percent = getPercentage(valuationAtlas[valuation][element], max)
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
