import { createChart } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react'

interface Data {
  time: number
  value: number
}

const TVLHistoryChart = ({ data }: { data: Data[] }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [interval, setInterval] = useState<'daily' | 'hourly' | '5min'>('5min')

  const theme = {
    chart: {
      timeScale: {
        barSpacing: 1,
        fixLeftEdge: true,
        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
        borderVisible: true,
        borderColor: '#15ff002d',
        visible: true,
        timeVisible: true,
      },
      layout: {
        backgroundColor: '#2B2B43',
        lineColor: '#2B2B43',
        textColor: '#D9D9D9',
      },
      watermark: {
        color: 'rgba(0, 0, 0, 0)',
      },

      grid: {
        vertLines: {
          color: '#2B2B43',
        },
        horzLines: {
          color: '#363C4E',
        },
      },
    },
    series: {
      // Change this to change colors lines of the chart
      // topColor: '#a8205d',
      // bottomColor: '#db277821',
      // lineColor: '#db2777',
    },
  }

  // Filtering Data between 5min/1hour/1day
  const setChartInterval = (data: Data[]) => {
    if (interval === '5min') return data
    const filteredData = data.filter((element, i) => {
      let time = 0
      let nextTime = 0
      if (interval === 'hourly') {
        time = new Date(element.time * 1000).getHours()
        nextTime = new Date(data[i + 1]?.time * 1000).getHours()
      }
      if (interval === 'daily') {
        time = new Date(element.time * 1000).getDay()
        nextTime = new Date(data[i + 1]?.time * 1000).getDay()
      }
      return time !== nextTime
    })
    return filteredData
  }

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current!.clientWidth! })
    }

    const chart = createChart(chartContainerRef?.current!, {
      width: chartContainerRef?.current!.clientWidth,
      height: 280,
    })
    chart.timeScale().fitContent()
    const chartData = setChartInterval(data)

    const areaSeries = chart.addAreaSeries()
    chart.applyOptions(theme.chart)
    areaSeries.applyOptions(theme.series)
    areaSeries.setData(chartData as any /* :) */)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)

      chart.remove()
    }
  }, [data, interval])

  return (
    <div className='max-w-full h-full relative' ref={chartContainerRef}>
      <div className='absolute top-1 left-1 z-10 flex gap-2'>
        <button
          className='gray-box font-semibold rounded-lg p-2 text-xs text-gray-400 hover:text-gray-300 hover:bg-opacity-80'
          onClick={() => setInterval('5min')}
        >
          5MIN
        </button>
        <button
          className='gray-box font-semibold rounded-lg p-2 text-xs text-gray-400 hover:text-gray-300 hover:bg-opacity-80'
          onClick={() => setInterval('hourly')}
        >
          1H
        </button>
        <button
          className='gray-box font-semibold rounded-lg p-2 text-xs text-gray-400 hover:text-gray-300 hover:bg-opacity-80'
          onClick={() => setInterval('daily')}
        >
          1D
        </button>
      </div>
    </div>
  )
}

export default TVLHistoryChart
