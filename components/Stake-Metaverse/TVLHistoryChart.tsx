import { createChart } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

const TVLHistoryChart = ({ data }: any) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const theme = {
    chart: {
      timeScale: {
        // rightOffset: 50,
        // barSpacing: 10,
        // fixLeftEdge: true,
        // lockVisibleTimeRangeOnResize: true,
        // rightBarStaysOnScroll: true,
        // borderVisible: true,
        // borderColor: '#fff000',
        // visible: true,
        timeVisible: true,
        // secondsVisible: true,
      },
      layout: {
        backgroundColor: '#2B2B43',
        lineColor: '#2B2B43',
        textColor: '#D9D9D9',
      },
      watermark: {
        color: 'rgba(0, 0, 0, 0)',
      },
      // crosshair: {
      //   color: '#758696',
      // },
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
      topColor: 'rgba(32, 226, 47, 0.56)',
      bottomColor: 'rgba(32, 226, 47, 0.04)',
      lineColor: 'rgba(32, 226, 47, 1)',
    },
  }

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current!.clientWidth! })
    }

    const chart = createChart(chartContainerRef?.current!, {
      width: chartContainerRef?.current!.clientWidth,
      height: 250,
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

  return <div className='max-w-full' ref={chartContainerRef} />
}

export default TVLHistoryChart
