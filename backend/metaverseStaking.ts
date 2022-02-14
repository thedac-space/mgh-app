import { ethers, providers } from 'ethers'

import { Contracts } from '../lib/contracts'
import { IMetaverseStaking } from '../types/ethers-contracts/IMetaverseStaking'
import { SandToken } from '../types/ethers-contracts/SandToken'

const { MV_STAKING, SAND_TOKEN } = Contracts

const MV_STAKING_ABI = MV_STAKING.ETHEREUM_RINKEBY.abi
const MV_STAKING_ADDRESS = MV_STAKING.ETHEREUM_RINKEBY.address

const SAND_TOKEN_ABI = SAND_TOKEN.ETHEREUM_MAINNET.interface
const SAND_TOKEN_ADDRESS = SAND_TOKEN.ETHEREUM_MAINNET.address

type Web3Provider = providers.Web3Provider

// Creating Staking contract
const makeStakingContract = (provider: Web3Provider) => {
  const contract = new ethers.Contract(
    MV_STAKING_ADDRESS,
    MV_STAKING_ABI,
    provider
  ) as IMetaverseStaking
  return contract
}

// Creating Sand Token contract
const makeSandContract = (provider: Web3Provider) => {
  const contract = new ethers.Contract(
    SAND_TOKEN_ADDRESS,
    SAND_TOKEN_ABI,
    provider
  ) as SandToken

  return contract
}

export const getCurrentEpoche = async (provider: Web3Provider) => {
  const contract = makeStakingContract(provider)
  const epocheNumber = await contract.getEpocheNumber()
  return epocheNumber.toNumber()
}

export const isWithdrawPhase = async (provider: Web3Provider) => {
  const contract = makeStakingContract(provider)
  const isWithdrawPhase = await contract.isWithdrawPhase()
  return isWithdrawPhase
}

export const checkMvBalance = async (
  provider: Web3Provider,
  address: string
) => {
  const contract = makeStakingContract(provider)
  const balance = await contract.balanceOf(address)
  return balance.toNumber()
}
// export const stake = async (
//   address: string,
//   amount: number,
//   provider: providers.Web3Provider
// ) => {
//   const contract = makeStakingContract(provider)
//   contract.approveAndCallHandlerDeposit(address, amount)
// }
