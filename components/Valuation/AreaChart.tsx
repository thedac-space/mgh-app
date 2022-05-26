import React, { useEffect, useState, useRef } from 'react'
import { Metaverse } from '../../lib/enums'
import { createChart, UTCTimestamp } from 'lightweight-charts'
import { typedKeys } from '../../lib/utilities'
import { IChartValues, symbolPredictions } from '../../lib/types'

interface SymbolProperties {
  key: string
  [key: string]: any
}

interface Symbol {
  [key: string]: SymbolProperties
}

interface Props {
  metaverse: Metaverse
  data: IChartValues[]
  symbolOptions?: Symbol
  defaultSymbol?: string
  label: string
}

/*const setChartInterval = (data: any, interval: any) => {
  if (interval === 'daily') return data
  if (interval === 'weekly') {
    let intervaledData = []
    let valueSum = 0
    let dayCounter = 0
    data.forEach((date: any) => {
      valueSum += date.data
      dayCounter++
      if (dayCounter === 7) {
        intervaledData.push({
          time: date.time,
          data: valueSum / dayCounter,
        })

        dayCounter = 0
        valueSum = 0
      }
    })
    return intervaledData
  }
  if (interval === 'monthly') {
    let intervaledData = []
    let valueSum = 0
    let dayCounter = 0
    data.forEach((date: any) => {
      valueSum += date.data
      dayCounter++
      if (dayCounter === 30) {
        intervaledData.push({
          time: date.time,
          data: valueSum / dayCounter,
        })

        dayCounter = 0
        valueSum = 0
      }
    })
    return intervaledData
  }
}*/

const setChartInterval = (data: any, interval: any) => {
  if (interval === 'all') return data
  if (interval === 'week') {
    return data.slice(data.length-7,data.lenght)
  }
  if (interval === 'month') {
    let date=new Date(data[data.length-1].time*1000)
    console.log(data[data.length-1])
    console.log(date,date.getFullYear(),date.getMonth())
    console.log(new Date(date.getFullYear(), date.getMonth(), 0).getDate())
    return data.slice(data.length-new Date(date.getFullYear(), date.getMonth(), 0).getDate()+2,data.lenght)
  }
  if (interval === 'year') {
    return data.slice(data.length-366,data.lenght)
  }
}

const AreaChart = ({
  metaverse,
  data,
  symbolOptions,
  defaultSymbol,
  label,
}: Props) => {
  const chartElement = useRef<HTMLDivElement>(null)
  if (symbolOptions)
    var [symbol, setSymbol] = useState<keyof typeof symbolOptions>(
      defaultSymbol ? defaultSymbol : 'ETH',
    ) //Supposing price is always eth

  /*const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const intervals = {daily:{label:"1D"},weekly:{label:"1W"},monthly:{label:"1M"}}*/

  const [interval, setInterval] = useState<'week' | 'month'|'year'|'all' >('all')
  const intervals = {week:{label:"1W"},month:{label:"1M"},year:{label:"1Y"},all:{label:"ALL"}}
  useEffect(() => {
    if (!chartElement.current) return
    const chart = createChart(chartElement.current, {
      width: chartElement.current.clientWidth,
      height: 197,
      timeScale: {
        fixLeftEdge: true,
        fixRightEdge: true,
        timeVisible: false,
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
        borderVisible: false,
      },
      layout: {
        backgroundColor: '#131722',
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: {
          color: 'rgba(42, 46, 57, 0)',
        },
        horzLines: {
          color: 'rgba(42, 46, 57, 0.6)',
        },
      },
    })
    const areaSeries = chart.addAreaSeries({
      topColor: 'rgba(38,198,218, 0.56)',
      bottomColor: 'rgba(38,198,218, 0.04)',
      lineColor: 'rgba(38,198,218, 1)',
      lineWidth: 2,
      title: label,
    })
    console.log(setChartInterval(data, interval))
    areaSeries.setData(
      setChartInterval(data, interval).map((currentData) => {
        return {
          time: parseInt(currentData.time) as UTCTimestamp,
          value:
            symbolOptions && typeof data == 'object'
              ? (currentData.data as Record<symbolPredictions, number>)[
                  symbolOptions[symbol].key as symbolPredictions
                ]
              : currentData.data,
        }
      }),
    )
    const resizeGraph = () =>
      chart.applyOptions({ width: chartElement.current?.clientWidth })
    window.addEventListener('resize', resizeGraph)
    return () => {
      window.removeEventListener('resize', resizeGraph)
      chart.remove()
    }
  }, [data, symbol, interval])

  return (
    <div className="flex flex-col shadow-blck rounded-xl py-3 px-4 w-full bg-grey-dark bg-opacity-20 ">
      <div className="max-w-full h-full relative" ref={chartElement}>
        <div className="absolute top-1 left-1 z-10 flex gap-2">
          {symbolOptions &&
            typedKeys(symbolOptions).map((arrSymbol) => (
              <button
                key={arrSymbol}
                className={
                  'gray-box font-semibold rounded-lg p-2 text-xs text-gray-400' +
                  (symbol === arrSymbol
                    ? ' text-gray-300 bg-opacity-80 '
                    : ' hover:text-gray-300 hover:bg-opacity-80')
                }
                onClick={() => setSymbol(arrSymbol)}
              >
                {arrSymbol === 'METAVERSE'
                  ? symbolOptions[arrSymbol][metaverse]
                  : arrSymbol}
              </button>
            ))}
        </div>
        <div className="absolute top-1 left-1 z-10 flex gap-2">
          {
            typedKeys(intervals).map((arrInterval) => (
              <button
                key={arrInterval}
                className={
                  'gray-box font-semibold rounded-lg p-2 text-xs text-gray-400' +
                  (interval === arrInterval
                    ? ' text-gray-300 bg-opacity-80 '
                    : ' hover:text-gray-300 hover:bg-opacity-80')
                }
                onClick={() => setInterval(arrInterval)}
              >
                {intervals[arrInterval]["label"]}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
export default AreaChart
