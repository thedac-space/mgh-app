import { BigNumber, ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Chains } from '../../../lib/chains'
import { Contracts } from '../../../lib/contracts'
import { AxieLand } from '../../../types/ethers-contracts'
import { TransferEvent } from '../../../types/ethers-contracts/AxieLand'

// Fetch Axie Lands from Wallet
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  type Provider = ethers.providers.BaseProvider
  const ownerWallet = req.query.ownerWallet as string

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

  try {
    console.log('Requested')
    const provider = new ethers.providers.JsonRpcProvider(
      Chains.RONIN_MAINNET.rpcUrl
    )
    const axieContract = createAxieLandContract(
      provider,
      Contracts.AXIE_LANDS.RONIN_MAINNET.address
    )
    const owner = await axieContract.ownerOf(
      BigNumber.from(
        '115792089237316195423570985008687907814818077203574517667432170581469777887231'
      )
    )
    const balance = (await axieContract.balanceOf(ownerWallet)).toString()
    console.log({ balance })
    console.log({ ownerWallet })
    console.log({ owner })
    const ev = axieContract.filters.Transfer(
      undefined,
      undefined,
      BigNumber.from(
        '115792089237316195423570985008687907814818077203574517667432170581469777887231'
      )
    )
    const axieTransfer = (await axieContract.queryFilter(ev)) as
      | never[]
      | TransferEvent[]

    res.json(axieTransfer)
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

    // const data = await response.json()
    // res.status(200).json(data)
  } catch (err) {
    console.log('errored')
    res.status(400).json(err)
  }
}
