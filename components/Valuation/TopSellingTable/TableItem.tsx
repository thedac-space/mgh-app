import { Metaverse } from "../../../lib/metaverse"
import { TopSellingDataTable, TopSellingRequestItem } from "../../../types/TopSelling"

const getExternalLink = (metaverse: Metaverse, dataTable: TopSellingDataTable) => {
  return metaverse === 'somnium-space' ? ("https://somniumspace.com/parcel/" + dataTable.landId) : dataTable.external_link
}

const TableItem = ({ item, metaverse }: { item: TopSellingRequestItem, metaverse: Metaverse }) => {
  let dataTable: TopSellingDataTable | any = item.dataTable || null

  const priceLoader = () => {
    if (dataTable.price == 0)
      return <span className="mr-2">Loading...</span>
    return <span className="mr-2">{`${Number.parseFloat(dataTable.eth_price).toFixed(3)} ${dataTable.symbol}`}</span>
  }

  const tdStyle = "border-t-0 px-8 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4"

  return (
    <tr>
      <td className={tdStyle}>{item.position}</td>
      <th className={`${tdStyle} text-left flex items-center`}>
        <img src={dataTable.image} className="h-12 w-12 bg-white rounded-full border" alt={`Land ${dataTable.asset} image`} />
        <span className="ml-3 font-bold text-white">
          Land: <a className="hover:underline text-sky-600" href={getExternalLink(metaverse, dataTable)} target='_blank'>
            {dataTable.asset}
          </a>
        </span>
      </th>
      <td className={tdStyle} >
        {priceLoader()}
      </td>
      <td className={tdStyle} >
        <span className="mr-2">{dataTable.buyer || 'anonymous'}</span>
      </td>
      <td className={tdStyle} >
        <span className="mr-2">{dataTable.date}</span>
      </td>
    </tr>
  )
}

export default TableItem