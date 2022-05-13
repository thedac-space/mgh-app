import { NextPage } from 'next'
import Head from 'next/head'
import { AddLandForm, LandList } from '../components/Watchlist'
import { useCallback, useEffect, useState } from 'react'
import {
  ICoinPrices,
  LandListAPIResponse,
} from '../lib/valuation/valuationTypes'
import { fetchLandList, getLandData } from '../lib/valuation/valuationUtils'
import { Metaverse } from '../lib/enums'
import {
  addLandToWatchList,
  addMissingWatchlist,
  createUser,
  getUserInfo,
  removeLandFromWatchList,
} from '../lib/FirebaseUtilities'
import { useAppSelector } from '../state/hooks'
import { Contracts } from '../lib/contracts'
import { Fade } from 'react-awesome-reveal'
import { formatName, typedKeys } from '../lib/utilities'

const watchlistState = [
  'loadingFirst',
  'loading',
  'loaded',
  'badQueryId',
  'badQueryCoordinates',
  'limitIdSandbox',
  'limitCoordinatesSandbox',
  'limitIdDecentraland',
  'limitCoordinatesDecentraland',
  'limitIdAxie',
  'limitCoordinatesAxie',
  'loadingQueryId',
  'loadingQueryCoordinates',
  'noWallet',
  'successId',
  'successCoordinates',
] as const

export type WatchListState = typeof watchlistState[number]

