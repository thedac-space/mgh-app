import { useEffect, useState } from "react"
import TableItem from "./TableItem"
import { handleOrder, handleOrderAsset, handleOrderRank, handleOrderPrice } from "./Order"

const TableStructure = ({filterby} : {filterby: { element: any, data: any}}) => {
  const [data, setData] = useState<any>(filterby.data)
  const [sortDir, setSortDir] = useState<boolean>(false)
  
  useEffect(() => {
    console.log(data)
  }, [data])
  
  const thStyle = "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-800 text-slate-300 border-slate-700 cursor-pointer"

  return(
    <>
      {
        data[0].data ?
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className={thStyle} onClick={() => handleOrderRank(sortDir, setSortDir, data, setData)} >RANK</th>
              <th className={thStyle} onClick={() => handleOrderAsset(sortDir, setSortDir, data, setData)}>ASSET</th>
              <th className={thStyle} onClick={() => handleOrder('from', sortDir, setSortDir, data, setData)}>FROM</th>
              <th className={thStyle} onClick={() => handleOrder('owner', sortDir, setSortDir, data, setData)}>TO</th>
              <th className={thStyle} onClick={() => handleOrder('date', sortDir, setSortDir, data, setData)}>PURCHASED </th>
              <th className={thStyle} onClick={() => handleOrderPrice(sortDir, setSortDir, data, setData)}>PRICE</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((value: any) => <TableItem key={value.position} item={value}/>)
            }
          </tbody>
        </ table> :
        <h3 className="px-6 text-lg text-white">REQUEST ERROR</h3>
      }
    </>
  )
}

export default TableStructure