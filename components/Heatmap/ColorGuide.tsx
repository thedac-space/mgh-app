import React from 'react'
import { TILE_COLORS } from '../../lib/heatmap/valuationColoring'
import { typedKeys } from '../../lib/utilities'

const ColorGuide = () => {
  const colorsArray = typedKeys(TILE_COLORS)
  return (
    <div className='flex gap-2 gray-box h-16 bg-opacity-100 items-baseline w-max'>
      <span className='text-gray-200 text-sm font-semibold'>Min</span>
      {colorsArray.map(
        (color, i) =>
          i !== 0 && (
            <span key={color}>
              <div
                style={{ background: TILE_COLORS[color] }}
                className='w-4 h-4 relative top-[2px]'
              ></div>
            </span>
          )
      )}
      <span className='text-gray-200 text-sm font-semibold'>Max</span>
    </div>
  )
}

export default ColorGuide
