import { NextPage } from 'next'
import React, { useState } from 'react'
import { Pie, PieChart } from 'recharts'
import useConnectWeb3 from '../backend/connectWeb3'
import { MainMvStakingInterface } from '../components/Stake-Metaverse'
import MvInfoTable from '../components/Stake-Metaverse/MvInfoTable'
import { useAppSelector } from '../state/hooks'

const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
]

const MetaverseStaking: NextPage = () => {
  const [nextWithdrawalPhase, setNextWithdrawalPhase] = useState(10)
  const { web3Provider } = useConnectWeb3()
  const { address, chainId } = useAppSelector((state) => state.account)
  const date = new Date('2015-03-25')

  return (
    // Remove Text class later..
    <section className='text-gray-400'>
      <h1 className=' green-text-gradient'>Metaverse Staking</h1>
      <h4 className='border-none'>
        Next Withdrawal Phase {nextWithdrawalPhase}
      </h4>
      <h4 className='border-none'>Next Epoche Start {date.toDateString()}</h4>
      {/* Top Tools */}
      <div className='flex w-full justify-between gap-4 mb-4'>
        {/* Main Interface */}
        <MainMvStakingInterface />
        {/* Charts */}
        <div className='w-full flex-col flex gap-4'>
          <div className='gray-box'>
            <p>Allocation</p>
            <PieChart width={200} height={200}>
              <Pie
                data={data01}
                dataKey='value'
                // cx='50%'
                // cy='50%'
                // outerRadius={60}
                fill='#8884d8'
              />
            </PieChart>
          </div>
          <div className='gray-box'>
            <p>High Rolla</p>
            <PieChart width={200} height={200}>
              <Pie
                data={data01}
                dataKey='value'
                // cx='50%'
                // cy='50%'
                // outerRadius={60}
                fill='#8884d8'
              />
            </PieChart>
          </div>
        </div>
        {/* TVL */}
        <div className='w-full'>
          <div className='gray-box h-full'>TVL</div>
        </div>
      </div>
      {/* Table */}
      <MvInfoTable />
    </section>
  )
}

export default MetaverseStaking
