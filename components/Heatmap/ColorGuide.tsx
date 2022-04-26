import React from 'react'
import { MapFilter, PercentFilter } from '../../lib/heatmap/heatmapCommonTypes'
import { FILTER_COLORS } from '../../lib/heatmap/valuationColoring'
import { typedKeys, ValueOf } from '../../lib/utilities'

interface Props {
  setPercentFilter: React.Dispatch<React.SetStateAction<PercentFilter>>
  percentFilter: PercentFilter
  filterBy: MapFilter
}

const ColorGuide = ({ percentFilter, setPercentFilter, filterBy }: Props) => {
  const colorOptions: Record<number, PercentFilter> = {
    1: 20,
    2: 40,
    3: 60,
    4: 80,
    5: 100,
  }
  const handleColorClick = (percent: ValueOf<typeof colorOptions>) => {
    if (percentFilter === percent) {
      setPercentFilter(undefined)
    } else {
      setPercentFilter(percent)
    }
  }
  return (
    <div className='flex gap-2 gray-box h-16 bg-opacity-100 items-baseline w-max'>
      <span className='text-gray-200 text-sm font-semibold'>
        {filterBy === 'price_difference' ? 'Best' : 'Min'}
      </span>
      {typedKeys(FILTER_COLORS).map(
        (color, i) =>
          i !== 0 && (
            <span key={color} className='relative'>
              <div
                style={{ background: FILTER_COLORS[color] }}
                className={
                  'w-4 h-4 top-[2px] peer cursor-pointer ' +
                  (percentFilter &&
                    colorOptions[i] !== percentFilter &&
                    'opacity-30')
                }
                onClick={() => handleColorClick(colorOptions[i])}
              />
              <span className='hidden peer-hover:block absolute -top-5 text-gray-200 font-semibold text-xs'>
                {colorOptions[i]}%
              </span>
            </span>
          )
      )}
      <span className='text-gray-200 text-sm font-semibold'>
        {filterBy === 'price_difference' ? 'Worst' : 'Max'}
      </span>
    </div>
  )
}

export default ColorGuide
