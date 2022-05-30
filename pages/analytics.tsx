import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
  ChartInfo,
  fetchChartData,
  RichList,
} from '../components/Analytics/fetchChartData'
import { Metaverse } from '../lib/metaverse'
import { formatName } from '../lib/utilities'
import Head from 'next/head'
import AnalyticsMvChoice from '../components/Analytics/AnalyticsMvChoice'
const AnalyticsChart = dynamic(
  () => import('../components/Analytics/AnalyticsChart'),
  {
    ssr: false,
  }
)

const FloorAndVolumeChart = dynamic(
  () => import('../components/Valuation/FloorAndVolumeChart'),
  {
    ssr: false,
  }
)

const Analytics: NextPage = () => {
  const [metaverse, setMetaverse] = useState<Metaverse>('sandbox')
  type RouteValues = Partial<
    Record<typeof routes[number]['route'], ChartInfo[]>
  >
  const [values, setValues] = useState<RouteValues>({})
  const [markCap, setMarkCap] = useState(0)
  const [richList, setRichList] = useState<RichList>()

  const routes = [
    { route: 'avgPriceParcel', label: 'Average Price per Parcel' },
    { route: 'floorPrice', label: 'Floor Price' },
    { route: 'avgPriceParcelPerArea', label: 'Average Price per Area' },
    { route: 'maxPrice', label: 'Max Price' },
    { route: 'totalNumberOfSales', label: 'Total Sales' },
    { route: 'stdSalesPrices', label: 'Sales Prices' },
    { route: 'salesVolume', label: 'Sales Volume' },
  ]

  useEffect(() => {
    const salesVolumeCall = async () => {
      const routesValues: RouteValues = {}
      await Promise.all(
        routes.map(async (_, i) => {
          routesValues[routes[i].route] = (await fetchChartData(
            metaverse,
            routes[i].route
          )) as ChartInfo[]
        })
      )

      setValues(routesValues)
      setMarkCap((await fetchChartData(metaverse, 'mCap')) as number)
      setRichList((await fetchChartData(metaverse, 'richList')) as RichList)
    }
    salesVolumeCall()
  }, [metaverse])
  return (
    <>
      <Head>
        <title>MGH | Analytics</title>
        <meta name='description' content='Analytics Dashboard' />
      </Head>
      <section className='w-full'>
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
            <p className='text-lg font-medium text-cyan-300 mb-8 whitespace-nowrap'>
              Lands held by the top 1% of holders:{' '}
              {richList?.pctParcels && (richList.pctParcels * 100).toFixed()}%
            </p>
            <p className='text-lg font-medium text-cyan-300'>
              Market Cap: {markCap.toFixed(2)} ETH
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
          {routes.map((element) => {
            if (values[element.route])
              return (
                <li>
                  <h3 className='text-gray-200 text-2xl'>{element.label}</h3>
                  <AnalyticsChart
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

export default Analytics
