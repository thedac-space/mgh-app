import React from 'react'
import { TILE_COLORS } from '../../lib/heatmap/valuationColoring'
import { typedKeys } from '../../lib/utilities'

const ColorGuide = () => {
  const colorsArray = typedKeys(TILE_COLORS)
  return (
    <div className='flex gap-2 gray-box h-16 bg-opacity-100 items-center w-max'>
      {colorsArray.map((color, i) => (
        <span key={color}>
          {i === 0 && (
            <span className='text-gray-200 text-sm font-semibold'>
              Min
              {i === colorsArray.length - 1 && 'Max'}
            </span>
          )}
          {i !== 0 && (
            <div
              style={{ background: TILE_COLORS[color] }}
              className='w-4 h-4'
            ></div>
          )}
          {i === colorsArray.length - 1 && (
            <span className='text-gray-200 text-sm font-semibold'>Max</span>
          )}
        </span>
      ))}
    </div>
  )
}

export default ColorGuide
