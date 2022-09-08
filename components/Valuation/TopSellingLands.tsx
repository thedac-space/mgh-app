import { useEffect, useState } from "react"

import TableStructure from "./TopSellingTable/TableStructure"
import { TopSellings } from "../../types/TopSelling"
import { Metaverse } from "../../lib/metaverse"
import TopSellingFilter, { TopSellingFilterBy } from "./TopSellingTable/TopSellingFilter"
import { fetchChartData } from "../Analytics/fetchChartData"

const TopSellingLands = (props : {metaverse : Metaverse}) => {
  const [topSellings, setTopSellings] = useState<TopSellings | any>({})
  const [filterBy, setFilterBy] = useState<TopSellingFilterBy>('totalTop')
  
  async function waitingData(metaverse: Metaverse) {
    const data = await fetchChartData(metaverse, 'topSellingLands')
    setTopSellings(data)
  }

  useEffect(() => { waitingData(props.metaverse) }, [props.metaverse])

  return (
    <div className='flex flex-col items-start rounded-xl py-3 px-4 w-full gray-box text-left mb-10'>
      {
        Object.entries(topSellings).length === 0 ?
        <p className={`text-xs sm:text-sm text-gray-400`}>LOADING TOP SELLINGS...</p> :
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded text-white">
          <div className="block w-full overflow-x-auto">
            <TopSellingFilter filterBy={filterBy} setFilterBy={setFilterBy}/>
          </div>
          <div className="block w-full overflow-x-scroll scrollbar--x scrollbar">
            <TableStructure filterby={{element: filterBy, data: topSellings[filterBy]}}/>
          </div>
        </div>
      }
    </div>
  )
}

export default TopSellingLands