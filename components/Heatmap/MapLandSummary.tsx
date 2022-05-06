import React from 'react'
import { typedKeys } from '../../lib/utilities'


interface Props {
  coordinates: { x: number; y: number }
  ownerId: string,
  parcelName: string
}

const MapLandSummary = ({ownerId, parcelName }: Props) => {
  console.log(ownerId,"Owner")
  console.log(parcelName,"Name")
  return (
    <div className='gray-box bg-opacity-100 '>
      <div className='flex gap-4 flex-col block'>
          <span
          className='text-white font-semibold break-words'
        >
          
          {"Owner:"+(ownerId && ownerId || "none")}
        </span>
          <span
            className='text-white font-semibold whitespace-nowrap'
          >
            
            {"Name:"+parcelName}
          </span>
      </div>
    </div>
  )
}

export default MapLandSummary
