import { useEffect, useState } from "react"
import searchTopSellings from '../../backend/services/topSellingLands'
import TopSellingFilter from "./TopSellingTable/TopSellingFilter"
import TableStructure from "./TopSellingTable/TableStructure"
import { TopSellings } from "../../types/TopSelling"

const TopSellingLands = (props : {metaverse : string}) => {
  const [topSellings, setTopSellings] = useState<TopSellings | any>({})
  const [metaverse, setMetaverse] = useState<string>(props.metaverse)
  const [filterBy, setFilterBy] = useState('totalTop')
  
  if (!(props.metaverse == metaverse)){
    setTopSellings({})
    setMetaverse(props.metaverse)
  }
  
  async function waitingData(metaverse: string) {
    const data = await searchTopSellings(metaverse)
    setTopSellings(data)
  }

  useEffect(() => {
    waitingData(metaverse)
  }, [metaverse])

  return (
    <div className='flex flex-col items-start shadow-blck rounded-xl py-3 px-4 w-full bg-grey-dark bg-opacity-20 text-left'>
      {
        Object.entries(topSellings).length === 0 ?
        <p className={`text-xs sm:text-sm text-gray-400`}>LOADING TOP SELLINGS...</p> :
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-slate-900 text-white">
          <TopSellingFilter filterBy={filterBy} setFilterBy={setFilterBy}/>
          <div className="block w-full overflow-x-auto ">
            <TableStructure filterby={{element: filterBy, data: topSellings[filterBy]}}/>
          </div>
        </div>
      }
    </div>
  )
}

export default TopSellingLands