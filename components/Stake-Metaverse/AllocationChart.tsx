import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
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

  let renderLabel = function (entry: any /* Pie Data Object */) {
    return `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`
  }
  return (
    <>
      <h3 className='text-xl text-gray-300'>TVL Allocation</h3>

      <ResponsiveContainer width='100%' height='80%'>
        <PieChart className='mx-auto'>
          <Pie
            data={data}
            dataKey='value'
            label={renderLabel}
            cx='50%'
            cy='50%'
            outerRadius={70}
            fill='#8884d8'
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </>
  )
}

export default AllocationChart
