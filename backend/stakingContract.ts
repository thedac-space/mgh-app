import { useEffect, useState } from "react"
import useConnectWallet from "./connectWallet"

import { formatEther } from "@ethersproject/units"
import { calcReward, getContractInfo, getMGHAllowance, getMGHBalance } from "./contractInteraction"
import { useAppSelector } from "../state/hooks"
import { ethers } from "ethers"
import { Interface } from "@ethersproject/abi"
import stakingAbi from "./stakingAbi.json"

export default function useStakingContract(walletProvider: ethers.providers.Web3Provider | undefined, address: string | undefined, chainId: number | undefined) {

    // const { address } = useAppSelector(state => state.account)
    // const { walletProvider } = useConnectWallet()

    const [MGHBalance, setMGHBalance] = useState("")
    const [allowance, setAllowance] = useState("")

    const [totalStaked, setTotalStaked] = useState("0")
    const [rewards, setRewards] = useState("0")
    const [totalSupply, setTotalSupply] = useState("0")
    const [APY, setAPY] = useState(0)


    useEffect(() => {
        const setStates = async () => {

            const { totalSupply, APY } = await getContractInfo(walletProvider, chainId)
            setTotalSupply(formatEther(totalSupply))
            setAPY(APY)

            if (walletProvider && address && chainId === 80001) {
                console.log("useEffect")
                const { staked, rewards } = await calcReward(walletProvider, address)
                setTotalStaked(formatEther(staked))
                setRewards(formatEther(rewards))


                const allowance = await getMGHAllowance(walletProvider, address)
                const formattedAllowance = formatEther(allowance)
                setAllowance(formattedAllowance)

                if (+formattedAllowance) {
                    const balance = await getMGHBalance(walletProvider, address)
                    setMGHBalance(formatEther(balance))
                }
            }

        }
        setStates()

    }, [walletProvider, address, chainId])


    return { MGHBalance, allowance, totalStaked, rewards, totalSupply, APY }
}