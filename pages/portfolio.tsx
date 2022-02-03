import Head from 'next/head'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { formatLandAsset } from '../lib/valuation/valuationUtils'
import { ICoinPrices, IPriceCard } from '../lib/valuation/valuationTypes'
import {
  ExternalLink,
  HorizontalPriceCard,
  PriceList,
} from '../components/General'
import { IPredictions } from '../lib/types'
import { useAppSelector } from '../state/hooks'
import { Contracts } from '../lib/contracts'
import { useRouter } from 'next/router'
import { ellipseAddress } from '../lib/utilities'
import { Loader, WalletModal } from '../components'

const PortfolioPage: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const [openModal, setOpenModal] = useState(false)
  const { query, push } = useRouter()
  const LAND_CONTRACT_ADDRESS = Contracts.LAND.ETHEREUM_MAINNET.address
  const initialWorth = {
    ethPrediction: 0,
    usdPrediction: 0,
    sandPrediction: 0,
  }
  const { address } = useAppSelector((state) => state.account)
  const [copiedText, setCopiedText] = useState<Boolean>(false)
  const [totalWorth, setTotalWorth] = useState<IPredictions>(initialWorth)
  const [alreadyFetched, setAlreadyFetched] = useState(false)
  const [formattedAssets, setFormattedAssets] = useState<IPriceCard[]>([])
  const [loading, setLoading] = useState(true)
  const externalWallet = query.wallet

  // Copying portfolio link for sharing
  const sharePortfolio = () => {
    navigator.clipboard.writeText(
      'https://app.metagamehub.io/valuation?wallet=' + address
    )
    setCopiedText(true)
  }

  /* When coming from a shared link. We can see our own portfolio 
  by deleting the query params .*/
  const seeOwnPortfolio = () => {
    resetState()
    push('/portfolio')
  }
  const onClick = () => {
    externalWallet || !address ? seeOwnPortfolio() : sharePortfolio()
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
        const res = await fetch('/api/fetchAssets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet: (externalWallet as string) ?? address,
            assetContract: LAND_CONTRACT_ADDRESS,
          }),
        })
        const rawAssets = await res.json()
        // Formatting Assets to fit into the Cards
        rawAssets &&
          (await Promise.all(
            rawAssets.assets.map(async (asset: any) => {
              const formattedAsset = await formatLandAsset(asset, prices)
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
                sandPrediction:
                  previousWorth.sandPrediction! +
                  formattedAsset.predictions!.sandPrediction!,
              }))
              // }
            })
          ))
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
            <div className='flex flex-col justify-between gap-4 sm:gap-0 text-center transition-all gray-box'>
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
                    className='hoverlift animate-fade-in-slow text-white p-4 rounded-xl bg-gradient-to-br transition-all duration-300 from-pink-600 to-blue-500'
                  >
                    {/* Changing button if we come from a shared link 
                      if not then we change if we copied our own link to share to others */}
                    {externalWallet || !address
                      ? 'See your Own Portfolio'
                      : copiedText
                      ? 'Link Copied to Clipboard!'
                      : 'Share this Portfolio'}
                  </button>
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
