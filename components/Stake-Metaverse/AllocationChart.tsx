import React, { useEffect, useRef, useState } from 'react'
import { BsCircleFill, BsDot } from 'react-icons/bs'
import { Cell, Pie, PieChart, ResponsiveContainer, Label } from 'recharts'
import { MainMvState } from '../../lib/stake-metaverse/types'
import { ICoinPrices } from '../../lib/valuation/valuationTypes'
interface TVL {
  tvl: number
  totalAmountStaked: number
  landsWorth: number
  botSandBalance: number
}

interface Props {
  tvl: TVL
  prices: ICoinPrices
  mainState: MainMvState
}
const AllocationChart = ({ tvl, prices, mainState }: Props) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [outerRadius, setOuterRadius] = useState(30)
  const data = [
    {
      name: 'Bot Sand Balance',
      value: Number(
        (tvl.botSandBalance * prices['the-sandbox'].usd).toFixed(2)
      ),
    },
    {
      name: 'Total Amount Staked',
      value: Number(
        (tvl.totalAmountStaked * prices['the-sandbox'].usd).toFixed(2)
      ),
    },
    {
      name: 'Total LANDs Value',
      value: Number((tvl.landsWorth * prices['the-sandbox'].usd).toFixed(2)),
    },
  ]
  const COLORS = ['#e08f8d', '#6caf6c', '#8884d8']

  useEffect(() => {
    // Initial Size Calculation
    const initialCalculation = chartContainerRef?.current!.offsetWidth / 12
    setOuterRadius(initialCalculation > 35 ? initialCalculation : 39)
    const handleResize = () => {
      const calculation = chartContainerRef?.current!.offsetWidth / 12
      const radiusNumber = calculation > 35 ? calculation : 39
      setOuterRadius(radiusNumber)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [data])

  // Function to Style Chart's Labels
  const renderLabel = (entry: any /* Pie Data Object */) => {
    const text =
      outerRadius < 40
        ? (entry.percent * 100).toFixed(0) + '%'
        : `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`
    return text
    // return (
    //   <text
    //     x={entry.x}
    //     y={entry.y}
    //     dy={-4}
    //     fontSize='16'
    //     fontFamily='sans-serif'
    //     fill={entry.fill}
    //   >
    //     {entry.value}%
    //   </text>
    // )
  }

  return (
    <div ref={chartContainerRef}>
      <h3 className='text-xl py-0 text-gray-300'>TVL Allocation</h3>

      <ResponsiveContainer width='100%' height={180} debounce={25}>
        <PieChart className='mx-auto'>
          <Pie
            isAnimationActive={false}
            data={data}
            dataKey='value'
            label={renderLabel}
            cx='50%'
            cy='50%'
            outerRadius={outerRadius}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div>
        {outerRadius < 40 &&
          data.map((entry, i) => (
            <p key={i} className='flex gap-2 font-medium'>
              <BsCircleFill
                fill={COLORS[i]}
                className='w-3 relative top-[3px]'
              />
              {entry.name}
            </p>
          ))}
      </div>
    </div>
  )
}

export default AllocationChart
