import React, { useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { BiTargetLock } from 'react-icons/bi'
import { AiFillFire } from 'react-icons/ai'
import { IoIosArrowDown } from 'react-icons/io'
import { MdAttachMoney } from 'react-icons/md'
import { VscGraphLine } from 'react-icons/vsc'
import { typedKeys } from '../../lib/utilities'
import { useAppSelector } from '../../state/hooks'

interface Props {
  filterBy: any
  setFilterBy: any
}

const TopSellingFilter = ({ filterBy, setFilterBy }: Props) => {
  const { role } = useAppSelector((state) => state.account)
  const isPremium = !role //This will be changed once we finish role setup

  const [opened, setOpened] = useState(false)
  const filterOptions = {
    totalTop: {
      name: 'Total Top',
      shortName: undefined,
      icon: <AiFillFire />
    },
    yesterdayTop: {
      name: 'Filtered for a day',
      shortName: undefined,
      icon: <BiTargetLock />,
    },
    monthTop: {
      name: 'Filtered for a month',
      shortName: undefined,
      icon: <VscGraphLine />,
    },
    yearTop: {
      name: 'Filtered for a year',
      shortName: undefined,
      icon: <MdAttachMoney />,
    }
  }
  return (
    <div>
      {/* Filter Button + Name */}
      <button
        onClick={() => setOpened(!opened)}
        className='h-16 gray-box bg-opacity-100 mb-2 items-center w-70 tracking-wider font-semibold text-gray-200 hover:text-white flex justify-between cursor-pointer transition-all'
      >
        {/* Icon */}
        <span className='hidden sm:block text-lg'>
          {filterOptions[filterBy].icon}
        </span>

        {/* Name */}
        <p className='hidden sm:block'>
          {filterOptions[filterBy].shortName ?? filterOptions[filterBy].name}
        </p>
        {/* Mobile Name */}
        <p className='block sm:hidden'>Stats</p>
        {/* Down/Up Arrow */}

        <IoIosArrowDown
          className={
            (isPremium ? '' : 'opacity-0 ') +
            (opened ? 'rotate-180 ' : '') +
            'transition-all duration-500 relative bottom-[1px]'
          }
        />
      </button>
      {/* FilterOptions */}
      <div className={ (opened && 'mb-1 md:mb-0') + 'md:absolute flex flex-col gap-2'} >
        {opened &&
          isPremium &&
          typedKeys(filterOptions).map(
            (filter) =>
              filter !== filterBy && (
                <Fade duration={500} key={filter} direction='down'>
                  <button
                    className='flex gray-box gap-4 bg-opacity-100 items-center text-gray-200 hover:text-white font-semibold w-70 text-sm md:text-base'
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

export default TopSellingFilter
