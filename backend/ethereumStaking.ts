import { BigNumber, ethers, providers } from "ethers";

import { Chains } from "../lib/chains";
import { Contracts } from "../lib/contracts";


const MGHContract = Contracts.MGH_TOKEN.ETHEREUM_RINKEBY.address
const MGHContractAbi = Contracts.MGH_TOKEN.ETHEREUM_RINKEBY.abi

const StakingContract = Contracts.MGH_STAKING.ETHEREUM_RINKEBY.address
const StakingContractAbi = Contracts.MGH_STAKING.ETHEREUM_RINKEBY.abi


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

export const getStakeAmount = async (provider: providers.Web3Provider | undefined, address: string | undefined, poolId: number, isTransferPhase: boolean) => {
    if (!provider || !address) {
        return
    }

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        provider
    );

    let staked;
    if (isTransferPhase) {
        staked = await contract.viewUserTokenAmount(address, poolId)
    } else {
        staked = await contract.getUserTokenAmountAfter(address, poolId)
    }

    return staked
}

export const getPeriodInfo = async (poolId: number) => {

    const provider = new ethers.providers.InfuraProvider(Chains.ETHEREUM_RINKEBY.chainId, "03bfd7b76f3749c8bb9f2c91bdba37f3")

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        provider
    );

    const isTransferPhase = await contract.isTransferPhase(poolId)
    const result = await contract.getPoolInfo(poolId)
    const startOfDeposit = result[1][3].toNumber()
    // const [isTransferPhase, startOfDeposit] = await contract.getDepositInfo(poolId)
    return { isTransferPhase, startOfDeposit }
}

export const stakeMGH = async (provider: providers.Web3Provider | undefined, address: string | undefined, amount: BigNumber, poolId: number) => {
    if (!provider || !address) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        MGHContract,
        MGHContractAbi,
        signer
    );

    const transaction = await contract.approveAndCall(StakingContract, amount, poolId)
    return transaction
}

export const unstakeMGH = async (provider: providers.Web3Provider | undefined, address: string | undefined, unstakeInput: string, poolId: number, max: boolean | undefined) => {
    if (!provider || !address) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        StakingContract,
        StakingContractAbi,
        signer
    );

    let amount;
    if (max) {
        amount = await contract.viewUserShares(address, poolId)
    } else {
        amount = await contract.tokenToShares(ethers.utils.parseEther(unstakeInput), poolId)
    }

    const transaction = await contract.withdraw(amount, poolId)
    return transaction
}

