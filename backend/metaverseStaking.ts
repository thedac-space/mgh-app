import { ethers, providers } from 'ethers'
import { Chains } from '../lib/chains'
import { Contracts } from '../lib/contracts'
import { Metaverse } from '../lib/enums'
import { ICoinPrices } from '../lib/valuation/valuationTypes'
import { formatLandAsset } from '../lib/valuation/valuationUtils'
import { Wallets } from '../lib/wallets'
import {
  DepositEvent,
  IMetaverseStaking,
  TransferEvent,
} from '../types/ethers-contracts/IMetaverseStaking'
import { SandToken } from '../types/ethers-contracts/SandToken'

const { MV_STAKING, SAND_TOKEN } = Contracts

const MV_STAKING_ABI = MV_STAKING.ETHEREUM_RINKEBY.abi
const MV_STAKING_ADDRESS = MV_STAKING.ETHEREUM_RINKEBY.address

const SAND_TOKEN_ABI = SAND_TOKEN.MOCK_RINKEBY.abi
const SAND_TOKEN_ADDRESS = SAND_TOKEN.MOCK_RINKEBY.address

const MAX_UINT = ethers.constants.MaxUint256
const { formatEther, parseEther } = ethers.utils

type Web3Provider = providers.BaseProvider
type Signer = ethers.Signer

/* INITIALIZE */

// Creating Staking contract
const createStakingContract = (providerOrSigner: Web3Provider | Signer) => {
  const contract = new ethers.Contract(
    MV_STAKING_ADDRESS,
    MV_STAKING_ABI,
    providerOrSigner
  ) as IMetaverseStaking

  return contract
}

// Creating Sand Token contract
const createSandContract = (providerOrSigner: Web3Provider | Signer) => {
  const contract = new ethers.Contract(
    SAND_TOKEN_ADDRESS,
    SAND_TOKEN_ABI,
    providerOrSigner
  ) as SandToken

  return contract
}

/* USER */

// mint a new nft with amount staked tokens
export const deposit = async (amount: string, signer: Signer) => {
  const bigNumAmount = parseEther(amount)
  // Token Id as Time from the frontend
  const tokenId = Date.now()
  const contract = createStakingContract(signer)
  const tx = await contract.deposit(tokenId, bigNumAmount)
  return tx
}

//increase the amount of staked tokens of an already existing nft
export const increasePosition = async (
  tokenId: string,
  amount: string,
  signer: Signer
) => {
  const bigNumAmount = parseEther(amount)
  const contract = createStakingContract(signer)
  const tx = await contract.increasePosition(tokenId, bigNumAmount)
  return tx
}

//withdraw staked amount from nft
export const withdraw = async (
  tokenId: string,
  amount: string,
  signer: Signer
) => {
  const bigNumAmount = parseEther(amount)
  const contract = createStakingContract(signer)
  const tx = await contract.withdraw(tokenId, bigNumAmount)
  return tx
}

//Withdraw only the MGH rewards for nft
export const getRewards = async (tokenId: string, signer: Signer) => {
  const contract = createStakingContract(signer)
  const tx = await contract.getRewards(tokenId)
  return tx
}

// Approve and call when user doesn't have a Stake NFT yet
export const approveAndCallDeposit = async (
  address: string,
  amount: string,
  signer: Signer
) => {
  const bigNumAmount = parseEther(amount)
  // TokenId from Date to save gas
  const tokenId = Date.now().toString()
  // Signature of function to call
  const signature = ethers.utils
    .id('approveAndCallHandlerDeposit(address,uint256,uint256)')
    .slice(0, 10)

  const sandContract = createSandContract(signer)
  const abiCoder = new ethers.utils.AbiCoder()
  const encodedMsg = abiCoder.encode(
    ['address', 'uint256', 'uint256'],
    [address, tokenId, bigNumAmount]
  )
  const tx = await sandContract.approveAndCall(
    MV_STAKING_ADDRESS,
    MAX_UINT,
    signature + encodedMsg.slice(2)
  )
  return tx
}

// Approve and call when user already has a Stake NFT
export const approveAndCallIncrease = async (
  address: string,
  amount: string,
  signer: Signer
) => {
  // TokenId from Date to save gas
  const tokenId = Date.now()
  const bigNumAmount = parseEther(amount)
  // Signature of function to call
  const signature = ethers.utils
    .id('approveAndCallHandlerIncrease(address,uint256,uint256)')
    .slice(0, 10)
  const sandContract = createSandContract(signer)

  const abiCoder = new ethers.utils.AbiCoder()

  const encodedMsg = abiCoder.encode(
    ['address', 'uint256', 'uint256'],
    [address, tokenId, bigNumAmount]
  )
  const tx = await sandContract.approveAndCall(
    MV_STAKING_ADDRESS,
    MAX_UINT,
    signature + encodedMsg.slice(2)
  )
  return tx
}

/* VIEWS */

// total amount of tokens staked
export const getTotalAmountStaked = async (provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const totalAmount = await contract.getTotalAmountStaked()
  return totalAmount
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
  return epocheNumber.toString()
}

// Returns Current Epoche Data
export const getCurrentEpoche = async (provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const bigNumEpoche = await contract.currentEpoche()
  const formattedEpoche = {
    start: new Date(bigNumEpoche.start.toNumber() * 1000).toUTCString(),
    end: new Date(bigNumEpoche.end.toNumber() * 1000).toUTCString(),
    lastEnd: new Date(bigNumEpoche.lastEnd.toNumber() * 1000).toUTCString(),
  }
  const startDate = new Date(bigNumEpoche.start.toNumber() * 1000)
  const nextEpocheStart =
    startDate > new Date(Date.now())
      ? startDate.toUTCString()
      : 'Next Epoche will be Initiated Soon'
  return { formattedEpoche, nextEpocheStart }
}

