import React, { useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { BiTargetLock, BiTransferAlt } from 'react-icons/bi'
import { FiMap } from 'react-icons/fi'
import { IoIosArrowDown } from 'react-icons/io'
import { MdAttachMoney, MdOutlineLocalOffer } from 'react-icons/md'
import { VscGraphLine } from 'react-icons/vsc'
import { MapFilter } from '../../lib/heatmap/heatmapCommonTypes'
import { typedKeys } from '../../lib/utilities'

interface Props {
  filterBy: MapFilter
  setFilterBy: React.Dispatch<React.SetStateAction<MapFilter>>
}

const MapChooseFilter = ({ filterBy, setFilterBy }: Props) => {
  const [opened, setOpened] = useState(false)
  const filterOptions = {
    basic: { name: 'Basic', shortName: undefined, icon: <FiMap /> },
    eth_predicted_price: {
      name: 'Predicted Price',
      shortName: undefined,
      icon: <BiTargetLock />,
    },
    transfers: {
      name: 'Transfers',
      shortName: undefined,
      icon: <BiTransferAlt />,
    },
    current_price: {
      name: 'Current Price',
      shortName: undefined,
      icon: <MdAttachMoney />,
    },
    variation_last_week: {
      name: 'Weekly Price Variation',
      shortName: 'W.P.V.',
      icon: <VscGraphLine />,
    },
    variation_last_four_weeks: {
      name: 'Monthly Price Variation',
      shortName: 'M.P.V.',
      icon: <VscGraphLine />,
    },
    variation_last_six_months: {
      name: 'Semestral Price Variation',
      shortName: 'S.P.V.',
      icon: <VscGraphLine />,
    },
  }
  return (
    <div>
      <button
        onClick={() => setOpened(!opened)}
        className='h-16 gray-box bg-opacity-100 mb-2 items-center w-70 tracking-wider font-semibold text-gray-200 hover:text-white flex justify-between cursor-pointer transition-all'
      >
        <span className='text-lg'>{filterOptions[filterBy].icon}</span>
        <p>
          {filterOptions[filterBy].shortName ?? filterOptions[filterBy].name}
        </p>
        <IoIosArrowDown
          className={
            (opened ? 'rotate-180' : '') +
            ' transition-all duration-500 relative bottom-[1px]'
          }
        />
      </button>
      <div className='absolute flex flex-col gap-2'>
        {opened &&
          typedKeys(filterOptions).map(
            (filter) =>
              filter !== filterBy && (
                <Fade duration={500} key={filter} direction='down'>
                  <button
                    className='flex gray-box gap-4 bg-opacity-100 items-center text-gray-200 hover:text-white font-semibold w-70'
                    onClick={() => {
                      setFilterBy(filter)
                      setOpened(false)
                    }}
                  >
                    {filterOptions[filter].icon}
                    <span className='whitespace-nowrap'>
                      {filterOptions[filter].name}
                    </span>
                  </button>
                </Fade>
              )
          )}
      </div>
    </div>
  )
}

export default MapChooseFilter
