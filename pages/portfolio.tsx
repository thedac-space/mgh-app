import Head from 'next/head'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { formatLandAsset } from '../lib/valuation/valuationUtils'
import { ICoinPrices, IPriceCard } from '../lib/valuation/valuationTypes'
import {
  ExternalLink,
  HorizontalPriceCard,
  PriceList,
  SharePopup,
} from '../components/General'
import { IPredictions } from '../lib/types'
import { useAppSelector } from '../state/hooks'
import { Contracts } from '../lib/contracts'
import { useRouter } from 'next/router'
import { ellipseAddress } from '../lib/utilities'
import { Loader, WalletModal } from '../components'
import { Fade } from 'react-awesome-reveal'
import { useVisible } from '../lib/hooks'
import { Metaverse } from '../lib/enums'

type ContractsKey = 'sandbox' | 'decentraland'

const PortfolioPage: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const [openModal, setOpenModal] = useState(false)
  const { query, push } = useRouter()

  const contracts = {
    // LAND contract address might have to be changed once Sandbox && OpenSea finish migration
    sandbox: Contracts.LAND.ETHEREUM_MAINNET.newAddress,
    decentraland: Contracts.PARCEL.ETHEREUM_MAINNET.address,
  }

  const initialWorth = {
    ethPrediction: 0,
    usdPrediction: 0,
  }
  const { address } = useAppSelector((state) => state.account)
  const [copiedText, setCopiedText] = useState<Boolean>(false)

  const {
    ref,
    isVisible: showPopup,
    setIsVisible: setShowPopup,
  } = useVisible(false)

  const [totalWorth, setTotalWorth] = useState<IPredictions>(initialWorth)
  const [alreadyFetched, setAlreadyFetched] = useState(false)
  const [formattedAssets, setFormattedAssets] = useState<IPriceCard[]>([])
  const [loading, setLoading] = useState(true)
  const externalWallet = query.wallet

  const onPopupSelect = (copy: boolean) => {
    if (copy) {
      navigator.clipboard.writeText(
        'https://app.metagamehub.io/portfolio?wallet=' + address
      )
      // Display Feedback Text
      setShowPopup(!showPopup)
      setCopiedText(true)
      setTimeout(() => {
        setCopiedText(false)
      }, 1100)
    } else {
      setShowPopup(!showPopup)
    }
  }

  /* When coming from a shared link. We can see our own portfolio 
  by deleting the query params .*/
  const seeOwnPortfolio = () => {
    resetState()
    push('/portfolio')
  }
  const onClick = () => {
    externalWallet || !address ? seeOwnPortfolio() : setShowPopup(true)
  }

  // Resetting state when Wallet Changes
  const resetState = () => {
    setCopiedText(false)
    setLoading(true)
    setTotalWorth(initialWorth)
    setFormattedAssets([])
  }

  useEffect(() => {
    if (!externalWallet && !address) {
      setOpenModal(true)
      return
    }

    if (externalWallet && alreadyFetched) return
    setAlreadyFetched(true)

    // Requesting and Formatting Assets
    const setPortfolioAssets = async () => {
      resetState()

      // OpenSea API Call
      try {
        const options = Object.keys(contracts) as ContractsKey[]
        for (const option in options) {
          const res = await fetch('/api/fetchAssets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              wallet: (externalWallet as string) ?? address,
              assetContract: contracts[options[option]],
            }),
          })
          const rawAssets = await res.json()
          // Formatting Assets to fit into the Cards
          rawAssets &&
            (await Promise.all(
              rawAssets.assets.map(async (asset: any) => {
                const formattedAsset = await formatLandAsset(
                  asset.token_id,
                  prices,
                  options[option] as Metaverse
                )

                setFormattedAssets((previousState) => [
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
              })
            ))
        }
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
        {openModal && <WalletModal onDismiss={() => setOpenModal(false)} />}
        {/* Headers */}
        <hgroup className='text-white text-center'>
          {/* Change Title if there's a query on the uri */}
          <div className='sm:gray-box mb-8 sm:mb-12'>
            {externalWallet ? (
              <>
                <h1 className='green-text-gradient'>Portfolio</h1>
                <ExternalLink
                  className='m-auto text-center sm:text-lg md:text-xl'
                  text={ellipseAddress(externalWallet as string)}
                  href={'https://opensea.io/' + externalWallet}
                />
              </>
            ) : (
              <h1 className='green-text-gradient'>Your Portfolio</h1>
            )}
          </div>
          {/* Total Lands and Total Worth Container */}
          <div className='flex flex-col sm:flex-row gap-4 md:gap-12 mb-8 sm:mb-12'>
            {/* Total Lands */}
            <div className='flex flex-col justify-between gap-4 sm:gap-0 text-center transition-all gray-box relative'>
              <h3 className='text-xl md:text-3xl xl:text-4xl'>
                Total LANDS Owned
              </h3>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <p className='text-4xl animate-fade-in-slow  reverse-text-gradient font-bold'>
                    {formattedAssets.length}
                  </p>
                  <button
                    onClick={onClick}
                    className='min-w-fit w-1/2 mx-auto hoverlift animate-fade-in-slow text-white py-3 px-4 rounded-xl bg-gradient-to-br transition-all duration-300 from-pink-600 to-blue-500'
                  >
                    {/* Changing button if we come from a shared link 
                      if not then we change if we copied our own link to share to others */}
                    {externalWallet || !address
                      ? 'See your Own Portfolio'
                      : copiedText
                      ? 'Link Copied to Clipboard!'
                      : 'Share this Portfolio'}
                  </button>
                  {/* Had to add this div to have a non-dissapearing ref */}
                  <div className='contents' ref={ref}>
                    {showPopup && (
                      <Fade className='z-10 absolute -bottom-3 left-1/2 -translate-x-2/4'>
                        <SharePopup
                          sharing='portfolio'
                          onPopupSelect={onPopupSelect}
                        />
                      </Fade>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Total Worth */}
            <div className='flex flex-col w-full sm:w-2/3 transition-all justify-between text-center gray-box'>
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
        </hgroup>

        {/* Lands Grid */}
        {formattedAssets.length > 0 && (
          <ul className='grid gap-4 md:gap-12 sm:grid-cols-2'>
            <Fade
              duration={400}
              className='w-full flex justify-center'
              triggerOnce
            >
              {formattedAssets.map(
                ({ apiData, showCard, predictions, processing }) => (
                  <li
                    key={apiData?.tokenId}
                    className='w-75vw sm:w-full gray-box'
                  >
                    <HorizontalPriceCard
                      verticalUnder='lg'
                      apiData={apiData}
                      showCard={showCard}
                      predictions={predictions}
                      processing={processing}
                    />
                  </li>
                )
              )}
            </Fade>
          </ul>
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
