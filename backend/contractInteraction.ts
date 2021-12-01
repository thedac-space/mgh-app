import { BigNumber, ethers, providers } from "ethers";

import { Contracts } from "../lib/contracts";


const MGHContract = Contracts.MGH_TOKEN.MATIC_TESTNET.address
const MGHContractAbi = Contracts.MGH_TOKEN.MATIC_TESTNET.abi

const StakingContract = Contracts.MGH_STAKING.MATIC_TESTNET.address
const StakingContractAbi = Contracts.MGH_STAKING.MATIC_TESTNET.abi


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

    const transaction = await contract.stake(amount)
    return transaction
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
    return transaction
}

export const calcReward = async (provider: providers.Web3Provider, address: string) => {

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        provider
    );

    const staked = await contract.balanceOf(address)
    const earned = await contract.earned(address)

    return { staked, earned }
}

export const getContractInfo = async (provider: providers.Web3Provider | undefined, chainId: number | undefined) => {

    let contractProvider;
    if (!provider || chainId !== 80001) {
        contractProvider = new ethers.providers.InfuraProvider(80001, "03bfd7b76f3749c8bb9f2c91bdba37f3")
    } else {
        contractProvider = provider
    }

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        contractProvider
    );

    const totalSupply = await contract.totalSupply()
    const rewardRate = await contract.rewardRate()
    const APY = ((+ethers.utils.formatEther(rewardRate)) / (+ethers.utils.formatEther(totalSupply))*100) * 60 * 60 * 24 * 365

    return { totalSupply, rewardRate, APY }
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

export const reinvestReward = async (provider: providers.Web3Provider | undefined, address: string | undefined) => {
    if (!provider || !address) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        signer
    );

    const transaction = await contract.compound()
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

