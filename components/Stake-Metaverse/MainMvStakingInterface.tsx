import { ethers } from 'ethers'
import Link from 'next/link'
import React, { FormEvent, useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { TransactionModal, WalletModal } from '..'
import changeChain from '../../backend/changeChain'
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
  getUserNFTs,
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
  nfts?: string[]
  isWithdraw?: boolean
  currentStakingAssetBalance?: string
  maxAmount?: string
  rewardsDue?: string
  withdrawableAmount?: string
  hash?: string
}

interface Props {
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>
  refetch: boolean
  mainState: MainMvState
}

type TxState =
  | 'loadingTransaction'
  | 'successTransaction'
  | 'errorTransaction'
  | 'loaded'

const MainMvStakingInterface = ({ refetch, setRefetch, mainState }: Props) => {
  const { address, chainId } = useAppSelector((state) => state.account)
  const { web3Provider } = useConnectWeb3()
  const [stakeAmount, setStakeAmount] = useState('')
  const [approveAndStakeAmount, setApproveAndStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [state, setState] = useState<TxState>()
  const [stateData, setStateData] = useState<StateData>()
  const [walletModal, setWalletModal] = useState(false)
  const signer = web3Provider?.getSigner()
  const wrongNetwork = chainId !== Chains.ETHEREUM_RINKEBY.chainId
  const resetForm = () => {
    setStakeAmount('')
    setApproveAndStakeAmount('')
    setUnstakeAmount('')
  }

  useEffect(() => {
    resetForm()
    // Making all Requests
    const setStatus = async () => {
      const provider =
        !web3Provider || wrongNetwork
          ? new ethers.providers.InfuraProvider(
              Chains.ETHEREUM_RINKEBY.chainId,
              '03bfd7b76f3749c8bb9f2c91bdba37f3'
            )
          : web3Provider

      // Getting Epoche Number
      const epocheNumber = await getEpocheNumber(provider)
      if (!address || wrongNetwork)
        return setStateData({ epocheNumber: epocheNumber })
      // Check if user owns an NFT
      const nftIds = await getUserNFTs(provider, address)
      let nftId: string | undefined
      if (!stateData?.userNftId) {
        nftId = nftIds[0]
      } else {
        nftId = stateData?.userNftId
      }
      // Checking if user has any rewards to their name
      const rawRewardsDue = nftId
        ? Number(await getUpdatedRewardsDue(nftId, provider)).toFixed(2)
        : undefined
      const rewardsDue = Number(rawRewardsDue) >= 1 ? rawRewardsDue : undefined
      // Check if its Withdraw Phase
      const isWithdraw = await isWithdrawPhase(provider)
      // Checking Sand Balance of User
      const balance = ethers.utils.formatEther(
        await checkSandBalance(provider, address)
      )
      // Checking max possible amount to stake
      const maxAmount = await getMaxAmountStaked(provider)
      // Checking amount that user can withdraw from staked tokens
      const withdrawableAmount = nftId
        ? await getWithdrawableAmount(nftId, provider)
        : undefined

      // Setting State
      setStateData({
        epocheNumber: epocheNumber,
        isWithdraw: isWithdraw,
        currentStakingAssetBalance: balance,
        maxAmount: maxAmount,
        rewardsDue: rewardsDue,
        withdrawableAmount: withdrawableAmount,
        nfts: nftIds,
        userNftId: nftId,
      })
    }
    setStatus()
  }, [address, refetch, web3Provider])

  const processTransaction = async (tx: ethers.ContractTransaction) => {
    setStateData({ ...stateData, hash: tx.hash })
    setState('loadingTransaction')
    try {
      await tx.wait()
      setState('successTransaction')
    } catch (error: any) {
      setStateData({ ...stateData, hash: error.receipt.transactionHash })
      setState('errorTransaction')
    }
  }

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
      processTransaction(tx)
    } else {
      // Already has a Staking NFT
      const tx = await increasePosition(
        stateData.userNftId,
        stakeAmount,
        signer!
      )
      processTransaction(tx)
    }
  }

  // Needs to Approve before Staking
  const approveAndStake = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      Number(approveAndStakeAmount) < 0 ||
      Number(stateData?.currentStakingAssetBalance) <
        Number(approveAndStakeAmount) ||
      !address ||
      !signer
    )
      return
    // No Staking NFT and not approved
    console.log('NFT?: ', stateData?.userNftId)
    if (!stateData?.userNftId) {
      const tx = await approveAndCallDeposit(
        address,
        approveAndStakeAmount,
        signer
      )
      processTransaction(tx)
    } else {
      // Has already staked but needs to approve again ??
      const tx = await approveAndCallIncrease(
        address,
        approveAndStakeAmount,
        signer
      )
      processTransaction(tx)
    }
  }

  // Unstaking (can only be done on withdraw phase)
  const unstake = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Checking if user has enough amount to unstake
    if (
      Number(unstakeAmount) < 0 ||
      Number(stateData?.withdrawableAmount) < Number(unstakeAmount)
    )
      return
    // Checking if its withdraw phase
    if (!stateData?.isWithdraw || !signer) return

    const tx = await withdraw(stateData.userNftId!, unstakeAmount, signer)
    processTransaction(tx)
  }

  // Taking MGH rewards for Staking
  const takeRewards = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!stateData?.userNftId || !signer) return
    const tx = await getRewards(stateData?.userNftId, signer)
    processTransaction(tx)
  }

  const handleClick = async () => {
    address
      ? changeChain(web3Provider?.provider, Chains.ETHEREUM_RINKEBY.chainId)
      : setWalletModal(true)
  }

  // Max Amount to stake (doing it here to be a bit cleaner)
  const stakingAssetBalance = parseFloat(
    stateData?.currentStakingAssetBalance!
  ).toFixed(2)
  const maxStakingAmount =
    Number(stakingAssetBalance) > 0 ? stakingAssetBalance : '0'

  // Checking that user is on correct chain
  const correctChain = chainId === Chains.ETHEREUM_RINKEBY.chainId
  // Checking if user has an NFT
  const hasStaked = stateData?.userNftId
  // Form Logic
  const options = {
    stake: {
      title: 'Stake',
      text:
        hasStaked && Number(stateData.withdrawableAmount) > 0
          ? 'Increase $SAND'
          : hasStaked
          ? 'Stake $SAND'
          : 'Approve and Stake',
      onClick: hasStaked ? stake : approveAndStake,
      value: hasStaked ? stakeAmount : approveAndStakeAmount,
      setValue: hasStaked ? setStakeAmount : setApproveAndStakeAmount,
      disabled: !address || !correctChain,
      maxAmount: maxStakingAmount,
    },
    unstake: {
      title: 'Unstake',
      text:
        Number(stateData?.withdrawableAmount) === 0
          ? 'No Withdrawable Amount'
          : stateData?.isWithdraw
          ? 'Unstake $SAND'
          : 'Wait till next withdraw phase',
      onClick: unstake,
      value: unstakeAmount,
      setValue: setUnstakeAmount,
      disabled:
        !stateData?.isWithdraw ||
        Number(stateData?.withdrawableAmount) === 0 ||
        !stateData?.withdrawableAmount ||
        !address ||
        !correctChain,
      maxAmount: stateData?.withdrawableAmount,
    },
    getRewards: {
      title: 'Rewards',
      text: stateData?.rewardsDue
        ? `Get Rewards: ${stateData.rewardsDue} $MGH`
        : 'No Rewards',
      onClick: takeRewards,
      disabled: !stateData?.rewardsDue || !address || !correctChain,
      value: undefined,
      setValue: undefined,
      maxAmount: undefined,
    },
  }
  type optionTypes = 'stake' | 'unstake' | 'getRewards'
  const optionKeys = Object.keys(options) as optionTypes[]

  return (
    <div className='flex flex-col font-medium lg:w-2/4 gap-6 gray-box bg-opacity-10 text-white relative'>
      {/* Wallet Modal */}
      {walletModal && <WalletModal onDismiss={() => setWalletModal(false)} />}
      {/* transaction modal */}
      {state?.includes('Transaction') && (
        <TransactionModal
          onDismiss={() => {
            state !== 'loadingTransaction' && setRefetch(!refetch)
            setState('loaded')
          }}
          loading={state === 'loadingTransaction'}
          success={state === 'successTransaction'}
          hash={stateData?.hash}
          chainId={chainId}
        />
      )}

      {/* Switch to Proper Net / Connect Wallet button */}
      {(!address || wrongNetwork) && (
        <>
          <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 backdrop-blur-sm rounded-xl z-20'></div>
          <button
            onClick={handleClick}
            className='absolute opacity-80 hover:opacity-100 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-30 font-medium text-white px-6 py-4 rounded-xl bg-gradient-to-br transition-all duration-300 from-pink-600 to-blue-500'
          >
            {address ? 'Switch to Rinkeby' : 'Connect Wallet'}
          </button>
        </>
      )}
      {/* Top Level */}
      <div className='flex w-full justify-between'>
        {/* Coin Image */}
        <OptimizedImage
          width={100}
          height={100}
          src='/images/the-sandbox-sand-logo.png'
        />
        {/* Epoche Number & MyNFts Link */}
        <div className='flex flex-col justify-around'>
          {/* Epoche */}
          <p>EPOCHE: {stateData?.epocheNumber}</p>
          {/* My Nfts */}
          {address && (
            <a className='block lg:hidden'>
              <Link href='/mynfts'>
                <span className='flex items-center gap-2 cursor-pointer text-base hover:text-blue-400 transition ease-in-out'>
                  My NFTs <FaArrowRight className='relative bottom-[1px]' />
                </span>
              </Link>
            </a>
          )}{' '}
        </div>
      </div>
      {/* APY and Locking Period Wrapper */}
      <div className='flex flex-col gap-2'>
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
        {/* In case user has more than 1 NFT */}
        {stateData?.nfts && stateData.nfts.length > 1 && (
          <div className='flex w-full justify-between'>
            <span>Select NFT</span>
            <select
              className='bg-transparent text-[0.9rem] tracking-wider font-medium text-right text-gray-200 hover:text-white cursor-pointer transition-all'
              value={stateData.userNftId}
              onChange={(e) => {
                setStateData({ ...stateData, userNftId: e.target.value })
                setRefetch(!refetch)
              }}
            >
              {stateData.nfts.map((nft) => (
                <option key={nft} value={nft}>
                  {nft}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* Staking Options */}
      {optionKeys.map((key) => (
        // Each Option functions as a Form
        <form
          className='relative'
          key={key}
          onSubmit={(e) => options[key].onClick(e)}
        >
          {/* Title with Available Amount  */}
          <div className='flex px-1 items-center w-full mb-1.5'>
            {/* Title */}
            <p
              className={
                (options[key].disabled ? 'text-gray-500' : 'text-gray-300') +
                ' font-medium text-xl flex-grow'
              }
            >
              {options[key].title}
            </p>
            {/* Max Amount */}
            {!options[key].disabled && (
              <p
                onClick={() => options[key].setValue!(options[key].maxAmount!)}
                className='text-gray-400 hover:text-gray-300 cursor-pointer font-medium  transition ease-in-out duration-300'
              >
                Max: {options[key].maxAmount || 0}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-3'>
            {/* Input */}
            {options[key].setValue && (
              <input
                disabled={options[key].disabled}
                value={!options[key].disabled ? options[key].value : ''}
                onChange={(e) => options[key].setValue!(e.target.value)}
                autoComplete='off'
                required
                type='number'
                className='text-right w-full bg-grey-dark border-gray-400 shadow-dark hover:shadow-colorbottom focus:shadow-colorbottom bg-opacity-40 text-gray-200 font-medium text-lg sm:text-xl p-3 sm:p-4 pt-4 sm:pt-5 focus:outline-none border border-opacity-30 disabled:hover:border-opacity-30 hover:border-opacity-80 focus:border-opacity-60 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75 disabled:bg-transparent  disabled:shadow-none'
              />
            )}
            {/* Submit Button */}
            <button
              disabled={options[key].disabled}
              className={` disabled:opacity-30 disabled:hover:shadow-dark disabled:cursor-default flex justify-center items-center border border-pink-600 shadow-dark hover:shadow-button transition ease-in-out duration-500 rounded-xl w-full py-3 sm:py-4`}
            >
              <p className='pt-1 z-10 text-pink-600 font-medium text-lg sm:text-xl'>
                {options[key].text}
              </p>
            </button>
          </div>
        </form>
      ))}
    </div>
  )
}

export default MainMvStakingInterface
