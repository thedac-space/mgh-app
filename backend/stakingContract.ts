import { useEffect, useRef, useState } from "react"
import useConnectWallet from "./connectWallet"

import { formatEther } from "@ethersproject/units"
import { calcReward, getContractInfo, getMGHAllowance, getMGHBalance } from "./contractInteraction"
import { useAppSelector } from "../state/hooks"
import { ethers } from "ethers"
import { Interface } from "@ethersproject/abi"
import stakingAbi from "./stakingAbi.json"

export default function useStakingContract(walletProvider: ethers.providers.Web3Provider | undefined, address: string | undefined, chainId: number | undefined) {

    const [MGHBalance, setMGHBalance] = useState("")
    const [allowance, setAllowance] = useState("")

    const [totalStaked, setTotalStaked] = useState("0")
    const [earned, setEarned] = useState("0")
    const [totalSupply, setTotalSupply] = useState("0")
    const [rewardRate, setRewardRate] = useState("0")
    const [APY, setAPY] = useState(0)

    const [loading, setLoading] = useState(true)


    useEffect(() => { 
        let active = true

        const setStates = async () => {
            let totalSupply = "0"
            let rewardRate = "0"
            let APY = 0
            let totalStaked = "0"
            let earned = "0"
            let allowance = ""
            let balance = "";

            const contractInfo  = await getContractInfo(walletProvider, chainId)
            totalSupply = formatEther(contractInfo.totalSupply)
            rewardRate = formatEther(contractInfo.rewardRate)
            APY = contractInfo.APY

            if (walletProvider && address && chainId === 80001) {
                const reward = await calcReward(walletProvider, address)
                totalStaked = formatEther(reward.staked)
                earned = formatEther(reward.earned)


                allowance = formatEther(await getMGHAllowance(walletProvider, address))

                if (+allowance) {
                    balance = formatEther(await getMGHBalance(walletProvider, address))
                } 
            }

            return { totalSupply, rewardRate, APY, totalStaked, earned, allowance, balance }

        }

        setStates().then(({ totalSupply, rewardRate, APY, totalStaked, earned, allowance, balance }) => {
            if (active) {
                setTotalSupply(totalSupply)
                setRewardRate(rewardRate)
                setAPY(APY)
                setTotalStaked(totalStaked)
                setEarned(earned)
                setAllowance(allowance)
                setMGHBalance(balance)
                setLoading(false)
            }
        })

        return () => { active = false; setLoading(true) }

    }, [walletProvider, address, chainId])


    return { MGHBalance, allowance, totalStaked, earned, totalSupply, rewardRate, APY, loading }
}