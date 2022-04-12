import React from 'react'
import { BsEmojiSunglasses } from 'react-icons/bs'
import { IoWarningOutline } from 'react-icons/io5'
import { MdAddLocationAlt } from 'react-icons/md'
import { RiLoader3Fill } from 'react-icons/ri'
import { WatchListState } from '../../pages/watchlist'
import { MapSearchState } from './MapSearch'

interface Props {
  state: keyof typeof MapSearchState
  searchBy: 'id' | 'coordinates'
}

const SearchLandButton = ({ state, searchBy }: Props) => {
  const options = {
    id: { success: 'successId', loading: 'loadingQueryId' },
    coordinates: {
      success: 'successCoordinates',
      loading: 'loadingQueryCoordinates',
    },
  }
  // Loading Icon Display Conditions
  const loadingIconBoolean =
    state === options[searchBy].loading || state === 'loading'

  // Add Icon Display Conditions
  const addIconBoolean =
    state === 'loaded' ||
    state.includes('bad') ||
    state.includes('limit') ||
    (state.includes('loadingQuery') && state !== options[searchBy].loading)

  return (
    <button
      className={
        (state === options[searchBy].success
          ? 'bg-green-500 text-white'
          : 'bg-gray-200  text-gray-800') +
        ' items-center justify-center font-medium text-center transition-all flex grow gap-2 ease-in hover:shadow-subtleWhite z-10 p-2 rounded-xl md:hover:bg-white'
      }
    >
      {/* Loading Icon */}
      {loadingIconBoolean && (
        <RiLoader3Fill className='animate-spin-slow h-5 w-5 xs:h-6 xs:w-6' />
      )}
      {/* Land Limit Icon */}
      {/* {limitReached && (
        <IoWarningOutline className='h-5 w-5 relative bottom-[0.15rem]' />
      )} */}
      {state === options[searchBy].success && (
        <BsEmojiSunglasses className='h-5 w-5 relative bottom-[0.1rem]' />
      )}
      {/* Add Land Icon */}
      {addIconBoolean && (
        <MdAddLocationAlt className='h-5 w-5 relative bottom-[0.2rem]' />
      )}
      {/* Button Text */}
      <span className='whitespace-nowrap'>
        {state === 'loading'
          ? 'Fetching Data'
          : state === options[searchBy].loading
          ? 'Verifying Land'
          : state === 'noWallet'
          ? 'No Wallet Detected'
          : state === options[searchBy].success
          ? 'Success!'
          : 'Search'}
      </span>
    </button>
  )
}

export default SearchLandButton
