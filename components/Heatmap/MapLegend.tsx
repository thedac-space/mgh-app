import React from 'react'
import { LegendFilter } from '../../lib/heatmap/heatmapCommonTypes'
import { DICTIONARY_COLORS } from '../../lib/heatmap/valuationColoring'
import { formatName, typedKeys } from '../../lib/utilities'

interface Props {
  legendFilter: LegendFilter
  setLegendFilter: React.Dispatch<React.SetStateAction<LegendFilter>>
}

const MapLegend = ({ legendFilter, setLegendFilter }: Props) => {
  const handleLegendClick = (legend: keyof typeof DICTIONARY_COLORS) => {
    if (['watchlist', 'portfolio', 'on-sale'].includes(legend)) {
      setLegendFilter(
        legend === legendFilter ? undefined : (legend as LegendFilter)
      )
    }
  }

  return (
    <ul className='flex flex-col gap-2 gray-box bg-opacity-100 '>
      {typedKeys(DICTIONARY_COLORS).map((key) => (
        <li className='flex gap-6 items-center' key={key}>
          <button
            style={{ background: DICTIONARY_COLORS[key] }}
            className={
              'w-4 h-4 top-[2px] peer cursor-pointer ' +
              (legendFilter && legendFilter !== key && 'opacity-30')
            }
            onClick={() => handleLegendClick(key)}
          />
          <span className='text-gray-200 text-sm md:text-base font-semibold'>
            {formatName(key)}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default MapLegend
