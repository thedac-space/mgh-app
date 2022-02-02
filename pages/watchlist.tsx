import { NextPage } from 'next'
// import { flushSync } from 'react-dom'
import { LandItem } from '../components/Watchlist'
import { FormEvent, useEffect, useState } from 'react'
import { ICoinPrices, IPriceCard } from '../lib/valuation/valuationTypes'
import {
  convertETHPrediction,
  getBoundaryPrices,
  getLandData,
} from '../lib/valuation/valuationUtils'
import { Metaverse } from '../lib/enums'
// import { ethers } from 'ethers'
import {
  addLandToWatchList,
  createUser,
  getUserInfo,
  removeLandFromWatchList,
} from '../lib/FirebaseUtilities'

interface IWatchListCard extends IPriceCard {
  currentPrice?: number
}

const LAND_CONTRACT = '0x50f5474724e0Ee42D9a4e711ccFB275809Fd6d4a'
// const wallet = '0x7812B090d1a3Ead77B5D8F470D3faCA900A6ccB9'
const wallet = '0x7812B090d1a3Ead77B5D8F470D3faCA900A6ccB8'

const WatchListPage: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const [landId, setLandId] = useState('')
  const [reFetch, setRefetch] = useState(false)
  const [lands, setLands] = useState<IWatchListCard[]>([])
  const [ids, setIds] = useState<number[]>([])

  const addToWatchList = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const id = Number(landId)
    const landData = await getLandData(id, Metaverse.SANDBOX)
    // Only if Land returns a result from our API
    if (landData.name) {
      // Adding Land to Database
      await addLandToWatchList(id, wallet)
      // Resetting Input
      setLandId('')
      // Retrigger useEffect
      setRefetch(!reFetch)
    }
  }

  const removeFromWatchList = async (landId: number) => {
    // Removing Land from Database
    await removeLandFromWatchList(landId, wallet)
    let filteredLands = lands.filter((land) => {
      return Number(land.apiData.tokenId) !== landId
    })
    // Updating Lands
    setLands(filteredLands)
    // Updating Ids
    setIds(filteredLands.map((land) => Number(land.apiData.tokenId)))
  }
  useEffect(() => {
    console.log(ids)
    const getLands = async () => {
      try {
        // getting user watchlist data
        const userData = await getUserInfo(wallet)
        // If no User Data but user is logged in create them a watchlist
        if (!userData && wallet) return await createUser(wallet)
        userData &&
          (await Promise.all(
            // Mapping through all Assets in Watchlist from User
            userData['sandbox-watchlist'].map(async (land: any) => {
              // If we already fetched Item, do not refetch it
              console.log({ ids })
              console.log(typeof ids[0], typeof land)
              if (!ids.includes(land)) {
                // Retrieving Data from our API for each Asset
                const landData = await getLandData(land, Metaverse.SANDBOX)
                // Retrieving data from OpenSea (Comes in ETH)
                const res = await fetch(
                  `/api/fetchSingleAsset/${LAND_CONTRACT}/${landData.tokenId}`
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
      } catch (e) {
        console.log(e)
      }
    }

    getLands()
  }, [reFetch])

  return (
    <section className='pt-12 xl:pt-0 animate-fade-in-slow flex flex-col items-center max-w-2xl text-white w-full'>
      {/* Title */}
      <h1 className='green-text-gradient mb-8'>Your Watchlist</h1>
      {/* Add Land Form */}
      <form
        className='gray-box w-fit mb-16'
        onSubmit={(e) => addToWatchList(e)}
      >
        <p className='mb-1'>Token ID</p>
        <div className='flex gap-4'>
          {/* TokenID Input */}
          <input
            type='number'
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            placeholder='142671'
            className={`bg-transparent text-white font-medium p-2 focus:outline-none border ${
              false ? 'border-red-500 border-opacity-100' : 'border-opacity-40 '
            } hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`}
          />
          {/* Add land Button */}
          <button className='text-center transition-all ease-in hover:shadow-subtleWhite z-10 p-2 rounded-xl bg-gradient-to-br from-pink-600 to-blue-500'>
            Add Land to Watchlist
          </button>
        </div>
      </form>
      {/* Lands List */}
      {lands.length > 0 && (
        <ul className='w-full flex flex-col gap-4'>
          {lands.map((land) => (
            <LandItem
              remove={removeFromWatchList}
              apiData={land.apiData}
              predictions={land.predictions}
              key={land.apiData?.tokenId}
              currentPrice={land.currentPrice}
            />
          ))}
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
