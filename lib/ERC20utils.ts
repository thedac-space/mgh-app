import { ethers, Signer, BigNumber } from 'ethers'
import { InfuraProvider, Web3Provider } from "@ethersproject/providers";
import { TokenAbiETHMainnet } from '../types/ethers-contracts'
import { Contracts } from './contracts'
type Provider = ethers.providers.BaseProvider

// Using a Generic ERC20 ABI!!
export const createERC20Contract = (
  provider: Provider | Signer,
  contractAddress: string
) => {
  const contract = new ethers.Contract(
    contractAddress,
    Contracts.MGH_TOKEN.ETHEREUM_MAINNET.abi,
    provider
  )
  return contract as TokenAbiETHMainnet
}

export const getAllowanceAndBalanceERC20 = async (
    provider: Web3Provider | InfuraProvider | Provider, 
    tokenAddress: string,
    owner: string,
    spender: string,
) => {
    const rawCalldataBalanceOf = "0x" + "70a08231" + owner.slice(2).padStart(64, "0");
    const rawCalldataAllowance = "0x" + "dd62ed3e" + owner.slice(2).padStart(64, "0") + spender.slice(2).padStart(64, "0");

    return (await Promise.allSettled([
        provider.call({to: tokenAddress, data: rawCalldataAllowance}),
        provider.call({to: tokenAddress, data: rawCalldataBalanceOf})
    ])).map(ret => {
      console.log("in backend: ", {ret})
        if(ret.status === "rejected") return "0"
        else return BigNumber.from(ret.value).toString()
    })
}