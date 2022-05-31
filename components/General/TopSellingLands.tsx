import { useEffect, useState } from "react"
import searchTopSellings from '../../backend/services/topSellingLands'
import TopSellingFilter from "./TopSellingFilter"

const TableItem = ({ item } : { item: any }) => {
  const dataTable = item.data.dataTable
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
      { item.position }
      </th>
      <td className="px-6 py-4">
        Land: <a href={dataTable.external_link} target='_blank'>
          { dataTable.asset }
        </a> 
      </td>
      <td className="px-6 py-4">
        { dataTable.from }
      </td>
      <td className="px-6 py-4">
        { dataTable.owner }
      </td>
      <td className="px-6 py-4">
        { dataTable.date }
      </td>
      <td className="px-6 py-4">
        { `${dataTable.price} ${dataTable.symbol}` }
      </td>
    </tr>
  )
}

const TableStructure = ({filterby} : {filterby: { element: any, data: any}}) => {
  const tableTitle: any = {
    totalTop: 'TOP LANDS',
    yesterdayTop: 'TOP LANDS FILTERED BY LAST 24 HOURS',
    monthTop: 'TOP LANDS FILTERED BY LAST 1 MOUNTH',
    yearTop: 'TOP LANDS FILTERED BY LAST 1 YEAR',
  }

  return(
    <table className='mx-auto max-w-4xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden'>
      <caption className="px-6 py-4 text-white">{ tableTitle[filterby.element] }</caption>
      <thead className="bg-gray-900">
        <tr className="text-white text-left">
          <th className="font-semibold text-sm uppercase px-6 py-4"> RANK </th>
          <th className="font-semibold text-sm uppercase px-6 py-4"> ASSET </th>
          <th className="font-semibold text-sm uppercase px-6 py-4"> FROM </th>
          <th className="font-semibold text-sm uppercase px-6 py-4"> TO </th>
          <th className="font-semibold text-sm uppercase px-6 py-4"> PURCHASED </th>
          <th className="font-semibold text-sm uppercase px-6 py-4"> PRICE </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {
          filterby.data.map((value: any) => <TableItem key={value.position} item={value}/>)
        }
      </tbody>
    </ table>
  )
}

const TopSellingLands = (props : any) => {
  const [topSellings, setTopSellings] = useState({})
  const [metaverse, setMetaverse] = useState(props.metaverse)
  const [filterBy, setFilterBy] = useState('totalTop')
  
  if (!(props.metaverse == metaverse)){
    setTopSellings({})
    setMetaverse(props.metaverse)
  }
  
  async function waitingData(metaverse: any) {
    const data = await searchTopSellings(metaverse)
    setTopSellings(data)
  }

  useEffect(() => {
    console.log(`Cambio de filtro a: ${filterBy}`)
  }, [filterBy])

  useEffect(() => {
    waitingData(metaverse)
  }, [metaverse])

  return (
    <div className='flex flex-col items-start shadow-blck rounded-xl py-3 px-4 w-full bg-grey-dark bg-opacity-20 text-left relative overflow-x-auto shadow-md sm:rounded-lg'>
      <TopSellingFilter filterBy={filterBy} setFilterBy={setFilterBy}/>
      {
        Object.entries(topSellings).length === 0 ?
        <p className={`text-xs sm:text-sm text-gray-400`}>LOADING TOP SELLINGS...</p> :
        <>
          <TableStructure filterby={{element: filterBy, data: topSellings[filterBy]}}/>
        </>
      }
    </div>
  )
}

export default TopSellingLands