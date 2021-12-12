import { useState } from 'react';
import Head from 'next/head'
import { ethers } from 'ethers';

import { Chains } from '../lib/chains';
import { useAppSelector } from '../state/hooks';
import { stakeMGH, unstakeMGH } from '../backend/ethereumStaking';
import useConnectWeb3 from '../backend/connectWeb3';
import changeChain from '../backend/changeChain';

import WalletModal from "../components/WalletModal"
import TransactionModal from '../components/TransactionModal';
import Loader from '../components/Loader';
import StakingPool from '../components/StakingPool';


const EthereumStaking = () => {
    const { web3Provider } = useConnectWeb3()
    const { address, chainId } = useAppSelector(state => state.account)

    const [openModal, setOpenModal] = useState(false)
    const [transactionLoading, setTransactionLoading] = useState(true)
    const [transactionModal, setTransactionModal] = useState(false)
    const [success, setSuccess] = useState(true)
    const [hash, setHash] = useState("")

    if (!transactionModal && !transactionLoading) {
        setTransactionModal(true)
    }

    const processTransaction = async (transaction: any) => {
        setHash(transaction.hash)
        setTransactionLoading(true)
        setTransactionModal(true)
        try {
            await transaction.wait();
            setSuccess(true)
            setTransactionLoading(false)
        } catch (error: any) {
            console.log(error)
            setHash(error.receipt.transactionHash)
            setSuccess(false)
            setTransactionLoading(false)
        }
    }

    const stake = async (stakeInput: string, poolId: number) => {
        const amount = ethers.utils.parseEther(stakeInput)
        const transaction = await stakeMGH(web3Provider, address, amount, poolId)
        await processTransaction(transaction)
    }

    const unstake = async (unstakeInput: string, maxUnstake: string, poolId: number) => {
        let max;
        unstakeInput === maxUnstake ? max = true : false
        const transaction = await unstakeMGH(web3Provider, address, unstakeInput, poolId, max)
        await processTransaction(transaction)
    }

    const loading = false


    return (
        <>
            <Head>
                <title>MGH - Staking - Ethereum</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>

            {openModal && <WalletModal onDismiss={() => setOpenModal(false)} />}
            {transactionModal && (
                <TransactionModal onDismiss={() => { setTransactionModal(false); !transactionLoading && window.location.reload() }} loading={transactionLoading} success={success} hash={hash} chainId={chainId} />
            )}

            {loading ? (<Loader />) : (<>
                <div className="flex flex-col items-center justify-center w-full">

                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 justify-items-center w-full mt-8 xl:mt-0">

                        <StakingPool poolId={0} web3Provider={web3Provider} stake={stake} unstake={unstake} color="bg-blue-200 bg-opacity-30" />
                        <StakingPool poolId={1} web3Provider={web3Provider} stake={stake} unstake={unstake} color="bg-blue-300 bg-opacity-30" />
                        <StakingPool poolId={2} web3Provider={web3Provider} stake={stake} unstake={unstake} color="bg-blue-400 bg-opacity-30" />
                        <StakingPool poolId={3} web3Provider={web3Provider} stake={stake} unstake={unstake} color="bg-blue-500 bg-opacity-30" />

                    </div>

                    {!web3Provider && (
                        <button onClick={() => setOpenModal(true)} className="mt-10 z-30 disabled:opacity-50 disabled:hover:shadow-dark disabled:cursor-default relative flex justify-center items-center  transition ease-in-out duration-500 shadow-dark rounded-xl w-full max-w-sm py-3 sm:py-4 group">
                            <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80" />
                            <span className="pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl">Connect Wallet</span>
                        </button>
                    )}

                    {web3Provider && chainId !== Chains.ETHEREUM_RINKEBY.chainId && (
                        <button onClick={() => { changeChain(web3Provider.provider, Chains.ETHEREUM_RINKEBY.chainId) }} className="mt-10 z-30 disabled:opacity-50 disabled:hover:shadow-dark disabled:cursor-default relative flex justify-center items-center  transition ease-in-out duration-500 shadow-dark rounded-xl w-full max-w-sm py-3 sm:py-4 group">
                            <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80" />
                            <span className="pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl">Switch to Ethereum</span>v
                        </button>
                    )}

                    {/* {web3Provider && chainId === Chains.ETHEREUM_RINKEBY.chainId && (
                        <button onClick={() => { changeChain(web3Provider.provider, Chains.MATIC_MAINNET.chainId) }} className="z-30 disabled:opacity-50 disabled:hover:shadow-dark disabled:cursor-default mt-4 relative flex justify-center items-center  transition ease-in-out duration-500 shadow-dark rounded-xl w-full max-w-sm py-3 sm:py-4 group">
                            <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80" />
                            <span className="pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl"></span>
                        </button>
                    )} */}
                </div>
            </>

            )}

        </>
    )
}


export default EthereumStaking
