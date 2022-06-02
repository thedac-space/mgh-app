import { NextPage } from 'next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
  ChartInfo,
  fetchChartData,
  RichList,
} from '../components/Analytics/fetchChartData'
import { Metaverse } from '../lib/metaverse'
import { formatName, getState } from '../lib/utilities'
import Head from 'next/head'
import {
  AnalyticsChart,
  AnalyticsMvChoice,
  FloorAndVolumeChart,
  chartRoutes,
} from '../components/Analytics'
import { ICoinPrices } from '../lib/valuation/valuationTypes'
import { RiLoader3Fill } from 'react-icons/ri'

const analyticsState = ['loading', 'loaded', 'error'] as const
type AnalyticsState = typeof analyticsState[number]

interface Props {
  prices: ICoinPrices
}

const Analytics: NextPage<Props> = ({ prices }) => {
  const [metaverse, setMetaverse] = useState<Metaverse>('sandbox')
  type RouteValues = Partial<
    Record<typeof chartRoutes[number]['route'], ChartInfo[]>
  >
  const [values, setValues] = useState<RouteValues>({})
  const [state, setState] = useState<AnalyticsState>('loading')
  const [loading, loaded, error] = getState(state, [...analyticsState])
  const [markCap, setMarkCap] = useState(0)
  const [richList, setRichList] = useState<RichList>()

  useEffect(() => {
    const salesVolumeCall = async () => {
      setState('loading')
      const routesValues: RouteValues = {}
      await Promise.all(
        chartRoutes.map(async (_, i) => {
          routesValues[chartRoutes[i].route] = (await fetchChartData(
            metaverse,
            chartRoutes[i].route
          )) as ChartInfo[]
        })
      )

      setValues(routesValues)
      setMarkCap((await fetchChartData(metaverse, 'mCap')) as number)
      setRichList((await fetchChartData(metaverse, 'richList')) as RichList)
      setState('loaded')
    }
    salesVolumeCall()
  }, [metaverse])
  return (
    <>
      <Head>
        <title>MGH | Analytics</title>
        <meta name='description' content='Analytics Dashboard' />
      </Head>
      <section className='w-full max-w-7xl'>
        {/* Main Header */}
        <div className='gray-box flex flex-col sm:flex-row justify-between items-center mb-8'>
          <h1 className='text-transparent bg-clip-text lg:text-5xl text-3xl bg-gradient-to-br green-text-gradient mb-0 sm:mb-2'>
            Analytics
          </h1>
          {/* Links Wrapper */}
          <div className='flex gap-5'>
            {/* Links */}
            {['portfolio', 'watchlist', 'valuation'].map((option) => (
              <Link key={option} href={`/${option}`}>
                <a className='hover:scale-105 font-medium text-white px-5 py-3 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-green-500/30 transition-all duration-300'>
                  <span className='text-xl'>{formatName(option)}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
        {/* Wrapper Metaverse Buttons - MarketCap/Owners */}
        <div className='flex flex-col sm:flex-row gap-5 gray-box bg-opacity-5 w-fit m-auto mb-8'>
          {/* Metaverse Choice Buttons */}
          <AnalyticsMvChoice
            metaverse={metaverse}
            setMetaverse={setMetaverse}
          />
          {/* Market Cap - Owners Land % */}
          <div className='w-fit flex flex-col justify-center '>
            <p className='text-lg font-medium text-cyan-300 mb-8 whitespace-nowrap flex gap-1'>
              Lands held by the top 1% of holders:{' '}
              {loaded ? (
                richList?.pctParcels &&
                (richList.pctParcels * 100).toFixed() + '%'
              ) : (
                <RiLoader3Fill className='animate-spin-slow h-5 w-5 xs:h-6 xs:w-6' />
              )}
            </p>
            <p className='text-lg font-medium text-cyan-300 flex whitespace-nowrap gap-1'>
              Market Cap:{' '}
              {loaded ? (
                `${markCap.toFixed(2)} ETH`
              ) : (
                <RiLoader3Fill className='animate-spin-slow h-5 w-5 xs:h-6 xs:w-6' />
              )}
            </p>
          </div>
        </div>

        {/* Charts Wrapper */}
        <ul className='flex flex-col gap-4'>
          {/* Floor Volume Chart */}
          <li>
            <h3 className='text-gray-200 text-2xl'>Floor and Volume Price</h3>
            <div className='gray-box'>
              <FloorAndVolumeChart metaverse={metaverse} />
            </div>
          </li>
          {/* Rest of Charts */}
          {chartRoutes.map((element) => {
            if (values[element.route])
              return (
                <li>
                  <h3 className='text-gray-200 text-2xl'>{element.label}</h3>
                  <AnalyticsChart
                    prices={prices}
                    metaverse={metaverse}
                    data={values[element.route]!}
                    label={element.label}
                  />
                </li>
              )
          })}
        </ul>
      </section>
    </>
  )
}

export async function getServerSideProps() {
  const coin = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox%2Cdecentraland%2Caxie-infinity&vs_currencies=usd'
  )
  const prices = await coin.json()
  return {
    props: {
      prices,
    },
  }
}
export default Analytics