const WatchListPage: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const [reFetch, setRefetch] = useState(false)
  const [state, setState] = useState<WatchListState>('loadingFirst')
  const [lands, setLands] = useState<Record<Metaverse, LandListAPIResponse>>()
  const [ids, setIds] = useState<string[]>([])
  const { address } = useAppSelector((state) => state.account)

  const landOptions = {
    sandbox: {
      contract: Contracts.LAND.ETHEREUM_MAINNET.newAddress,
      firebase: 'sandbox-watchlist',
      limitIdState: 'limitIdSandbox',
      limitCoordinatesState: 'limitCoordinatesSandbox',
    },
    decentraland: {
      contract: Contracts.PARCEL.ETHEREUM_MAINNET.address,
      firebase: 'decentraland-watchlist',
      limitIdState: 'limitIdDecentraland',
      limitCoordinatesState: 'limitCoordinatesDecentraland',
    },
    'axie-infinity': {
      contract: Contracts.AXIE_LANDS.RONIN_MAINNET.address,
      firebase: 'axie-infinity-watchlist',
      limitIdState: 'limitIdAxie',
      limitCoordinatesState: 'limitCoordinatesAxie',
    },
  } as const

  // Creating Array for looping through Metaverses Options
  const landKeys = typedKeys(landOptions)

  const addToWatchList = async (
    metaverse: Metaverse,
    landId?: string,
    coordinates?: { X: string; Y: string }
  ) => {
    // If Sandbox or Decentraland limit give Feedback to user
    if (!lands) return
    if (typedKeys(lands[metaverse]).length === 10) {
      landId && setState(landOptions[metaverse].limitIdState)
      coordinates && setState(landOptions[metaverse].limitCoordinatesState)
      return setTimeout(() => {
        // Retrigger useEffect
        setState('loaded')
      }, 2000)
    }

    if (!address) return
    landId && setState('loadingQueryId')
    coordinates && setState('loadingQueryCoordinates')
    // Checking whether land exists
    const landData = await getLandData(metaverse, landId, coordinates)
    // If Land returns a result from our API
    if (landData.tokenId) {
      // Adding Land to Database
      await addLandToWatchList(landData.tokenId, address, metaverse)
      // Giving Feedback to user for Good Query
      landId && setState('successId')
      coordinates && setState('successCoordinates')
      setTimeout(() => {
        // Retrigger useEffect
        setRefetch(!reFetch)
      }, 1100)
    } else {
      landId && setState('badQueryId')
      coordinates && setState('badQueryCoordinates')
      return setTimeout(() => {
        setState('loaded')
      }, 2000)
    }
  }

  const removeFromWatchList = useCallback(
    async (landId: string, metaverse: Metaverse) => {
      // Removing Land from Database
      await removeLandFromWatchList(landId, address!, metaverse)

      // Updating Lands for selected Metaverse
      // landOptions[metaverse].setList((previous) =>
      //   previous.filter((land) => {
      //     return land.apiData.tokenId !== landId
      //   })
      // )
      const metaverseLandsObject = lands?.[metaverse]
      delete metaverseLandsObject?.[landId]
      setLands({
        ...lands!,
        [metaverse]: metaverseLandsObject,
      })

      // Updating Ids
      setIds((previous) => previous.filter((id) => id !== landId))
    },
    [lands]
  )

  useEffect(() => {
    const getLands = async () => {
      try {
        // getting user watchlist data
        const userData = await getUserInfo(address!)
        // If no User Data but user is logged in create them a watchlist
        if (!userData) {
          setState('loaded')
          return await createUser(address!)
        }

        userData &&
          (await Promise.all(
            landKeys.map(async (metaverse) => {
              if (!userData[landOptions[metaverse].firebase]) {
                return await addMissingWatchlist(
                  address!,
                  landOptions[metaverse].firebase
                )
              }
              // UserLands for selected metaverse
              const watchlistIds = userData[
                landOptions[metaverse].firebase
              ] as string[] // array of land Ids
              // Object of Lands of corresponding Metaverse
              const metaverseLandsObject = await fetchLandList(
                metaverse as Metaverse,
                watchlistIds
              )
              setLands((previous) => {
                return { ...previous!, [metaverse]: metaverseLandsObject }
              })

              // await Promise.all(
              // // Mapping through all Assets in Watchlist from User

              // userData[landOptions[landKey].firebase].map(
              //   async (land: string) => {
              //     // If we already fetched Item, do not refetch it
              //     if (ids.includes(land)) return
              //     // Retrieving Data from our API for each Asset
              //     const landData = await getLandData(
              //       landKey as Metaverse,
              //       land
              //     )
              //     let currentPriceUSD = NaN
              //     if (landKey === 'axie-infinity') {
              //       // Retrieving data from Axie Marketplace
              //       const axieLandData = await getAxieLandData(
              //         landData.coords.x,
              //         landData.coords.y
              //       )
              //       currentPriceUSD = Number(
              //         axieLandData.auction?.currentPriceUSD
              //       )
              //     }
              //     if (landKey !== 'axie-infinity') {
              //       // Retrieving data from OpenSea (Comes in ETH)
              //       const res = await fetch(
              //         `/api/fetchSingleAsset/${landOptions[landKey].contract}/${landData.tokenId}`
              //       )

              //       // Retrieving Latest Orders for each Asset
              //       const listings = (await res.json()).listings
              //       // Getting Current Price for each Asset

              //       currentPriceUSD =
              //         getCurrentPrice(listings) * prices.ethereum.usd
              //     }

              //     const predictions = convertETHPrediction(
              //       prices,
              //       landData.prices.eth_predicted_price,
              //       landKey as Metaverse
              //     )
              //     // Creating FormattedLand Instance
              //     const formattedLand = {
              //       apiData: landData,
              //       predictions: predictions,
              //       currentPrice: currentPriceUSD,
              //     }
              //     // Pushing it to State Array
              //     landOptions[landKey].setList((previous) => [
              //       formattedLand,
              //       ...previous,
              //     ])
              //     setIds((previous) => [
              //       ...previous,
              //       formattedLand.apiData.tokenId,
              //     ])
              //   }
              // )
              // )
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
      setLands(undefined)
      setIds([])
      setState('noWallet')
    }
  }, [reFetch, address])

  return (
    <>
      <Head>
        <title>MGH - Watchlist</title>
        <meta
          name='description'
          content='Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data.'
        />
      </Head>
      <section className='pt-12 xl:pt-0 animate-fade-in-slow flex flex-col items-center max-w-3xl text-white w-full'>
        {/* Title */}
        <div className='sm:gray-box mb-8'>
          <h1 className='md:text-5xl lg:text-6xl text-4xl green-text-gradient'>
            Your Watchlist
          </h1>
        </div>
        {/* Add Land Form */}
        <AddLandForm
          landKeys={landKeys}
          ids={ids}
          state={state}
          addToWatchList={addToWatchList}
        />
        {/* Lands List */}
        {ids.length > 0 &&
          state !== 'loadingFirst' &&
          landKeys.map(
            (metaverse) =>
              lands &&
              lands[metaverse] &&
              typedKeys(lands?.[metaverse]).length > 0 && (
                <article key={metaverse} className='mb-8 w-full'>
                  <Fade>
                    <h3 className='gray-box xs:w-[22rem] sm:w-fit mx-auto  sm:ml-0 green-text-gradient mb-4'>
                      {formatName(metaverse, true)}
                    </h3>
                  </Fade>
                  <LandList
                    lands={lands[metaverse]}
                    removeFromWatchList={removeFromWatchList}
                  />
                </article>
              )
          )}
      </section>
    </>
  )
}

export async function getServerSideProps() {
  const coin = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox%2Cdecentraland%2Caxie-infinity&vs_currencies=usd'
  )
  const prices: ICoinPrices = await coin.json()

  return {
    props: {
      prices,
    },
  }
}
export default WatchListPage
