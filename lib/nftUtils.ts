import { BigNumber, ethers } from 'ethers'
import { ERC721, TransferEvent } from '../types/ethers-contracts/ERC721'
import ERC721ABI from '../backend/abi/ERC721.json'
import { Interface } from 'ethers/lib/utils'
import { Contracts } from './contracts'
import { Chains } from './chains'
import { AxieLand } from '../types/ethers-contracts'
type Provider = ethers.providers.BaseProvider

// Using a Generic ERC721 ABI!!
const createNFTContract = (provider: Provider, contractAddress: string) => {
  const contract = new ethers.Contract(
    contractAddress,
    new Interface(ERC721ABI),
    provider
  )
  return contract as ERC721
}

const createAxieLandContract = (
  provider: Provider,
  contractAddress: string
) => {
  const contract = new ethers.Contract(
    contractAddress,
    Contracts.AXIE_LANDS.RONIN_MAINNET.abi,
    provider
  )
  return contract as AxieLand
}

export const getUserNFTs = async (
  provider: Provider,
  address: string,
  contractAddress: string
) => {
  let finalProvider = provider
  let contract: unknown
  // If NFTs are from Axie Infinity connect to Ronin Network
  if (contractAddress === Contracts.AXIE_LANDS.RONIN_MAINNET.address) {
    finalProvider = new ethers.providers.JsonRpcProvider(
      Chains.RONIN_MAINNET.rpcUrl
    )
    const axieContract = createAxieLandContract(finalProvider, contractAddress)
    const owner = await axieContract.ownerOf(
      BigNumber.from(
        '115792089237316195423570985008687907814818077203574517667432170581469777887231'
      )
    )

    const balance = (await axieContract.balanceOf(address)).toString()
    console.log({ balance })
    console.log({ address })
    console.log({ owner })
    const ev = axieContract.filters.AdminChanged()
    const event = await axieContract.queryFilter(ev)
    // const axieTransfer = (await axieContract.queryFilter(ev)) as
    //   | never[]
    //   | TransferEvent[]

    console.log({ event })
    // const res = await fetch(`/api/fetchAxieLands/${address}`)
    return balance
    // const name = await contract.name()
    // console.log({ name })
    // const owner = await contract.ownerOf(
    //   '115792089237316195423570985008687907814818077203574517667432170581469777887231'
    // )
    // const balance = await contract.balanceOf(
    //   '0x0fBcE05c1fa6D3E6434f4a9A874E1F9003b7EdF4'
    // )
    // console.log('Owner: ', owner)
    // console.log('Balance: ', balance)
    // console.log('holaa')
    // return
  } else {
    contract = createNFTContract(finalProvider, contractAddress)
  }
  console.log({ finalProvider })
  // Getting al transfer events that involve the user
  const event = contract.filters.Transfer(undefined, address)

  const transferEvents = (await contract.queryFilter(event)) as
    | never[]
    | TransferEvent[]
  /* Looping through all transfer events and retrieving
    only the tokenId that user currently owns */
  const currentOwners = await Promise.all(
    transferEvents.map(async (event) => {
      const tokenId = ethers.BigNumber.from(
        event?.topics[3] || event?.args._tokenId
      ).toString()
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
