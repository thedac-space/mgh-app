import { NextPage } from 'next'
import { LandItem } from '../components/Watchlist'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { ICoinPrices, IPriceCard } from '../lib/valuation/valuationTypes'
import {
  convertETHPrediction,
  getBoundaryPrices,
  getLandData,
} from '../lib/valuation/valuationUtils'
import { Metaverse } from '../lib/enums'
import {
  addLandToWatchList,
  createUser,
  getUserInfo,
  removeLandFromWatchList,
} from '../lib/FirebaseUtilities'
import { IoWarningOutline } from 'react-icons/io5'
import { useAppSelector } from '../state/hooks'
import { Contracts } from '../lib/contracts'
import { Fade } from 'react-awesome-reveal'
import { MdAddLocationAlt } from 'react-icons/md'

interface IWatchListCard extends IPriceCard {
  currentPrice?: number
}

const WatchListPage: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  type State =
    | 'loadingFirst'
    | 'loading'
    | 'loaded'
    | 'badQuery'
    | 'loadingQuery'
    | 'noWallet'
    | 'success'
  const [landId, setLandId] = useState('')
  const [reFetch, setRefetch] = useState(false)
  const [state, setState] = useState<State>('loadingFirst')
  const [lands, setLands] = useState<IWatchListCard[]>([])
  const [ids, setIds] = useState<number[]>([])
  const { address } = useAppSelector((state) => state.account)

  const addToWatchList = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (lands.length < 10 && address) {
      setState('loadingQuery')
      const id = Number(landId)
      // Checking whether land exists
      const landData = await getLandData(id, Metaverse.SANDBOX)
      // If Land returns a result from our API
      if (landData.name) {
        // Adding Land to Database
        await addLandToWatchList(id, address)
        // Giving Feedback to user of Good Query
        setState('success')
        setTimeout(() => {
          // Resetting Input
          setLandId('')
          // Retrigger useEffect
          setRefetch(!reFetch)
        }, 1100)
      } else {
        setState('badQuery')
      }
    }
  }

  const removeFromWatchList = useCallback(
    async (landId: number) => {
      // Removing Land from Database
      await removeLandFromWatchList(landId, address!)
      let filteredLands = lands.filter((land) => {
        return Number(land.apiData.tokenId) !== landId
      })
      // Updating Lands
      setLands(filteredLands)
      // Updating Ids
      setIds(filteredLands.map((land) => Number(land.apiData.tokenId)))
    },
    [lands]
  )

  useEffect(() => {
    const getLands = async () => {
      try {
        // getting user watchlist data
        const userData = await getUserInfo(address!)
        // If no User Data but user is logged in create them a watchlist
        if (!userData) return await createUser(address!)
        userData &&
          (await Promise.all(
            // Mapping through all Assets in Watchlist from User
            userData['sandbox-watchlist'].map(async (land: any) => {
              // If we already fetched Item, do not refetch it
              if (!ids.includes(land)) {
                // Retrieving Data from our API for each Asset
                const landData = await getLandData(land, Metaverse.SANDBOX)
                // Retrieving data from OpenSea (Comes in ETH)
                const res = await fetch(
                  `/api/fetchSingleAsset/${Contracts.LAND.ETHEREUM_MAINNET.newAddress}/${landData.tokenId}`
                )

                // Retrieving Latest Orders for each Asset
                const orders = (await res.json()).orders
                // Getting Current Price for each Asset
                const result = getBoundaryPrices(orders)
                // Formatting Price to USD
                const currentPriceUSD = Number(
                  (result.current_price! * prices.ethereum.usd).toFixed(2)
                )
                // Converting Predictions
                const predictions = convertETHPrediction(
                  prices,
                  landData.prices.predicted_price
                )
                // Creating FormattedLand Instance
                const formattedLand = {
                  apiData: landData,
                  predictions: predictions,
                  currentPrice: currentPriceUSD,
                }
                // Pushing it to State Array
                setLands((previous) => [formattedLand, ...previous])
                setIds((previous) => [
                  ...previous,
                  Number(formattedLand.apiData.tokenId),
                ])
              }
            })
          ))
        setState('loaded')
      } catch (e) {
        console.log(e)
      }
    }

    if (address) {
      if (state === 'noWallet') {
        setState('loadingFirst')
      } else if (state !== 'loadingFirst') {
        setState('loading')
      }
      getLands()
    } else {
      setLands([])
      setIds([])
      setState('noWallet')
    }
  }, [reFetch, address])

  return (
    <section className='pt-12 xl:pt-0 animate-fade-in-slow flex flex-col items-center max-w-3xl text-white w-full'>
      {/* Title */}
      <div className='sm:gray-box mb-8'>
        <h1 className='text-center green-text-gradient'>Your Watchlist</h1>
      </div>
      {/* Add Land Form */}
      <form
        className='gray-box bg-opacity-10 transition-all w-fit mb-8'
        onSubmit={(e) => addToWatchList(e)}
      >
        <p className='mb-1'>Token ID</p>
        <div className='flex gap-4'>
          {/* TokenID Input */}
          <input
            disabled={state === 'noWallet' || lands.length === 10}
            required
            type='number'
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            placeholder='142671'
            className={`bg-transparent disabled:opacity-20 text-white w-1/2 font-medium p-2 focus:outline-none border ${
              // Giving Feedback to User on Good and Bad Queries
              state === 'badQuery'
                ? 'border-red-500 border-opacity-100 '
                : state === 'success'
                ? 'border-green-500 border-opacity-100 '
                : 'border-opacity-40 '
            } hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`}
          />
          {/* Add land Button */}
          <button
            disabled={state === 'noWallet' || lands.length === 10}
            className='items-center justify-center text-center transition-all flex grow gap-2 ease-in hover:shadow-subtleWhite z-10 p-2 rounded-xl bg-gradient-to-br from-pink-600 to-blue-500'
          >
            {/* Loading Icon */}
            {state?.includes('loading') && (
              <svg className='animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full' />
            )}
            {/* Land Limit Icon */}
            {lands.length === 10 && <IoWarningOutline className='h-5 w-5' />}
            {/* Add Land Icon */}
            {state === 'loaded' && lands.length !== 10 && (
              <MdAddLocationAlt className='h-5 w-5 relative bottom-[0.2rem]' />
            )}
            {/* Button Text */}
            <span>
              {lands.length === 10
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
        </div>
        {/* Warning Text */}
        {state === 'badQuery' && (
          <p className='font-medium text-xs text-red-500 mt-1 pl-2 text-left w-full max-w-sm'>
            LAND doesn't exist
          </p>
        )}
      </form>
      {/* Lands List */}
      {lands.length > 0 && state !== 'loadingFirst' && (
        <ul className='w-full flex lg:flex-col flex-wrap justify-center gap-4'>
          <Fade duration={550} className='w-full flex justify-center'>
            {lands.map((land) => (
              <LandItem
                remove={removeFromWatchList}
                apiData={land.apiData}
                predictions={land.predictions}
                key={land.apiData?.tokenId}
                currentPrice={land.currentPrice}
              />
            ))}
          </Fade>
        </ul>
      )}
    </section>
  )
}

export async function getServerSideProps() {
  const coin = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox%2Cdecentraland&vs_currencies=usd'
  )
  const prices: ICoinPrices = await coin.json()

  return {
    props: {
      prices,
    },
  }
}
export default WatchListPage
