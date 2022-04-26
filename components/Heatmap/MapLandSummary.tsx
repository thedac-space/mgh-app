import React from 'react'
import { typedKeys } from '../../lib/utilities'

interface Props {
  coordinates: { x: number; y: number }
}

const MapLandSummary = ({ coordinates }: Props) => {
  return (
    <div className='gray-box bg-opacity-100 h-16'>
      <div className='flex gap-4 w-30'>
        {typedKeys(coordinates).map((coord) => (
          <span
            key={coord}
            className='text-white font-semibold whitespace-nowrap'
          >
            {coord.toUpperCase()}:{' '}
            {isNaN(coordinates[coord]) ? 'xx' : coordinates[coord]}
          </span>
        ))}
      </div>
    </div>
  )
}

export default MapLandSummary
