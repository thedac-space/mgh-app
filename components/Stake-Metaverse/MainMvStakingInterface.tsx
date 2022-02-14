import React, { FormEvent, useEffect, useState } from 'react'
import useConnectWeb3 from '../../backend/connectWeb3'
import { checkMvBalance } from '../../backend/metaverseStaking'
import { useAppSelector } from '../../state/hooks'
import { OptimizedImage } from '../General'

const MainMvStakingInterface = () => {
  const { address } = useAppSelector((state) => state.account)
  const { web3Provider } = useConnectWeb3()
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')

  useEffect(() => {
    // Check if user already staked
    console.log('check if user already staked')
    const setStatus = async () => {
      if (!address || !web3Provider) return

      const balance = await checkMvBalance(web3Provider, address)
      console.log({ balance })
    }
    setStatus()
  }, [])
  const stake = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('stake')
  }
  const approveAndStake = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('approveAndStake')
  }
  const unstake = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('unstake')
  }

  const options = {
    stake: {
      text: 'Stake',
      onClick: stake,
      value: stakeAmount,
      setValue: setStakeAmount,
    },
    approveAndStake: {
      text: 'Approve and Stake',
      onClick: approveAndStake,
      value: stakeAmount,
      setValue: setStakeAmount,
    },
    unstake: {
      text: 'Unstake',
      onClick: unstake,
      value: unstakeAmount,
      setValue: setUnstakeAmount,
    },
  }
  type optionTypes = 'stake' | 'approveAndStake' | 'unstake'
  const optionKeys = Object.keys(options) as optionTypes[]

  return (
    <div className='flex flex-col gap-4 gray-box text-white'>
      <div className='flex w-full justify-between'>
        <OptimizedImage
          width={100}
          height={100}
          src='/images/the-sandbox-sand-logo.png'
        />
        <div>
          <p>EPOCHE: 0</p>
        </div>
      </div>
      {/* APY */}
      <div className='flex w-full justify-between'>
        <span>APY</span>
        <span>125%</span>
      </div>
      {/* Locking Period */}
      <div className='flex w-full justify-between'>
        <span>Locking Period</span>
        <span>1 Month</span>
      </div>
      {/* Staking Options */}
      {optionKeys.map((key) => (
        <form className='' key={key} onSubmit={(e) => options[key].onClick(e)}>
          <input
            type='number'
            className='p-1 text-gray-800 w-full'
            value={options[key].value}
            onChange={(e) => options[key].setValue(e.target.value)}
          />
          <button className='w-full items-center justify-center text-center transition-all flex grow gap-2 ease-in hover:shadow-subtleWhite z-10 p-2 bg-gradient-to-br from-pink-600 to-blue-500'>
            {options[key].text}
          </button>
        </form>
      ))}
    </div>
  )
}

export default MainMvStakingInterface
