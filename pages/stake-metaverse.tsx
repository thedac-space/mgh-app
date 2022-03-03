import { ethers } from 'ethers'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import useConnectWeb3 from '../backend/connectWeb3'
import { getCurrentEpoche, getTVL } from '../backend/metaverseStaking'
import { Loader } from '../components'
import {
  AllocationChart,
  MainMvStakingInterface,
  MvInfoTable,
  MvTVL,
} from '../components/Stake-Metaverse'
import { Chains } from '../lib/chains'
import { MainMvState } from '../lib/stake-metaverse/types'
import { ICoinPrices } from '../lib/valuation/valuationTypes'
import { useAppSelector } from '../state/hooks'

interface Epoche {
  formattedEpoche: {
    start: string
    end: string
    lastEnd: string
  }
  nextEpocheStart: string
}

interface TVL {
  tvl: number
  totalAmountStaked: number
  landsWorth: number
  botSandBalance: number
}

const MetaverseStaking: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const { web3Provider } = useConnectWeb3()
  const { address, chainId } = useAppSelector((state) => state.account)
  const [refetch, setRefetch] = useState(false)
  const [state, setState] = useState<MainMvState>()
  const [epoche, setEpoche] = useState<Epoche>()
  const [tvl, setTvl] = useState<TVL>({
    tvl: 0,
    totalAmountStaked: 0,
    landsWorth: 0,
    botSandBalance: 0,
  })

  useEffect(() => {
    const fetchState = async () => {
      !state && setState('loadingFirst')
      const provider =
        !web3Provider || chainId !== Chains.ETHEREUM_RINKEBY.chainId
          ? new ethers.providers.InfuraProvider(
              Chains.ETHEREUM_RINKEBY.chainId,
              '03bfd7b76f3749c8bb9f2c91bdba37f3'
            )
          : web3Provider
      // Getting Epoche Stats
      const epoche = await getCurrentEpoche(provider)
      setEpoche(epoche)
      const tvl = await getTVL(provider)
      setTvl(tvl)

      setState('loaded')
      if (!address) setState('noWallet')
    }
    fetchState()
  }, [web3Provider, refetch])

  return (
    <>
      <Head>
        <title>MGH - Staking - Metaverse</title>
        <meta
          name='description'
          content='Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data.'
        />
      </Head>
      <section className='w-full xs:w-75vw lg:w-full h-full max-w-5xl pt-12 xl:pt-0 text-gray-400'>
        {state === 'loadingFirst' ? (
          <div className='flex w-full h-full justify-center items-center'>
            <Loader />
          </div>
        ) : (
          <>
            <h1 className='text-center mb-16 text-6xl green-text-gradient'>
              Metaverse Staking
            </h1>

            <div className='flex justify-between items-center'>
              <hgroup>
                <h4 className='text-base text-gray-300 border-none'>
                  <span className='font-medium'> Next Withdrawal Phase:</span>{' '}
                  {epoche?.formattedEpoche.end}
                </h4>
                <h4 className='text-base text-gray-300 border-none'>
                  <span className='font-medium'> Next Epoche Start: </span>{' '}
                  {epoche?.nextEpocheStart}
                </h4>
              </hgroup>

              {address && (
                <button className='hoverlift text-white p-4 rounded-xl bg-gradient-to-br transition-all duration-300 from-pink-600 to-blue-500 font-medium'>
                  <Link href='/mynfts'>View my NFTs</Link>
                </button>
              )}
            </div>
            {/* Top Tools */}
            <div className='flex flex-col lg:flex-row w-full items-stretch justify-between gap-4 mb-4 max-h-full'>
              {/* Main Interface */}
              <MainMvStakingInterface
                mainState={state}
                refetch={refetch}
                setRefetch={setRefetch}
              />
              {/* Charts */}
              <div className='flex flex-col gap-4 w-full lg:max-w-[650px]'>
                <div className='gray-box bg-opacity-10 relative'>
                  <AllocationChart
                    mainState={state}
                    prices={prices}
                    tvl={tvl}
                  />
                </div>
                {/* TVL */}
                <div className='gray-box bg-opacity-10'>
                  <MvTVL
                    mainState={state}
                    tvl={tvl}
                    refetch={refetch}
                    prices={prices}
                  />
                </div>
              </div>
            </div>
            {/* Table */}
            <div>
              <h3 className='text-xl text-gray-300'>Latest Bot Transactions</h3>
              <MvInfoTable />
            </div>
          </>
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
export default MetaverseStaking
