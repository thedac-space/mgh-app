import { TopSellingRequestItem } from "../../../types/TopSelling"

export const handleOrderAsset = (sortDir: boolean, setSortDir: Function, data: [key: TopSellingRequestItem], setData: Function) => {
  let sortArray = data
  sortArray.sort((a: TopSellingRequestItem, b: TopSellingRequestItem) => {
    let returns = 0
    if (Number(a.data.dataLand.coords.y) > Number(b.data.dataLand.coords.y))
      returns = 1
    if (Number(a.data.dataLand.coords.y) < Number(b.data.dataLand.coords.y))
      returns = -1
    return sortDir ? returns : - returns
  })
  sortArray.sort((a: TopSellingRequestItem, b: TopSellingRequestItem) => {
    let returns = 0
    if (Number(a.data.dataLand.coords.x) > Number(b.data.dataLand.coords.x))
      returns = 1
    if (Number(a.data.dataLand.coords.x) < Number(b.data.dataLand.coords.x))
      returns = -1
    return sortDir ? returns : - returns
  })
  setSortDir(!sortDir)
  setData(sortArray)
}

export const handleOrderRank = (sortDir: boolean, setSortDir: Function, data: [key: TopSellingRequestItem], setData: Function) => {
  let sortArray = data
  sortArray.sort((a: TopSellingRequestItem, b: TopSellingRequestItem) => {
    if (sortDir) {
      return a['position'] - b['position']
    } else {
      return - (a['position'] - b['position'])
    }
  })
  setSortDir(!sortDir)
  setData(sortArray)
}

export const handleOrderPrice = (sortDir: boolean, setSortDir: Function, data: [key: TopSellingRequestItem], setData: Function) => {
  let sortArray = data
  sortArray.sort((a: TopSellingRequestItem, b: TopSellingRequestItem) => {
    let returns = 0
    if (parseInt(a.data.dataTable.price) > parseInt(b.data.dataTable.price))
      returns = 1
    if (parseInt(a.data.dataTable.price) < parseInt(b.data.dataTable.price))
      returns = -1
    return sortDir ? returns : - returns
  })
  setSortDir(!sortDir)
  setData(sortArray)
}

type MapAtribute =
|  'asset'
|  'date'
|  'external_link'
|  'from'
|  'image'
|  'owner'
|  'price'
|  'symbol'

export const handleOrder = ( atribute: MapAtribute, sortDir: boolean, setSortDir: Function, data: [key: TopSellingRequestItem], setData: Function ) => {
  let sortArray = data
  sortArray.sort((a: TopSellingRequestItem, b: TopSellingRequestItem) => {
    let returns = 0
    if (a.data.dataTable[atribute] > b.data.dataTable[atribute])
      returns = 1
    if (a.data.dataTable[atribute] < b.data.dataTable[atribute])
      returns = -1
    return sortDir ? returns : - returns
  })
  setSortDir(!sortDir)
  setData(sortArray)
}