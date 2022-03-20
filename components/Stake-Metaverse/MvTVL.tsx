import React, { useEffect, useState } from 'react'
import useConnectWeb3 from '../../backend/connectWeb3'

import { ICoinPrices } from '../../lib/valuation/valuationTypes'
import { MainMvState } from '../../lib/stake-metaverse/types'
import { getTVLHistory } from '../../lib/FirebaseUtilities'
import { TVLHistoryChart } from '.'

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
  const [data, setData] = useState<Array<{ time: number; value: number }>>([])

  const toUsd = (amount: number) => {
    return Number((amount * prices['the-sandbox'].usd).toFixed(2))
  }
  useEffect(() => {
    const setStatus = async () => {
      // Getting Docs from Firestore (updates every 5 min)
      const docs = await getTVLHistory()
      // Formatting for Chart
      const formattedDocs = docs.map((doc) => {
        return { time: doc.time / 1000, value: toUsd(doc.tvl) }
      })
      // Current TVL in case there's a change in the TVL that hasn't been reflected on Firestore yet
      const currentTvl = { time: Date.now() / 1000, value: toUsd(tvl.tvl) }
      setData([...formattedDocs, currentTvl])
    }
    setStatus()
  }, [web3Provider, refetch])

  return (
    <div>
      <h3 className='text-gray-200 text-xl'>
        Current TVL: <span>{data[data.length - 1]?.value} $USD</span>
      </h3>
      <TVLHistoryChart data={data} />
    </div>
  )
}

export default MvTVL
