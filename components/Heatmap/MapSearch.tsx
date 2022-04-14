import React, { useState } from 'react'
import { BsQuestionCircle } from 'react-icons/bs'
import { getState, typedKeys } from '../../lib/utilities'
import { VALUATION_STATE } from '../../pages/valuation'
import SearchLandButton from './SearchLandButton'

interface Props {
  mapState: keyof typeof VALUATION_STATE
  handleMapSelection: (
    x?: number | undefined,
    y?: number | undefined,
    tokenId?: string | undefined
  ) => Promise<NodeJS.Timeout | undefined>
}

const MapSearch = ({ mapState, handleMapSelection }: Props) => {
  const [landId, setLandId] = useState('')
  const [coordinates, setCoordinates] = useState({ X: '', Y: '' })
  const [loadingQuery] = getState(mapState, ['loadingQuery'])

  const [searchBy, setSearchBy] = useState<'coordinates' | 'id'>('coordinates')
  const searchById = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleMapSelection(undefined, undefined, landId)
  }
  const searchByCoordinates = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleMapSelection(Number(coordinates.X), Number(coordinates.Y))
  }
  const searchOptions = {
    coordinates: {
      search: searchByCoordinates,
      text: 'Go by Coordinates',
      hasGuide: false,
    },
    id: {
      search: searchById,
      text: 'Go by ID',
      hasGuide: true,
    },
  }

  return (
    <div className='flex flex-col gap-6 absolute'>
      {/* Search */}
      <form
        className='gray-box bg-opacity-100'
        onSubmit={(e) => searchOptions[searchBy].search(e)}
      >
        <p className='mb-4 font-semibold text-gray-200 text-lg pt-1'>
          Search by
        </p>
        <div className='flex flex-col gap-2 mb-4'>
          {/* Mapping through search options */}
          {typedKeys(searchOptions).map((filter) => (
            <span className='flex gap-2 items-center relative'>
              <input
                type='radio'
                name={filter}
                value={filter}
                checked={searchBy === filter}
                onChange={() => setSearchBy(filter)}
              />
              <label className='text-gray-200 text-sm font-semibold'>
                {filter[0].toLocaleUpperCase() + filter.substring(1)}
              </label>
              {searchOptions[filter].hasGuide && (
                <>
                  <BsQuestionCircle className='text-gray-300 cursor-pointer peer relative bottom-[2px]' />
                  <p className='absolute -top-7 border border-gray-500 -left-6 xs:left-0 pl-2 p-2 rounded-lg bg-black bg-opacity-10 backdrop-filter backdrop-blur font-medium text-xs text-gray-200 hidden peer-hover:block w-70'>
                    Find LAND on Opensea &gt; Details &gt; Token ID
                  </p>
                </>
              )}
            </span>
          ))}
        </div>

        {/* Inputs */}
        <div className='flex flex-col gap-4 relative'>
          <div className='flex gap-2'>
            {searchBy === 'coordinates' ? (
              // Coordinates Input
              typedKeys(coordinates).map((coord) => (
                <input
                  disabled={loadingQuery}
                  key={coord}
                  required
                  type='number'
                  onChange={(e) =>
                    setCoordinates({
                      ...coordinates,
                      [coord]: e.target.value,
                    })
                  }
                  value={coordinates[coord]}
                  placeholder={coord}
                  className='font-semibold border-gray-300 placeholder-gray-300 bg-transparent block w-16  text-white p-3 focus:outline-none border border-opacity-40 hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-opacity-75'
                />
              ))
            ) : (
              // Id Input
              <input
                disabled={loadingQuery}
                required
                type='number'
                onChange={(e) => setLandId(e.target.value)}
                value={landId}
                placeholder='14271'
                className='font-semibold border-gray-300 placeholder-gray-300 bg-transparent block w-[8.5rem] text-white p-3 focus:outline-none border border-opacity-40 hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-opacity-75'
              />
            )}
          </div>
          {/* Add land Button */}
          <SearchLandButton searchBy={searchBy} mapState={mapState} />
        </div>
      </form>
    </div>
  )
}

export default MapSearch
