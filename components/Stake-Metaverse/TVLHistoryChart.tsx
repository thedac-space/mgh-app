import { createChart } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

const TVLHistoryChart = ({ data }: any) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const theme = {
    chart: {
      timeScale: {
        barSpacing: 1,
        // fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        // rightBarStaysOnScroll: true,
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

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current!.clientWidth! })
    }

    const chart = createChart(chartContainerRef?.current!, {
      width: chartContainerRef?.current!.clientWidth,
      height: 280,
    })
    chart.timeScale().fitContent()

    const areaSeries = chart.addAreaSeries()
    chart.applyOptions(theme.chart)
    areaSeries.applyOptions(theme.series)
    areaSeries.setData(data)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)

      chart.remove()
    }
  }, [data])

  return <div className='max-w-full h-full' ref={chartContainerRef} />
}

export default TVLHistoryChart
