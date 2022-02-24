import Head from 'next/head'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { formatLandAsset } from '../lib/valuation/valuationUtils'
import {
  ICoinPrices,
  IPriceCard,
  LandsKey,
} from '../lib/valuation/valuationTypes'
import { ExternalLink, PriceList } from '../components/General'
import { IPredictions } from '../lib/types'
import { useAppSelector } from '../state/hooks'
import { Contracts } from '../lib/contracts'
import { useRouter } from 'next/router'
import { ellipseAddress } from '../lib/utilities'
import { Loader } from '../components'
import { Fade } from 'react-awesome-reveal'
import { Metaverse } from '../lib/enums'
import PortfolioList from '../components/Portfolio/PortfolioList'
import { BsTwitter } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import { SocialMediaOptions } from '../lib/socialMediaOptions'

const PortfolioPage: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const { query, push } = useRouter()

  const initialWorth = {
    ethPrediction: 0,
    usdPrediction: 0,
  }
  const { address } = useAppSelector((state) => state.account)
  const [copiedText, setCopiedText] = useState(false)

  const [totalWorth, setTotalWorth] = useState<IPredictions>(initialWorth)
  const [totalAssets, setTotalAssets] = useState(0)
  const [alreadyFetched, setAlreadyFetched] = useState(false)
  const [formattedSandboxAssets, setFormattedSandboxAssets] = useState<
    IPriceCard[]
  >([])
  const [formattedDecentralandAssets, setFormattedDecentralandAssets] =
    useState<IPriceCard[]>([])
  const [loading, setLoading] = useState(true)
  const socialMedia = SocialMediaOptions(undefined, undefined, address)
  const externalWallet = query.wallet

  const landOptions = {
    // LAND contract address might have to be changed once Sandbox && OpenSea finish migration
    sandbox: {
      contract: Contracts.LAND.ETHEREUM_MAINNET.newAddress,
      assetsList: formattedSandboxAssets,
      setList: setFormattedSandboxAssets,
    },
    decentraland: {
      contract: Contracts.PARCEL.ETHEREUM_MAINNET.address,
      assetsList: formattedDecentralandAssets,
      setList: setFormattedDecentralandAssets,
    },
  }

  const options = Object.keys(landOptions) as LandsKey[]

  const copyLink = () => {
    navigator.clipboard.writeText(
      'https://app.metagamehub.io/portfolio?wallet=' + address
    )
    // Display Feedback Text

    setCopiedText(true)
    setTimeout(() => {
      setCopiedText(false)
    }, 1100)
  }

  /* When coming from a shared link. We can see our own portfolio 
  by deleting the query params .*/
  const seeOwnPortfolio = () => {
    resetState()
    push('/portfolio')
  }

  // Resetting state when Wallet Changes
  const resetState = () => {
    setCopiedText(false)
    setLoading(true)
    setTotalWorth(initialWorth)
    setTotalAssets(0)
    options.forEach((option) => {
      landOptions[option].setList([])
    })
  }

  useEffect(() => {
    if (externalWallet && alreadyFetched) return
    setAlreadyFetched(true)

    // Requesting and Formatting Assets
    const setPortfolioAssets = async () => {
      resetState()
      // OpenSea API Call
      try {
        await Promise.all(
          options.map(async (option) => {
            const res = await fetch('/api/fetchAssets', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                wallet: (externalWallet as string) ?? address,
                assetContract: landOptions[option].contract,
              }),
            })
            const rawAssets = await res.json()
            // Formatting Assets to fit into the Cards
            rawAssets.assets &&
              rawAssets.assets.length > 0 &&
              (await Promise.all(
                rawAssets.assets.map(async (asset: any) => {
                  const formattedAsset = await formatLandAsset(
                    asset.token_id,
                    prices,
                    option as Metaverse
                  )
                  landOptions[option].setList((previousState) => [
                    ...previousState,
                    formattedAsset,
                  ])
                  // Adding the worth of each asset into the totalWorth
                  setTotalWorth((previousWorth) => ({
                    ethPrediction:
                      previousWorth.ethPrediction +
                      formattedAsset.predictions!.ethPrediction,
                    usdPrediction:
                      previousWorth.usdPrediction +
                      formattedAsset.predictions!.usdPrediction,
                  }))
                  setTotalAssets((previous) => previous + 1)
                })
              ))
          })
        )
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
    }

    setPortfolioAssets()
  }, [externalWallet, address])

  return (
    <>
      <Head>
        <title>MGH - Portfolio</title>
        <meta
          name='description'
          content='Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data.'
        />
      </Head>

      <section className='w-75vw sm:w-full max-w-7xl pt-12 xl:pt-0'>
        {/* Headers */}
        <hgroup className='text-white text-center'>
          {/* Change Title if there's a query on the uri */}
          <div className='sm:gray-box mb-8 sm:mb-12'>
            {externalWallet ? (
              <>
                <h1 className='md:text-5xl lg:text-6xl text-4xl green-text-gradient'>Portfolio</h1>
                <ExternalLink
                  className='m-auto text-center sm:text-lg md:text-xl'
                  text={ellipseAddress(externalWallet as string)}
                  href={'https://opensea.io/' + externalWallet}
                />
              </>
            ) : (
              <h1 className='md:text-5xl lg:text-6xl text-4xl green-text-gradient'>Your Portfolio</h1>
            )}
          </div>
          {!externalWallet && !address ? (
            <button className='items-center justify-center font-medium text-center transition-all ease-in cursor-default z-10 p-4 rounded-xl bg-gradient-to-br from-pink-600 to-blue-500'>
              No Wallet Detected
            </button>
          ) : (
            // Total Lands and Total Worth Container
            <div className='flex flex-col sm:flex-row gap-4 md:gap-12 mb-0 sm:mb-12'>
              {/* Total Lands */}
              <div className='flex flex-col justify-between gap-4 text-center transition-all gray-box relative'>
                <h3 className='text-xl md:text-3xl xl:text-4xl'>
                  Total LANDS Owned
                </h3>
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <p className='text-4xl animate-fade-in-slow reverse-text-gradient mb-2 font-bold'>
                      {totalAssets}
                    </p>
                    {externalWallet && (
                      <button
                        onClick={seeOwnPortfolio}
                        className='min-w-fit w-1/2 mx-auto animate-fade-in-slow font-medium text-white py-3 px-4 rounded-xl bg-gradient-to-br transition-all duration-300 from-pink-600 to-blue-500'
                      >
                        See your Own Portfolio
                      </button>
                    )}
                    {/* Share Icons */}
                    {!externalWallet && address && (
                      <div className='flex gap-8 justify-center'>
                        {/* Twitter */}
                        <button
                          onClick={() =>
                            window.open(socialMedia.twitter.portfolioLink)
                          }
                          className='gray-box bg-transparent border-gray-600 shadow-sm w-fit'
                        >
                          <BsTwitter className='text-blue-400 w-10 h-10 transition ease-in-out duration-300 hover:scale-105' />
                        </button>
                        {/* Copy Link */}
                        <button
                          onClick={copyLink}
                          className='relative gray-box border-gray-600 bg-transparent shadow-sm w-fit'
                        >
                          <FiCopy className='w-10 h-10 text-pink-500 relative transition ease-in-out duration-300 hover:scale-105' />
                          {copiedText && (
                            <Fade direction='bottom-right' duration={500}>
                              <span className='font-medium absolute w-fit p-4 rounded-xl -top-1/2 bg-gradient-to-br transition-all duration-300 from-pink-600 to-blue-500'>
                                Link Copied!
                              </span>
                            </Fade>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Total Worth */}
              <div className='flex flex-col w-full sm:w-2/3 transition-all justify-between text-center mb-8 sm:mb-0 gray-box'>
                <h3 className='text-xl md:text-3xl xl:text-4xl mb-4'>
                  Total Value Worth
                </h3>
                {loading ? (
                  <Loader />
                ) : (
                  totalWorth && <PriceList predictions={totalWorth} />
                )}
              </div>
            </div>
          )}
        </hgroup>

        {/* Lands Grid */}
        {options.map(
          (option) =>
            landOptions[option].assetsList.length > 0 && (
              <article key={option} className='mb-8 sm:mb-12'>
                <Fade>
                  <h3 className='text-center gray-box green-text-gradient mb-8 sm:mb-12'>
                    {option.toUpperCase()}
                  </h3>
                </Fade>
                <PortfolioList
                  formattedAssets={landOptions[option].assetsList}
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
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox%2Cdecentraland&vs_currencies=usd'
  )
  const prices: ICoinPrices = await coin.json()

  return {
    props: {
      prices,
    },
  }
}

export default PortfolioPage
