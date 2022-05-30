import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { PriceList } from '../components/General'
import {
  ChartInfo,
  fetchChartData,
  RichList,
} from '../components/Analytics/fetchChartData'
import { Metaverse } from '../lib/metaverse'
import { formatName } from '../lib/utilities'
import Head from 'next/head'
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
    { route: 'stdSalesPrices', label: 'std Sales Prices' },
    { route: 'salesVolume', label: 'Sales Volume' },
  ] as const

  useEffect(() => {
    const salesVolumeCall = async () => {
      const routesValues: RouteValues = {}
      for (let element in routes) {
        routesValues[routes[element]['route']] = (await fetchChartData(
          metaverse,
          routes[element]['route']
        )) as ChartInfo[]
        routesValues
      }
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
        <div className='flex flex-col sm:flex-row space-y-5 sm:space-y-0 space-x-0 sm:space-x-5 md:space-x-10 items-stretch justify-between w-full'>
          <div className='flex flex-col shadow-blck rounded-xl py-3 px-4 w-full bg-grey-dark bg-opacity-20 '>
            <p className='text-lg xl:text-xl font-medium text-gray-300 mb-4'>
              Market Cap:
            </p>
            <PriceList
              predictions={{ ethPrediction: markCap }}
              metaverse={metaverse}
            />
          </div>
          <div className='flex flex-col justify-between w-full space-y-5 md:space-y-10 lg:space-y-5'>
            <div className='flex flex-col shadow-blck rounded-xl py-3 px-4 bg-grey-dark bg-opacity-20'>
              <p
                className={`text-lg xl:text-xl font-medium text-cyan-300 mb-8`}
              >
                Lands held by the top 1% of holders:{' '}
                {richList?.pctParcels && (richList.pctParcels * 100).toFixed()}%
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex-col shadow-blck rounded-xl py-3 px-4 w-full bg-grey-dark bg-opacity-20 '>
          <FloorAndVolumeChart metaverse={metaverse} />
        </div>
        {routes.map((element) => {
          if (values[element.route])
            return (
              <AnalyticsChart
                metaverse={metaverse}
                data={values[element.route]!}
                label={element.label}
              />
            )
        })}
      </section>
    </>
  )
}

export default Analytics
