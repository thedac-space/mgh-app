import React, { FormEvent, useState } from 'react'
import { BsArrowLeft, BsEmojiSunglasses, BsStar } from 'react-icons/bs'
import { IoWarningOutline } from 'react-icons/io5'
import { MdAddLocationAlt, MdLandscape } from 'react-icons/md'
import { RiLandscapeLine } from 'react-icons/ri'
import { AddLandButton } from '.'
import { Metaverse } from '../../lib/enums'
import { LandsKey } from '../../lib/valuation/valuationTypes'
import { WatchListState } from '../../pages/watchlist'

interface Props {
  state: WatchListState
  addToWatchList: (
    metaverse: Metaverse,
    landId?: string,
    coordinates?: {
      X: string
      Y: string
    }
  ) => Promise<NodeJS.Timeout | undefined>
  ids: string[]
  landKeys: LandsKey[]
}
const AddLandForm = ({ state, addToWatchList, ids, landKeys }: Props) => {
  const limitReached = ids.length === 20
  const [landId, setLandId] = useState<string>('')
  const [coordinates, setCoordinates] = useState<{ X: string; Y: string }>({
    X: '',
    Y: '',
  })
  const [metaverse, setMetaverse] = useState<Metaverse>()

  const addById = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!metaverse) return
    await addToWatchList(metaverse, landId, undefined)
    setLandId('')
    setMetaverse(undefined)
  }

  const addByCoordinates = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!metaverse) return
    await addToWatchList(metaverse, undefined, {
      X: coordinates.X,
      Y: coordinates.Y,
    })
    setCoordinates({ X: '', Y: '' })
    setMetaverse(undefined)
  }

  return state === 'noWallet' ? (
    <button className='items-center justify-center font-medium text-center transition-all ease-in cursor-default z-10 p-4 rounded-xl bg-gradient-to-br from-pink-600 to-blue-500'>
      No Wallet Detected
    </button>
  ) : (
    <div className='gray-box bg-opacity-10 transition-all w-fit mb-8 flex flex-col gap-6'>
      {/* Metaverse Options */}
      <div>
        <p className='font-medium mb-2 text-xs md:text-sm pt-1'>
          Choose Metaverse
        </p>
        <div className='flex gap-2'>
          {landKeys.map((landKey) => (
            <button
              disabled={limitReached}
              key={landKey}
              onClick={() => setMetaverse(landKey as Metaverse)}
              className={
                (metaverse === landKey
                  ? 'text-gray-100 border-gray-500 bg-gradient-to-br from-pink-600 to-blue-500'
                  : 'text-gray-400 border-gray-500') +
                ' flex flex-col disabled:bg-transparent p-3  hover:text-gray-100 hover:border-gray-300 items-center justify-center space-y-2 rounded-xl cursor-pointer group focus:outline-none border transition duration-300 ease-in-out'
              }
            >
              <p className='font-medium pt-1'>
                {landKey[0].toUpperCase() + landKey.substring(1)}
              </p>
            </button>
          ))}
        </div>
      </div>
      {/* Add by Token Id */}
      <form onSubmit={(e) => addById(e)}>
        <p
          className={
            'font-medium mb-2 text-xs md:text-sm pt-1 ' +
            (state === 'successId' && 'text-green-500')
          }
        >
          Add by Token ID
        </p>
        <div className='flex gap-4 relative'>
          <input
            required
            disabled={limitReached}
            type='number'
            onChange={(e) => setLandId(e.target.value)}
            value={landId}
            placeholder='14271'
            className={
              (state === 'successId'
                ? 'border-green-500 placeholder-green-500'
                : 'border-gray-300 placeholder-gray-300') +
              ' bg-transparent block w-[8.5rem] text-white p-3 focus:outline-none border border-opacity-40 hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-opacity-75'
            }
          />
          {/* Add land Button */}
          <AddLandButton addBy='id' state={state} limitReached={limitReached} />

          {/* Warning Texts */}

          {/* Bad Land Query */}
          {state === 'badQueryId' && (
            <p className='font-medium text-xs absolute -bottom-5  text-red-500 mt-1 pl-2 text-left w-full max-w-sm'>
              LAND doesn't exist
            </p>
          )}
          {/* Limit of any lands */}
          {state.includes('limitId') && (
            <p className='font-medium text-xs absolute -bottom-5  text-red-500 mt-1 pl-2 text-left w-full max-w-sm'>
              {state === 'limitIdSandbox'
                ? 'Sandbox Limit Reached'
                : 'Decentraland Limit Reached'}
            </p>
          )}
        </div>
      </form>
      {/* Add by Coordinates */}

      <form onSubmit={(e) => addByCoordinates(e)}>
        <p
          className={
            'mb-2 font-medium text-xs md:text-sm pt-1 ' +
            (state === 'successCoordinates' && 'text-green-500')
          }
        >
          Add by Coordinates
        </p>
        <div className='flex gap-4 relative'>
          <div className='flex gap-2'>
            <input
              required
              disabled={limitReached}
              type='number'
              onChange={(e) =>
                setCoordinates({ ...coordinates, X: e.target.value })
              }
              value={coordinates?.X}
              placeholder='X'
              className={
                (state === 'successCoordinates'
                  ? 'border-green-500 placeholder-green-500'
                  : 'border-gray-300 placeholder-gray-300') +
                ' bg-transparent block w-16  text-white p-3 focus:outline-none border border-opacity-40 hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-opacity-75'
              }
            />
            <input
              required
              disabled={limitReached}
              value={coordinates?.Y}
              onChange={(e) =>
                setCoordinates({ ...coordinates, Y: e.target.value })
              }
              type='number'
              placeholder='Y'
              className={
                (state === 'successCoordinates'
                  ? 'border-green-500 placeholder-green-500'
                  : 'border-gray-300 placeholder-gray-300') +
                ' bg-transparent block w-16  text-white p-3 focus:outline-none border border-opacity-40 hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-opacity-75'
              }
            />
          </div>
          {/* Add land Button */}
          <AddLandButton
            addBy='coordinates'
            state={state}
            limitReached={limitReached}
          />

          {/* Warning Texts */}

          {/* Bad Land Query */}
          {state === 'badQueryCoordinates' && (
            <p className='font-medium text-xs absolute -bottom-5  text-red-500 mt-1 pl-2 text-left w-full max-w-sm'>
              LAND doesn't exist
            </p>
          )}
          {/* Limit of any lands */}
          {state.includes('limitCoordinates') && (
            <p className='font-medium text-xs absolute -bottom-5  text-red-500 mt-1 pl-2 text-left w-full max-w-sm'>
              {state === 'limitCoordinatesSandbox'
                ? 'Sandbox Limit Reached'
                : 'Decentraland Limit Reached'}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default React.memo(AddLandForm)
