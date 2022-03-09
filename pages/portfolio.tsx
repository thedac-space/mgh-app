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
import { Loader, WalletModal } from '../components'
import { Fade } from 'react-awesome-reveal'
import { Metaverse } from '../lib/enums'
import PortfolioList from '../components/Portfolio/PortfolioList'
import { BsTwitter } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import { SocialMediaOptions } from '../lib/socialMediaOptions'
import WalletButton from '../components/WalletButton'
import useConnectWeb3 from '../backend/connectWeb3'
import { ethers } from 'ethers'
import { Chains } from '../lib/chains'
import { getUserNFTs } from '../lib/nftUtils'
import { getAddress } from 'ethers/lib/utils'

const PortfolioPage: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const { query, push } = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const { web3Provider, disconnectWallet } = useConnectWeb3()

  const initialWorth = {
    ethPrediction: 0,
    usdPrediction: 0,
  }
  const { address, chainId } = useAppSelector((state) => state.account)
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

    const provider =
      !web3Provider || chainId !== Chains.ETHEREUM_MAINNET.chainId
        ? new ethers.providers.InfuraProvider(
            Chains.ETHEREUM_MAINNET.chainId,
            '03bfd7b76f3749c8bb9f2c91bdba37f3'
          )
        : web3Provider

    // Requesting and Formatting Assets
    const setPortfolioAssets = async () => {
      resetState()
      // OpenSea API Call
      try {
        await Promise.all(
          options.map(async (option) => {
            const rawIds = await getUserNFTs(
              provider,
              getAddress((externalWallet as string) ?? address),
              landOptions[option].contract
            )
            console.log({ rawIds })
            rawIds.length > 0 &&
              (await Promise.all(
                rawIds.map(async (id) => {
                  const formattedAsset = await formatLandAsset(
                    id,
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

      {openModal && <WalletModal onDismiss={() => setOpenModal(false)} />}

      <section className='w-full xs:w-[22rem] sm:w-[26rem] md:w-[48rem] lg:w-full max-w-7xl pt-12 xl:pt-0'>
        {/* Headers */}
        <hgroup className='text-gray-200 text-center flex flex-col'>
          {/* Change Title if there's a query on the uri */}
          <div className='sm:gray-box mb-8 sm:mb-12'>
            {externalWallet ? (
              <>
                <h1 className='md:text-5xl lg:text-6xl text-4xl green-text-gradient'>
                  Portfolio
                </h1>
                <ExternalLink
                  className='m-auto text-center sm:text-lg md:text-xl'
                  text={ellipseAddress(externalWallet as string)}
                  href={'https://opensea.io/' + externalWallet}
                />
              </>
            ) : (
              <h1 className='md:text-5xl lg:text-6xl text-4xl green-text-gradient'>
                Your Portfolio
              </h1>
            )}
          </div>
          {!externalWallet && !address ? (
            <div className='w-full flex justify-center'>
              <WalletButton
                onClick={() => setOpenModal(true)}
                disconnectWallet={disconnectWallet}
              />
            </div>
          ) : (
            // Total Lands and Total Worth Container
            <div className='flex flex-col md:flex-row gap-4 lg:gap-12 md:gap-6 mb-0 sm:mb-12'>
              {/* Total Lands */}
              <div className='flex flex-col justify-between gap-4 text-center transition-all gray-box relative'>
                <h3 className='text-xl md:text-3xl xl:text-4xl'>
                  Total LANDS Owned
                </h3>
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <p className='text-5xl animate-fade-in-slow text-blue-500 mb-2 font-medium'>
                      {totalAssets}
                    </p>
                    {externalWallet && (
                      <div
                        onClick={seeOwnPortfolio}
                        className='hover:scale-105 cursor-pointer max-w-max self-center font-medium text-white px-5 py-3 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-green-500/30 transition-all duration-300'
                      >
                        <span className='pt-1 text-xl'>My Portfolio</span>
                      </div>
                    )}
                    {/* Share Icons */}
                    {!externalWallet && address && (
                      <div className='flex gap-5 justify-end'>
                        {/* Copy Link */}
                        <button onClick={copyLink} className='relative'>
                          <FiCopy className='w-9 h-9 text-gray-400 relative hover:text-blue-400' />
                          {copiedText && (
                            <Fade direction='bottom-right' duration={500}>
                              <span className='font-medium min-w-max absolute w-fit p-3 pt-4 bg-black/50 backdrop-blur-xl rounded-xl -top-1/2'>
                                Link Copied!
                              </span>
                            </Fade>
                          )}
                        </button>
                        {/* Twitter */}
                        <button
                          onClick={() =>
                            window.open(socialMedia.twitter.portfolioLink)
                          }
                          className=''
                        >
                          <BsTwitter className='text-gray-400 w-9 h-9 hover:text-blue-400' />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Total Worth */}
              <div className='flex flex-col w-full md:w-2/3 transition-all justify-between text-center mb-8 sm:mb-0 gray-box'>
                <h3 className='text-xl md:text-3xl xl:text-4xl mb-4 whitespace-nowrap'>
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
