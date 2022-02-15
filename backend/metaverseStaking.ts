import { ethers, providers } from 'ethers'

import { Contracts } from '../lib/contracts'
import { IMetaverseStaking } from '../types/ethers-contracts/IMetaverseStaking'
import { SandToken } from '../types/ethers-contracts/SandToken'

const { MV_STAKING, SAND_TOKEN } = Contracts

const MV_STAKING_ABI = MV_STAKING.ETHEREUM_RINKEBY.abi
const MV_STAKING_ADDRESS = MV_STAKING.ETHEREUM_RINKEBY.address

const SAND_TOKEN_ABI = SAND_TOKEN.ETHEREUM_MAINNET.interface
const SAND_TOKEN_ADDRESS = SAND_TOKEN.ETHEREUM_MAINNET.address

const MAX_UINT = 200000000

type Web3Provider = providers.Web3Provider

/* INITIALIZE */

// Creating Staking contract
const createStakingContract = (provider: Web3Provider) => {
  const contract = new ethers.Contract(
    MV_STAKING_ADDRESS,
    MV_STAKING_ABI,
    provider
  ) as IMetaverseStaking
  return contract
}

// Creating Sand Token contract
const createSandContract = (provider: Web3Provider) => {
  const contract = new ethers.Contract(
    SAND_TOKEN_ADDRESS,
    SAND_TOKEN_ABI,
    provider
  ) as SandToken

  return contract
}

/* USER */

// mint a new nft with amount staked tokens
export const deposit = async (amount: number, provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const tx = await contract.deposit(amount)
  await tx.wait()
  return tx
}

//increase the amount of staked tokens of an already existing nft
export const increasePosition = async (
  tokenId: number,
  amount: number,
  provider: Web3Provider
) => {
  const contract = createStakingContract(provider)
  const tx = await contract.increasePosition(tokenId, amount)
  await tx.wait()
  return tx
}

//withdraw from nft
export const withdraw = async (
  tokenId: number,
  amount: number,
  provider: Web3Provider
) => {
  const contract = createStakingContract(provider)
  const tx = await contract.withdraw(tokenId, amount)
  await tx.wait()
  return tx
}

//get MGH rewards for nft
export const getRewards = async (tokenId: number, provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const rewards = await contract.getRewards(tokenId)
  return rewards
}

// Approve and call when user doesn't have a Stake NFT yet
export const approveAndCallDeposit = async (
  address: string,
  amount: number,
  provider: providers.Web3Provider
) => {
  const signature = '0xbd9ae7d1'
  const sandContract = createSandContract(provider)

  // VERSION 1
  const encodedMsg = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256'],
    [address, amount]
  )
  const tx = await sandContract.approveAndCall(
    MV_STAKING_ADDRESS,
    MAX_UINT,
    signature + encodedMsg
  )
  await tx.wait()
  return tx
}

// Approve and call when user already has a Stake NFT
export const approveAndCallIncrease = async (
  address: string,
  amount: number,
  tokenId: number,
  provider: providers.Web3Provider
) => {
  const signature = '0xd24c0de3'
  const sandContract = createSandContract(provider)

  // VERSION 1
  const encodedMsg = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256', 'uint256'],
    [address, tokenId, amount]
  )
  const tx = await sandContract.approveAndCall(
    MV_STAKING_ADDRESS,
    MAX_UINT,
    signature + encodedMsg
  )
  await tx.wait()
  return tx
}

/* VIEWS */

// total amount of tokens staked
export const getTotalAmountStaked = async (provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const totalAmount = await contract.getTotalAmountStaked()
  return totalAmount.toNumber()
}

// mgh rewards in token per (staking)-token and second
export const getRewardsRate = async (provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const rewardsRate = await contract.getRewardRate()
  return rewardsRate
}

// returns current epoche. Increments when the withdraw phase ends
export const getEpocheNumber = async (provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const epocheNumber = await contract.getEpocheNumber()
  return epocheNumber.toNumber()
}

// returns wether withdraws are currently open
export const isWithdrawPhase = async (provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const isWithdrawPhase = await contract.isWithdrawPhase()
  return isWithdrawPhase
}

// View Stats of an NFT
export const viewNftStats = async (tokenId: number, provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const stats = await contract.viewNftStats(tokenId)
  const formattedStats = {
    amountStaked: stats.amountStaked.toNumber(),
    lastTimeRewardsUpdate: stats.lastTimeRewardsUpdate,
    rewardsDue: stats.rewardsDue.toNumber(),
    hasWithdrawnInEpoche: stats.hasWithdrawnInEpoche,
  }

  return formattedStats
}

// returns the actual amount of mgh rewards claimable right now for an nft
export const getUpdatedRewardsDue = async (
  tokenId: number,
  provider: Web3Provider
) => {
  const contract = createStakingContract(provider)
  const updatedRewards = await contract.getUpdatedRewardsDue(tokenId)
  return updatedRewards.toNumber()
}

// returns the amount of staked tokens that can be withdrawn now or in the next withdraw phase
// if nothing from the nft can be withdrawn this withdraw phase, reverts with error message.
export const getWithdrawableAmount = async (
  tokenId: number,
  provider: Web3Provider
) => {
  const contract = createStakingContract(provider)
  const amount = await contract.getWithdrawableAmount(tokenId)
  return amount.toNumber()
}
