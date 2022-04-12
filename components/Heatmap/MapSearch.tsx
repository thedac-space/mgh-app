import React, { useState } from 'react'
import { BsQuestionCircle } from 'react-icons/bs'
import { Metaverse } from '../../lib/enums'
import { getState, typedKeys } from '../../lib/utilities'
import SearchLandButton from './SearchLandButton'

export const MapSearchState = {
  loading: 'loading',
  loaded: 'loaded',
  badQueryId: 'badQueryId',
  badQueryCoordinates: 'badQueryCoordinates',
  loadingQueryId: 'loadingQueryId',
  loadingQueryCoordinates: 'loadingQueryCoordinates',
  noWallet: 'noWallet',
  successId: 'successId',
  successCoordinates: 'successCoordinates',
}

interface Props {
  metaverse: Metaverse
  handleMapSelection: (x: number, y: number) => NodeJS.Timeout | undefined
}

const MapSearch = ({ metaverse, handleMapSelection }: Props) => {
  const [searchState, setSearchState] =
    useState<keyof typeof MapSearchState>('loaded')
  const [landId, setLandId] = useState('')
  const [coordinates, setCoordinates] = useState({ X: '', Y: '' })
  const [badQueryId, badQueryCoordinates] = getState(
    searchState,
    typedKeys(MapSearchState)
  )
  const [searchBy, setSearchBy] = useState<'coordinates' | 'id'>('coordinates')
  const searchById = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log({ landId })
  }
  const searchByCoordinates = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleMapSelection(Number(coordinates.X), Number(coordinates.Y))
  }
  const searchOptions = {
    coordinates: {
      search: searchByCoordinates,
      text: 'Go by Coordinates',
      badQuery: badQueryCoordinates,
      hasGuide: false,
    },
    id: {
      search: searchById,
      text: 'Go by ID',
      badQuery: badQueryId,
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
          {/* {searchOptions[searchBy].text} */}
        </p>
        <div className='flex flex-col gap-2 mb-4'>
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
                  <p className='absolute -top-7 border border-gray-500 -left-6 xs:left-0 pl-2 p-2 rounded-lg bg-black bg-opacity-10 backdrop-filter backdrop-blur font-medium text-xs text-gray-400 hidden peer-hover:block w-70'>
                    Find LAND on Opensea &gt; Details &gt; Token ID
                  </p>
                </>
              )}
            </span>
          ))}
        </div>

        <div className='flex flex-col gap-4 relative'>
          <div className='flex gap-2'>
            {searchBy === 'coordinates' ? (
              // Coordinates Input
              typedKeys(coordinates).map((coord) => (
                <input
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
                  className='border-gray-300 placeholder-gray-300 bg-transparent block w-16  text-white p-3 focus:outline-none border border-opacity-40 hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-opacity-75'
                />
              ))
            ) : (
              // Id Input
              <input
                required
                type='number'
                onChange={(e) => setLandId(e.target.value)}
                value={landId}
                placeholder='14271'
                className='border-gray-300 placeholder-gray-300 bg-transparent block w-[8.5rem] text-white p-3 focus:outline-none border border-opacity-40 hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-opacity-75'
              />
            )}
          </div>
          {/* Add land Button */}
          <SearchLandButton searchBy={searchBy} state={searchState} />

          {/* Bad Land Query */}
          {/* {searchOptions[searchBy].badQuery && (
            <p className='font-medium text-xs absolute -bottom-5  text-red-500 mt-1 pl-2 text-left w-full max-w-sm'>
              LAND doesn't exist
            </p>
          )} */}
        </div>
      </form>
    </div>
  )
}

export default MapSearch

/* Add by Token Id */

// ;<form onSubmit={(e) => searchById(e)}>
//   <div className='flex gap-2 relative items-center'>
//     <p className='font-medium mb-2 text-xs md:text-sm pt-1 '>Add by Token ID</p>

//     <BsQuestionCircle className='text-gray-300 cursor-pointer peer relative bottom-1' />
//     <p className='absolute -top-7 border border-gray-500 -left-6 xs:left-0 pl-2 p-2 rounded-lg bg-black bg-opacity-10 backdrop-filter backdrop-blur font-medium text-xs text-gray-400 hidden peer-hover:block w-70'>
//       Find LAND on Opensea &gt; Details &gt; Token ID
//     </p>
//   </div>
//   <div className='flex gap-4 relative'>
//     <input
//       required
//       type='number'
//       onChange={(e) => setLandId(e.target.value)}
//       value={landId}
//       placeholder='14271'
//       className='border-gray-300 placeholder-gray-300 bg-transparent block w-[8.5rem] text-white p-3 focus:outline-none border border-opacity-40 hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-opacity-75'
//     />
//     {/* Add land Button */}
//     <AddLandButton addBy='id' state={searchState} />
//     {/* Bad Land Query */}
//     {badQueryId && (
//       <p className='font-medium text-xs absolute -bottom-5  text-red-500 mt-1 pl-2 text-left w-full max-w-sm'>
//         LAND doesn't exist
//       </p>
//     )}
//   </div>
// </form>
