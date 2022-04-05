import React, { useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { IoIosArrowDown } from 'react-icons/io'
import { MapFilter } from '../../lib/heatmap/commonTypes'
import { typedKeys } from '../../lib/utilities'

interface Props {
  filterBy: MapFilter
  setFilterBy: React.Dispatch<React.SetStateAction<MapFilter>>
}

const MapChooseFilter = ({ filterBy, setFilterBy }: Props) => {
  const [opened, setOpened] = useState(false)
  const filterOptions = {
    transfers: { name: 'Transfers' },
    currentPrice: { name: 'Current Price' },
    priceVariWeek: { name: 'Weekly Price Variation' },
    priceVariMonth: { name: 'Monthly Price Variation' },
    priceVariSemester: { name: 'Semester Price Variation' },
    predictionPrice: { name: 'Predicted Price' },
    priceDiff: { name: 'Best Offers' },
  }
  return (
    <div>
      <button
        onClick={() => setOpened(!opened)}
        className='h-16 gray-box bg-opacity-100 mb-2 items-center w-56 tracking-wider font-semibold text-gray-200 hover:text-white flex justify-between cursor-pointer transition-all'
      >
        <span>{filterOptions[filterBy].name}</span>
        <IoIosArrowDown
          className={
            (opened ? 'rotate-180' : '') +
            ' transition-all duration-500 relative bottom-[1px]'
          }
        />
      </button>
      <div className='flex flex-col gap-2'>
        {opened &&
          typedKeys(filterOptions).map(
            (filter) =>
              filter !== filterBy && (
                <Fade duration={500} key={filter} direction='down'>
                  <button
                    className='flex gray-box gap-4 bg-opacity-100 items-center text-gray-200 hover:text-white font-semibold'
                    onClick={() => {
                      setFilterBy(filter)
                      setOpened(false)
                    }}
                  >
                    {/* <OptimizedImage
                      height={25}
                      width={25}
                      src={filterOptions[filter].src}
                    /> */}
                    <span>{filterOptions[filter].name}</span>
                  </button>
                </Fade>
              )
          )}
      </div>
    </div>
  )
}

export default MapChooseFilter
