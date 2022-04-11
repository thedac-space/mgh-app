import dynamic from 'next/dynamic'
import React, { useEffect, useState, useRef } from 'react'
import { Metaverse } from '../../lib/enums'
import { getValuationDailyData } from '../../lib/FirebaseUtilities'
import { typedKeys } from '../../lib/utilities'

const AreaChart = dynamic(() => import('./AreaPriceChart'), {
  ssr: false,
})

interface IChartValues {
  time: number
  dailyVolume: Record<FloorVolumeKeys, number>
  floorPrice: Record<FloorVolumeKeys, number>
}

type FloorVolumeKeys = 'ethPrediction' | 'usdPrediction' | 'metaversePrediction'

const ChartWrapper = ({ metaverse }: { metaverse: Metaverse }) => {
  const [values, setValues] = useState<any[]>([])
  useEffect(() => {
    ;(async () => setValues(await getValuationDailyData(metaverse)))()
  }, [metaverse])

  return (
    <>
      <AreaChart
        metaverse={metaverse}
        data={values}
        symbolOptions={{
          ETH: { key: 'ethPrediction' },
          USDC: { key: 'usdPrediction' },
          METAVERSE: {
            key: 'metaversePrediction',
            sandbox: 'SAND',
            decentraland: 'MANA',
            'axie-infinity': 'AXS',
          },
        }}
      />
    </>
  )
}

export default ChartWrapper
