import React from 'react'

interface Props {
  filterBy: string
  setFilterBy: Function
}

const TopSellingFilter = ({ filterBy, setFilterBy }: Props) => {

  const filterOptions = [
    { name: 'yesterdayTop', label: '1D' },
    { name: 'monthTop', label: '1M' },
    { name: 'yearTop', label: '1Y' },
    { name: 'totalTop', label: 'Max' }
  ]

  const tableTitle: any = {
    totalTop: 'TOP LANDS',
    yesterdayTop: 'TOP LANDS FILTERED BY LAST 24 HOURS',
    monthTop: 'TOP LANDS FILTERED BY LAST MOUNTH',
    yearTop: 'TOP LANDS FILTERED BY LAST YEAR',
  }

  return (
    <div className="w-full rounded-t mb-0 px-4 py-3 border-0">
      <div className="w-fullflex flex-wrap items-center">
        <div className="w-full relative w-full px-4 max-w-full flex-grow flex-1 ">
          <div className="w-full inline-flex">
            {
              filterOptions.map((item, index) =>
                <button
                  key={index}
                  type="button"
                  className="py-2.5 px-5 mr-2 mb-2 text-sm font-small focus:outline-none rounded-lg border bg-gray-800 text-gray-200 border-gray-600 hover:text-white hover:bg-gray-700"
                  onClick={() => setFilterBy(item.name)}
                >
                  {item.label}
                </button>)
            }
            <h3 className="text-lg text-white absolute top-0 right-0">{tableTitle[filterBy]}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopSellingFilter
