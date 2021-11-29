import { NextPage } from "next";
import Head from "next/head";
import { ethers } from "ethers";
import { FormatTypes, Interface } from "@ethersproject/abi";

import changeChain from "../backend/changeChain";
import useConnectWallet from "../backend/connectWallet";
import { useAppSelector } from "../state/hooks";
import HomeCard from "../components/HomeCard";

import stakingAbi from "../backend/stakingAbi.json"


const Home: NextPage = () => {
    const { address, chainId } = useAppSelector(state => state.account)
    const { walletProvider, provider, disconnectWallet } = useConnectWallet();

    const getBalance = async () => {
        if (address) {
            const signer = walletProvider?.getSigner()
            const balance = await signer?.getGasPrice()
            // const price = balance ? utils.formatUnits(balance, "gwei") : undefined
            console.log(balance?.toString())
            return balance
        }
    }

    const ContractInteraction = async () => {
        const signer = walletProvider?.getSigner()
        const contractAddress = "0x72CdE05CC256610083d14AEc8f7c875E5B53331B";
        const iface = new Interface(stakingAbi);
        // console.log(iface.format(FormatTypes.full))

        const contract = new ethers.Contract(
            contractAddress,
            iface,
            signer
        );

        const balance = await contract.balanceOf("0xFca6b83AfBBB0d66A13a06Ec31fA8e27E5188ca8")
        console.log(balance.toString())
        // await contract.getReward()
        // const dai = ethers.utils.parseUnits("1.0", 18);
        // await contract.transfer("0xFca6b83AfBBB0d66A13a06Ec31fA8e27E5188ca8", dai);
    }



    return (
        <>
            <Head>
                <title>MGH - App</title>
                <meta name="description" content="Swap your MGH, become a liquidity provider by staking your tokens and access our data ecosytem." />
            </Head>

            <div className="w-full flex flex-col items-center justify-start space-y-10 max-w-7xl mt-8 xl:mt-0">

                <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-blck rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-blue-400 to-blue-500">Leverage the MetaGameHub<br /> DeFi Ecosystem</h2>
                    <p className={`text-base xs:text-lg xl:text-xl font-medium text-gray-200 pt-0 sm:pt-5`}>Swap your MGH, become a liquidity provider and access our data ecosytem.</p>
                    <p className="text-white mt-5">Chain-ID: {chainId}</p>
                    <p className="text-white">Wallet Address: {address}</p>
                    {chainId !== 1 && <p onClick={() => { provider && changeChain(provider) }} className="text-white cursor-pointer border rounded-xl p-2 my-2">Change to Ethereum Mainnet</p>}
                    {address && <p onClick={disconnectWallet} className="text-white cursor-pointer border rounded-xl p-2">Disconnect</p>}
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 xs:gap-2 sm:gap-5 w-full">
                    <HomeCard image="/images/swap.jpeg" link="/swap" text="Swap your MGH to ETH using Uniswap." />
                    <HomeCard image="/images/liquidity.jpeg" link="/liquidity" text="Provide liquidity to the MGH/ETH Pool." />
                    <HomeCard image="/images/stake.jpeg" link="/stake" text="Stake your Tokens to earn additional rewards." />
                    <HomeCard image="/images/nft-pools.jpeg" link="/pools" text="Stake your NFTs and enter the world of MetaFi." />
                    <HomeCard image="/images/land-valuation.jpeg" link="/valuation" text="Evaluate your metaverse lands and look for undervalued parcels." />
                </div>
            </div>
        </>
    )
};


export default Home;
