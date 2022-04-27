import React from 'react'
import { DICTIONARY_COLORS } from '../../lib/heatmap/valuationColoring'
import { formatName, typedKeys } from '../../lib/utilities'

const MapColorDictionary = () => {
  return (
    <ul className='flex flex-col gap-2 gray-box bg-opacity-100 '>
      {typedKeys(DICTIONARY_COLORS).map((key) => (
        <li className='flex gap-6 items-center' key={key}>
          <button
            style={{ background: DICTIONARY_COLORS[key] }}
            className={
              'w-4 h-4 top-[2px] peer cursor-pointer '
              // (percentFilter && DICTIONARY_COLORS[i] !== percentFilter && 'opacity-30')
            }
          />
          <span className='text-gray-200 text-sm md:text-base font-semibold'>
            {formatName(key)}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default MapColorDictionary
