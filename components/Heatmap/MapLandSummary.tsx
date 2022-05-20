import React from 'react'
import { fetchHeatmapLand } from '../../lib/heatmap/fetchHeatmapLand'
import { getLandSummary } from '../../lib/heatmap/getLandSummary'
import { ValuationTile } from '../../lib/heatmap/heatmapCommonTypes'
import { Metaverse } from '../../lib/metaverse'
import { typedKeys } from '../../lib/utilities'
import { ICoinPrices } from '../../lib/valuation/valuationTypes'

interface Props {
  map: Record<string, ValuationTile>

  metaverse: Metaverse
  coordinates: { x: number; y: number }
}

const MapLandSummary = ({ map, metaverse, coordinates }: Props) => {
  const { owner } = getLandSummary(map, coordinates)
  return (
    <div className='gray-box bg-opacity-100'>
      <div className='flex gap-4'>
        {typedKeys(coordinates).map((coord) => (
          <span
            key={coord}
            className='text-white font-semibold whitespace-nowrap'
          >
            {coord.toUpperCase()}:{' '}
            {isNaN(coordinates[coord]) ? 'xx' : coordinates[coord]}
          </span>
        ))}

        {/* {land?. &&       <span>{land?.apiData.name }</span>} */}
      </div>

      <span className='text-white font-semibold'>
        Owner: {owner ? owner : 'None'}
      </span>
    </div>
  )
}

export default MapLandSummary
