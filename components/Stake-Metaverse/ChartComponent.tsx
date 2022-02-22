import { createChart } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

const ChartComponent = ({ data }: any) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current!.clientWidth! })
    }

    const chart = createChart(chartContainerRef?.current!, {
      width: chartContainerRef?.current!.clientWidth,
      height: 300,
    })
    chart.timeScale().fitContent()

    const newSeries = chart.addAreaSeries({ lineColor: '#8884d8' })

    newSeries.setData(data)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)

      chart.remove()
    }
  }, [data])

  return <div ref={chartContainerRef} />
}

export default ChartComponent
