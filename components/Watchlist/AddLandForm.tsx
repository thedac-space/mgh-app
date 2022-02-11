import React, { FormEvent, useState } from 'react'
import { BsArrowLeft, BsEmojiSunglasses, BsStar } from 'react-icons/bs'
import { IoWarningOutline } from 'react-icons/io5'
import { MdAddLocationAlt, MdLandscape } from 'react-icons/md'
import { RiLandscapeLine } from 'react-icons/ri'
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
  type addBy = 'Token ID' | 'Coordinates'
  const [landId, setLandId] = useState<string>('')
  const [coordinates, setCoordinates] = useState<{ X: string; Y: string }>({
    X: '',
    Y: '',
  })
  const [addBy, setAddBy] = useState<addBy>()
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1)

  const handleStep1 = (addBy: addBy) => {
    if (!limitReached) {
      setAddBy(addBy)
      setFormStep(2)
    }
  }
  const setMetaverseStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStep(3)
  }
  const handleClick = async (metaverse: Metaverse) => {
    await addToWatchList(metaverse, landId, coordinates)
    setFormStep(1)
    setLandId('')
    setCoordinates({ X: '', Y: '' })
  }

  const steps = {
    1: {
      text: 'Add by',
      jsx: (
        <div className='flex gap-2'>
          <div
            onClick={() => handleStep1('Token ID')}
            className={
              'flex flex-col items-center justify-center hover:text-gray-100 text-gray-400 space-y-2 rounded-xl cursor-pointer p-2 group focus:outline-none hover:border-opacity-100 border focus:border-opacity-100 transition duration-300 ease-in-out ' +
              (state === 'success'
                ? 'border-green-500 border-opacity-100'
                : 'border-opacity-40')
            }
          >
            <p
              className={
                'font-medium  text-xs md:text-sm pt-1 ' +
                (state === 'success' && 'text-green-500')
              }
            >
              Token ID
            </p>
          </div>
          <div
            onClick={() => handleStep1('Coordinates')}
            className={
              'flex flex-col items-center justify-center hover:text-gray-100 text-gray-400 space-y-2 rounded-xl cursor-pointer p-2 group focus:outline-none hover:border-opacity-100 border focus:border-opacity-100 transition duration-300 ease-in-out ' +
              (state === 'success'
                ? 'border-green-500 border-opacity-100'
                : 'border-opacity-40')
            }
          >
            <p
              className={
                'font-medium text-xs md:text-sm pt-1 ' +
                (state === 'success' && 'text-green-500')
              }
            >
              Coordinates
            </p>
          </div>
        </div>
      ),
    },
    2: {
      text: addBy,
      jsx:
        // Add By options
        addBy === 'Token ID' ? (
          <input
            disabled={state === 'noWallet' || limitReached}
            required
            type='number'
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            placeholder='142671'
            className='bg-transparent disabled:opacity-20 text-white w-1/2 font-medium p-2 focus:outline-none border hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75'
          />
        ) : (
          <div className='flex gap-2'>
            <input
              required
              type='number'
              onChange={(e) =>
                setCoordinates({ ...coordinates, X: e.target.value })
              }
              value={coordinates?.X}
              placeholder='X'
              className='bg-transparent block w-16 text-white p-2 focus:outline-none border border-opacity-40 hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75'
            />
            <input
              required
              value={coordinates?.Y}
              onChange={(e) =>
                setCoordinates({ ...coordinates, Y: e.target.value })
              }
              type='number'
              placeholder='Y'
              className='bg-transparent block w-16 text-white p-2 focus:outline-none border border-opacity-40 hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75'
            />
          </div>
        ),
    },
    3: {
      text: 'Metaverse',
      jsx: (
        // Metaverse Options
        <div className='flex gap-2'>
          {landKeys.map((landKey) => (
            <div
              key={landKey}
              onClick={() => handleClick(landKey as Metaverse)}
              className='flex flex-col hover:text-gray-100 text-gray-400 items-center justify-center space-y-2 rounded-xl cursor-pointer p-2 group focus:outline-none border-opacity-40 hover:border-opacity-100 border focus:border-opacity-100 transition duration-300 ease-in-out'
            >
              <p className='font-medium text-xs md:text-sm pt-1'>
                {landKey[0].toUpperCase() + landKey.substring(1)}
              </p>
            </div>
          ))}
        </div>
      ),
    },
  }

  return (
    <form
      className='gray-box bg-opacity-10 transition-all w-fit mb-8 '
      onSubmit={(e) => setMetaverseStep(e)}
    >
      <p className='mb-1'>{steps[formStep].text}</p>
      <div className='flex gap-4 relative'>
        {/* JSX For Form Steps (Add By, Id/Coordinates Input, Metaverse) */}
        {steps[formStep].jsx}
        {/* Add land Button */}
        <button
          disabled={formStep === 1 || limitReached || state === 'noWallet'}
          className='items-center justify-center text-center transition-all flex grow gap-2 ease-in hover:shadow-subtleWhite z-10 p-2 rounded-xl bg-gradient-to-br from-pink-600 to-blue-500'
        >
          {/* Loading Icon */}
          {state?.includes('loading') && (
            <svg className='animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full' />
          )}
          {/* Land Limit Icon */}
          {limitReached && <IoWarningOutline className='h-5 w-5' />}
          {state === 'success' && (
            <BsEmojiSunglasses className='h-5 w-5 relative bottom-[0.1rem]' />
          )}
          {/* Add Land Icon */}
          {state === 'loaded' && ids.length !== 20 && (
            <MdAddLocationAlt className='h-5 w-5 relative bottom-[0.2rem]' />
          )}
          {/* Button Text */}
          <span>
            {limitReached
              ? 'Limit Reached'
              : state === 'loading' || state === 'loadingFirst'
              ? 'Fetching Data'
              : state === 'loadingQuery'
              ? 'Verifying Land'
              : state === 'noWallet'
              ? 'No Wallet Detected'
              : state === 'success'
              ? 'Success!'
              : 'Add Land'}
          </span>
        </button>
        {/* Go Back Arrow */}
        {formStep > 1 && (
          <BsArrowLeft
            className='absolute -top-7  right-1 cursor-pointer'
            onClick={() => setFormStep((formStep - 1) as typeof formStep)}
          />
        )}
        {/* Warning Texts */}
        {/* Bad Land Query */}
        {state === 'badQuery' && (
          <p className='font-medium text-xs absolute -bottom-5  text-red-500 mt-1 pl-2 text-left w-full max-w-sm'>
            LAND doesn't exist
          </p>
        )}
        {/* Limit of any lands */}
        {state.includes('limit') && (
          <p className='font-medium text-xs absolute -bottom-5  text-red-500 mt-1 pl-2 text-left w-full max-w-sm'>
            {state === 'limitSandbox'
              ? 'Sandbox Limit Reached'
              : 'Decentraland Limit Reached'}
          </p>
        )}
      </div>
    </form>
  )
}

export default React.memo(AddLandForm)
