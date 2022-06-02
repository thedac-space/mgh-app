import TableItem from "./TableItem"

const TableStructure = ({filterby} : {filterby: { element: any, data: any}}) => {
  return(
    <>
      {
        filterby.data[0].data ?
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-800 text-slate-300 border-slate-700">RANK</th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-800 text-slate-300 border-slate-700">ASSET</th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-800 text-slate-300 border-slate-700">FROM</th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-800 text-slate-300 border-slate-700">TO</th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-800 text-slate-300 border-slate-700">PURCHASED </th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-800 text-slate-300 border-slate-700">PRICE</th>
            </tr>
          </thead>
          <tbody>
            {
              filterby.data.map((value: any) => <TableItem key={value.position} item={value}/>)
            }
          </tbody>
        </ table> :
        <h3 className="px-6 text-lg text-white">REQUEST ERROR</h3>
      }
    </>
  )
}

export default TableStructure