// Get Maximum amount that can be staked
export const getMaxAmountStaked = async (provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const maxAmount = await contract.getMaximumAmountStaked()
  return formatEther(maxAmount)
}

// returns wether withdraws are currently open
export const isWithdrawPhase = async (provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const isWithdrawPhase = await contract.isWithdrawPhase()
  return isWithdrawPhase
}

// View Stats of an NFT
export const viewNftStats = async (tokenId: string, provider: Web3Provider) => {
  const contract = createStakingContract(provider)
  const stats = await contract.viewNftStats(tokenId)
  const formattedStats = {
    amountStaked: formatEther(stats.amountStaked),
    lastTimeRewardsUpdate: stats.lastTimeRewardsUpdate,
    rewardsDue: formatEther(stats.rewardsDue),
    hasWithdrawnInEpoche: stats.hasWithdrawnInEpoche,
    coin: 'SAND',
  }

  return formattedStats
}

// returns the actual amount of mgh rewards claimable right now for an nft
export const getUpdatedRewardsDue = async (
  tokenId: string,
  provider: Web3Provider
) => {
  const contract = createStakingContract(provider)
  const updatedRewards = await contract.getUpdatedRewardsDue(tokenId)
  return formatEther(updatedRewards)
}

// returns the amount of staked tokens that can be withdrawn now or in the next withdraw phase
// if nothing from the nft can be withdrawn this withdraw phase, reverts with error message.
export const getWithdrawableAmount = async (
  tokenId: string,
  provider: Web3Provider
) => {
  const contract = createStakingContract(provider)
  const amount = await contract.getWithdrawableAmount(tokenId)
  return formatEther(amount)
}

// Check Balance of Sand Coins
export const checkSandBalance = async (
  provider: Web3Provider,
  address: string
) => {
  const contract = createSandContract(provider)
  const balance = await contract.balanceOf(address)
  return balance
}

/* EVENTS */

// Check if user has already deposited/minted an NFT...will expand this to allow all metaverses
export const getTokenIdFromDeposit = async (
  provider: Web3Provider,
  address: string
) => {
  const contract = createStakingContract(provider)
  const event = contract.filters.Deposit(null, address)
  const depositEvent = (await contract.queryFilter(event)) as
    | undefined[]
    | DepositEvent[]

  /* Doing this loop in the rare case that user deposited, then sold nft,
   then deposited again etc... */
  const [filteredId] = await Promise.all(
    depositEvent.map(async (event) => {
      const tokenId = event?.args.tokenId.toString()
      const ownerAddress = tokenId && (await contract.ownerOf(tokenId))
      if (ownerAddress === address) return tokenId
    })
  )
  return filteredId
}

export const getUserNFTs = async (provider: Web3Provider, address: string) => {
  const contract = createStakingContract(provider)
  // Getting al transfer events that involve the user
  const event = contract.filters.Transfer(undefined, address)
  const transferEvents = (await contract.queryFilter(event)) as
    | undefined[]
    | TransferEvent[]

  /* Looping through all transfer events and retrieving
    only the tokenId that user currently owns */

  // getting all async promises
  const currentOwners = await Promise.all(
    transferEvents.map(async (event) => {
      const tokenId = event?.args.tokenId.toString()
      const ownerAddress = tokenId && (await contract.ownerOf(tokenId))
      return { ownerAddress, tokenId }
    })
  )

  // Filtering promises
  let filteredIds: string[] = []
  for (let nft of currentOwners) {
    if (
      nft.ownerAddress === address &&
      nft.tokenId &&
      !filteredIds.includes(nft.tokenId)
    ) {
      filteredIds.push(nft.tokenId)
    }
  }
  return filteredIds
}

export const transferNFT = async (signer: Signer, address: string) => {
  const contract = createStakingContract(signer)
  const tx = await contract.transferFrom(
    address,
    '0x7812B090d1a3Ead77B5D8F470D3faCA900A6ccB9',
    '1646231188132'
  )
  await tx.wait()
}

/* TVL */
export const getTVL = async (provider: Web3Provider) => {
  const coin = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox%2Cdecentraland&vs_currencies=usd'
  )
  const prices: ICoinPrices = await coin.json()

  /* Mainnet*/
  const mainnetProvider = new ethers.providers.InfuraProvider(
    Chains.ETHEREUM_MAINNET.chainId,
    '03bfd7b76f3749c8bb9f2c91bdba37f3'
  )
  const contract = new ethers.Contract(
    Contracts.SAND_TOKEN.ETHEREUM_MAINNET.address,
    SAND_TOKEN_ABI,
    mainnetProvider
  ) as SandToken

  const botSandBalance = Number(
    formatEther(await contract.balanceOf(Wallets.BOT))
  )

  /* */
  const totalAmountStaked = Number(
    formatEther(await getTotalAmountStaked(provider))
  )

  console.log({ totalAmountStaked })
  let totalLandsWorthSand = 0
  const res = await fetch(
    `/api/fetchAssets/${Wallets.BOT}/${Contracts.LAND.ETHEREUM_MAINNET.newAddress}`
  )

  const rawAssets = await res.json()
  // Getting money
  rawAssets?.assets?.length > 0 &&
    (await Promise.all(
      rawAssets.assets.map(async (asset: any) => {
        const formattedAsset = await formatLandAsset(
          asset.token_id,
          prices,
          Metaverse.SANDBOX
        )

        // Adding the worth of each asset into the totalWorth
        totalLandsWorthSand += formattedAsset.predictions!.sandPrediction!
      })
    ))

  const landsWorth = totalLandsWorthSand

  const tvl = totalAmountStaked + landsWorth + botSandBalance

  return { tvl, totalAmountStaked, landsWorth, botSandBalance }
}
