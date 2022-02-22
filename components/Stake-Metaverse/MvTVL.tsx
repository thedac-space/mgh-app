import React, { useEffect, useState } from 'react'
import useConnectWeb3 from '../../backend/connectWeb3'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import dynamic from 'next/dynamic'

import { ICoinPrices } from '../../lib/valuation/valuationTypes'
import { MainMvState } from '../../lib/stake-metaverse/types'
import { getTVLHistory } from '../../lib/FirebaseUtilities'
import { ChartComponent } from '.'

interface Props {
  refetch: boolean
  tvl: {
    tvl: number
    totalAmountStaked: number
    landsWorth: number
    botSandBalance: number
  }
  prices: ICoinPrices
  mainState: MainMvState
}

const MvTVL = ({ refetch, tvl, prices, mainState }: Props) => {
  const { web3Provider } = useConnectWeb3()
  const [data, setData] = useState<Array<{ time: string; value: number }>>([])

  const toUsd = (amount: number) => {
    return Number((amount * prices['the-sandbox'].usd).toFixed(2))
  }

  useEffect(() => {
    const setStatus = async () => {
      const docs = await getTVLHistory()
      const formattedDocs = docs.map((doc) => {
        return { time: `${doc.date}`, value: toUsd(doc.tvl) }
      })
      setData(formattedDocs)
    }
    setStatus()
  }, [web3Provider, refetch])

  return (
    <>
      <h3 className='green-text-gradient text-xl'>
        Current TVL: <span>{toUsd(tvl.tvl)} $USD</span>
      </h3>
      <ChartComponent data={data} />
      {/* <LineSeries /> */}
      {/* <ResponsiveContainer width='100%' height='80%'>
        <AreaChart
          width={450}
          height={200}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis />
          <Tooltip />
          <Area type='monotone' dataKey='tvl' stroke='#8884d8' fill='#8884d8' />
        </AreaChart>
      </ResponsiveContainer> */}
    </>
  )
}

export default MvTVL
