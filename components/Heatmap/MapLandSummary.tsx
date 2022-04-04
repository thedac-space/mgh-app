import React from 'react'
import { Metaverse } from '../../lib/enums'
import { typedKeys } from '../../lib/utilities'
import { handleLandName } from '../../lib/valuation/valuationUtils'

interface Props {
  coordinates: { x: number; y: number }
  metaverse: Metaverse
}

const MapLandSummary = ({ coordinates, metaverse }: Props) => {
  return (
    <div className='gray-box bg-opacity-100'>
      {/* {handleLandName(metaverse, coordinates)} */}
      <div className='flex gap-4'>
        {typedKeys(coordinates).map((coord) => (
          <span key={coord} className='text-white font-semibold'>
            {coord.toUpperCase()}: {coordinates[coord]}
          </span>
        ))}
      </div>
    </div>
  )
}

export default MapLandSummary
