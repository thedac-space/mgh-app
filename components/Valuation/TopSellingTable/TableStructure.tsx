import { useEffect, useState } from "react"
import TableItem from "./TableItem"
import { handleOrder, handleOrderAsset, handleOrderRank, handleOrderPrice } from "./Order"
import { TopSellingRequestItem } from "../../../types/TopSelling"

interface filterBy {
  element: String,
  data: [key: TopSellingRequestItem]
}

const TableStructure = ({ filterby }: { filterby: filterBy }) => {
  const filterData = (data: any) => {
    let result: any = []
    data.map((value: any) => value.position ? result.push(value) : false)
    return result
  }

  const [response, setResponse] = useState<[key: TopSellingRequestItem]>(filterData(filterby.data))
  const [sortDir, setSortDir] = useState<boolean>(false)

  const thStyle = "px-6 align-middle py-3 text-xs lg:text-lg border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-800 text-slate-200 border-slate-700 cursor-pointer"

  useEffect(() => {
    setResponse(filterData(filterby.data))
  }, [filterby])

  return (
    <>
      {
        response[0] ?
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className={thStyle} onClick={() => handleOrderRank(sortDir, setSortDir, response, setResponse)} >Rank</th>
                <th className={thStyle} >Asset</th>
                <th className={thStyle} >Price</th>
                <th className={thStyle} >Buyer</th>
                <th className={thStyle} >Purchased</th>
              </tr>
            </thead>
            <tbody className="bg-transparent items-center justify-between w-full h-52">
              {
                response.map((value) => <TableItem key={value.position} item={value} />)
              }
            </tbody>
          </ table> :
          <h3 className="px-6 text-lg text-white">NO LANDS</h3>
      }
    </>
  )
}

export default TableStructure