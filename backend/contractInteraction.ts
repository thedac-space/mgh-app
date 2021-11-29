import { Interface } from "@ethersproject/abi";
import { BigNumber, ethers, providers } from "ethers";

import tokenAbi from "./tokenAbi.json"
import stakingAbi from "./stakingAbi.json"


const MGHContract = "0xA26fcc9847F24C7D78f4e77Ba39A37B8A9eaFB02"
const MGHContractAbi = new Interface(tokenAbi)

const StakingContract = "0x7d267713502F979ffE3c49622fd0DC24d6D607D0"
const StakingContractAbi = new Interface(stakingAbi)


export const getMGHBalance = async (provider: providers.Web3Provider | undefined, address: string | undefined) => {
    if (!provider || !address) {
        return
    }

    const contract = new ethers.Contract(
        MGHContract,
        MGHContractAbi,
        provider
    );

    const balance = await contract.balanceOf(address)
    return balance
}

export const approveMGH = async (provider: providers.Web3Provider | undefined, address: string | undefined) => {
    if (!provider || !address) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        MGHContract,
        MGHContractAbi,
        signer
    );

    const result = await contract.approve(StakingContract, ethers.constants.MaxUint256)
    return result
}

export const stakeMGH = async (provider: providers.Web3Provider | undefined, address: string | undefined, amount: BigNumber) => {
    if (!provider || !address) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        signer
    );

    const result = await contract.stake(amount)
    return result
}

export const unstakeMGH = async (provider: providers.Web3Provider | undefined, address: string | undefined, amount: BigNumber) => {
    if (!provider || !address) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        signer
    );

    const transaction = await contract.withdraw(amount)
    console.log("transaction", transaction)
    const result = await transaction.wait()
    return result
}

export const calcReward = async (provider: providers.Web3Provider, address: string) => {

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        provider
    );

    const staked = await contract.balanceOf(address)
    const rewards = await contract.earned(address)

    return { staked, rewards }
}

export const getContractInfo = async (provider: providers.Web3Provider | undefined) => {

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        provider ? provider : new ethers.providers.InfuraProvider(80001, "03bfd7b76f3749c8bb9f2c91bdba37f3")
    );

    const totalSupply = await contract.totalSupply()
    const rewardRate = await contract.rewardRate()
    const APY = (+ethers.utils.formatEther(rewardRate)) / (+ethers.utils.formatEther(totalSupply)) * 60 * 60 * 24 * 365

    return { totalSupply, APY }
}

export const getReward = async (provider: providers.Web3Provider | undefined, address: string | undefined) => {
    if (!provider || !address) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        signer
    );

    const transaction = await contract.getReward()
    return transaction
}

export const getMGHAllowance = async (provider: providers.Web3Provider | undefined, address: string | undefined) => {
    if (!provider || !address) {
        return
    }

    const contract = new ethers.Contract(
        MGHContract,
        MGHContractAbi,
        provider
    );

    const result = await contract.allowance(address, StakingContract)
    return result
}

