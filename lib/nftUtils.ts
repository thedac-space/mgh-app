import { ethers } from 'ethers'
import { ERC721, TransferEvent } from '../types/ethers-contracts/ERC721'
import ERC721ABI from '../backend/abi/ERC721.json'
import { Interface } from 'ethers/lib/utils'
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

export const getUserNFTs = async (
  provider: Provider,
  address: string,
  contractAddress: string
) => {
  const contract = createNFTContract(provider, contractAddress)
  // Getting al transfer events that involve the user
  const event = contract.filters.Transfer(undefined, address)
  const transferEvents = (await contract.queryFilter(event)) as
    | never[]
    | TransferEvent[]

  /* Looping through all transfer events and retrieving
    only the tokenId that user currently owns */
  const currentOwners = await Promise.all(
    transferEvents.map(async (event) => {
      const tokenId = ethers.BigNumber.from(event?.topics[3]).toString()
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
export const getNftTransfersAmount = async (
  provider: Provider,
  contractAddress: string,
  tokenId: string
) => {
  const contract = createNFTContract(provider, contractAddress)
  const event = contract.filters.Transfer(
    undefined,
    undefined,
    ethers.BigNumber.from(tokenId)
  )
  const transfers = await contract.queryFilter(event)
  return transfers.length
}
