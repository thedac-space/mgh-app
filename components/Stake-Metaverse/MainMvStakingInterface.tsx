import { ethers } from 'ethers'
import React, { FormEvent, useEffect, useState } from 'react'
import useConnectWeb3 from '../../backend/connectWeb3'
import {
  approveAndCallDeposit,
  approveAndCallIncrease,
  checkSandBalance,
  deposit,
  getEpocheNumber,
  getMaxAmountStaked,
  getRewards,
  getUpdatedRewardsDue,
  getUserDepositEvents,
  getWithdrawableAmount,
  increasePosition,
  isWithdrawPhase,
  withdraw,
} from '../../backend/metaverseStaking'
import { Chains } from '../../lib/chains'
import { MainMvState } from '../../lib/stake-metaverse/types'
import { useAppSelector } from '../../state/hooks'
import { OptimizedImage } from '../General'
interface StateData {
  epocheNumber?: string
  userNftId?: string
  isWithdraw?: boolean
  currentStakingAssetBalance?: string
  maxAmount?: string
  rewardsDue?: string
  withdrawableAmount?: string
}

interface Props {
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>
  refetch: boolean
  mainState: MainMvState
}

const MainMvStakingInterface = ({ refetch, setRefetch, mainState }: Props) => {
  const { address, chainId } = useAppSelector((state) => state.account)
  const { web3Provider } = useConnectWeb3()
  const [stakeAmount, setStakeAmount] = useState('')
  const [approveAndStakeAmount, setApproveAndStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [stateData, setStateData] = useState<StateData>()
  const signer = web3Provider?.getSigner()

  const resetForm = () => {
    setStakeAmount('')
    setApproveAndStakeAmount('')
    setUnstakeAmount('')
  }

  useEffect(() => {
    resetForm()
    // Making all Requests
    const setStatus = async () => {
      if (!address) return

      const provider =
        !web3Provider || chainId !== Chains.ETHEREUM_RINKEBY.chainId
          ? new ethers.providers.InfuraProvider(
              Chains.ETHEREUM_RINKEBY.chainId,
              '03bfd7b76f3749c8bb9f2c91bdba37f3'
            )
          : web3Provider
      // Getting Epoche Number
      const epocheNumber = await getEpocheNumber(provider)
      // Check if user already staked
      const [event] = await getUserDepositEvents(provider, address)
      // set Nft Id for user
      const nftId = event?.args.tokenId.toString()
      // Check if its Withdraw Phase
      const isWithdraw = await isWithdrawPhase(provider)
      // Checking Sand Balance of User
      const sandBalance = await checkSandBalance(provider, address)
      const balance = ethers.utils.formatEther(sandBalance)
      // Checking max possible amount to stake
      const maxAmount = await getMaxAmountStaked(provider)
      // Checking if user has any rewards to their name
      const rawRewardsDue = nftId
        ? Number(
            ethers.utils.formatEther(
              await getUpdatedRewardsDue(nftId, provider)
            )
          ).toFixed(2)
        : undefined
      const rewardsDue = Number(rawRewardsDue) >= 1 ? rawRewardsDue : undefined
      // Checking amount that user can withdraw from staked tokens
      const withdrawableAmount = nftId
        ? await getWithdrawableAmount(nftId, provider)
        : undefined

      // Setting State
      setStateData({
        epocheNumber: epocheNumber,
        userNftId: nftId,
        isWithdraw: isWithdraw,
        currentStakingAssetBalance: balance,
        maxAmount: maxAmount,
        rewardsDue: rewardsDue,
        withdrawableAmount: withdrawableAmount,
      })
    }
    setStatus()
  }, [address, refetch, web3Provider])

  //Staking if Already Approved
  const stake = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (Number(stakeAmount) < 0) return
    if (Number(stakeAmount) > Number(stateData?.currentStakingAssetBalance!)) {
      return console.log('too much')
    }
    if (stakeAmount > stateData?.currentStakingAssetBalance!) return
    // No Staking NFT yet..
    if (!stateData?.userNftId) {
      const tx = await deposit(stakeAmount, signer!)
      console.log(`Deposit ${stakeAmount}`, tx)
    } else {
      // Already has a Staking NFT
      const tx = await increasePosition(
        stateData.userNftId,
        stakeAmount,
        signer!
      )
      console.log(`IncreasePosition ${stakeAmount}`, tx)
    }
    setRefetch(!refetch)
  }

  // Needs to Approve before Staking
  const approveAndStake = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (Number(approveAndStakeAmount) < 0) return
    // No Staking NFT and not approved
    console.log('IS ThERE NFT?: ', stateData?.userNftId)
    if (!stateData?.userNftId) {
      const tx = await approveAndCallDeposit(
        address!,
        approveAndStakeAmount,
        signer!
      )
      console.log(`ApproveAndCallDeposit: ${approveAndStakeAmount}`, tx)
    } else {
      // Has already staked but needs to approve again ??
      const tx = await approveAndCallIncrease(
        address!,
        approveAndStakeAmount,
        stateData.userNftId,
        signer!
      )
      console.log(`ApproveAndCallIncrease${approveAndStakeAmount}`, tx)
    }
    setRefetch(!refetch)
  }

  // Unstaking (can only be done on withdraw phase)
  const unstake = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      Number(unstakeAmount) < 0 ||
      Number(stateData?.withdrawableAmount) < Number(unstakeAmount)
    )
      return
    // Checking if its withdraw phase
    if (!stateData?.isWithdraw || !signer) return

    await withdraw(stateData.userNftId!, unstakeAmount, signer)
    console.log('unstake')
    setRefetch(!refetch)
  }

  // Taking MGH rewards for Staking
  const takeRewards = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!stateData?.userNftId || !signer) return
    await getRewards(stateData?.userNftId, signer)
    setRefetch(!refetch)
  }

  // Form Logic
  const options = {
    stake: {
      text: stateData?.userNftId ? 'Increase Position' : 'Stake',
      onClick: stake,
      value: stakeAmount,
      setValue: setStakeAmount,
      disabled: !stateData?.userNftId || !address,
      maxAmount: parseFloat(stateData?.currentStakingAssetBalance!).toFixed(2),
    },
    approveAndStake: {
      text: stateData?.userNftId ? 'Approve and Increase' : 'Approve and Stake',
      onClick: approveAndStake,
      value: approveAndStakeAmount,
      setValue: setApproveAndStakeAmount,
      disabled: !!stateData?.userNftId || !address,
      maxAmount: parseFloat(stateData?.currentStakingAssetBalance!).toFixed(2),
    },
    unstake: {
      text:
        Number(stateData?.withdrawableAmount) === 0
          ? 'No Withdrawable Amount'
          : stateData?.isWithdraw
          ? 'Unstake'
          : 'Wait till next withdraw phase',
      onClick: unstake,
      value: unstakeAmount,
      setValue: setUnstakeAmount,
      disabled:
        !stateData?.isWithdraw ||
        Number(stateData?.withdrawableAmount) === 0 ||
        !stateData?.withdrawableAmount ||
        !address,
      maxAmount: stateData?.withdrawableAmount,
    },
    getRewards: {
      text: stateData?.rewardsDue
        ? `Get Rewards: ${stateData.rewardsDue} $MGH`
        : 'No Rewards',
      onClick: takeRewards,
      disabled: !stateData?.rewardsDue || !address,
    },
  }
  const eee = stateData?.withdrawableAmount
  console.log({ eee })
  type optionTypes = 'stake' | 'approveAndStake' | 'unstake'
  const optionKeys = Object.keys(options) as optionTypes[]

  return (
    <div className='flex flex-col md:w-2/4 gap-6 gray-box bg-opacity-10 text-white'>
      {/* Top Level */}
      <div className='flex w-full justify-between'>
        {/* Coin Image */}
        <OptimizedImage
          width={100}
          height={100}
          src='/images/the-sandbox-sand-logo.png'
        />
        {/* Epoche Number */}
        <div>
          <p>EPOCHE: {stateData?.epocheNumber}</p>
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
      {/* Available Amount  */}
      {/* <div className='flex w-full justify-between'>
        <span>Available Amount</span>
        <span>
          {parseFloat(stateData?.currentStakingAssetBalance!).toFixed(2)}$SAND
        </span>
      </div> */}
      {/* Staking Options */}
      {optionKeys.map((key) => (
        // Each Option functions as a Form
        <form
          className='relative'
          key={key}
          onSubmit={(e) => options[key].onClick(e)}
        >
          {/* Span showing Max amount to Stake/Unstake */}
          {!options[key].disabled && options[key].maxAmount && (
            <span
              className={
                'text-xs font-medium absolute top-2 right-2 ' +
                (Number(options[key].maxAmount) > Number(options[key].value)
                  ? 'text-gray-500'
                  : 'text-red-500')
              }
            >
              Max: {options[key].maxAmount} $SAND
            </span>
          )}
          {/* Input */}
          {options[key].setValue && (
            <input
              required
              disabled={options[key].disabled}
              type='number'
              className='p-1 text-gray-800 w-full'
              value={!options[key].disabled ? options[key].value : ''}
              onChange={(e) => options[key].setValue(e.target.value)}
            />
          )}
          {/* Submit Button */}
          <button
            disabled={options[key].disabled}
            className='w-full items-center justify-center text-center transition-all flex grow gap-2 ease-in hover:shadow-subtleWhite z-10 p-2 font-medium text-gray-200 disabled:bg-gray-500 disabled:text-gray-800 bg-[#8884d8]'
          >
            {options[key].text}
          </button>
        </form>
      ))}
    </div>
  )
}

export default MainMvStakingInterface
