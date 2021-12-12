import { useEffect, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic';
import { ethers } from 'ethers';

import { Tokens } from '../lib/enums'
import { Chains } from '../lib/chains';
import { useAppSelector } from '../state/hooks';

import { approveMGH, getReward, reinvestReward, stakeMGH, unstakeMGH } from '../backend/polygonStaking';
import useStakingContract from '../backend/usePolygonStaking';
import addTokenToWallet from "../backend/addToken"
import useConnectWeb3 from '../backend/connectWeb3';
import changeChain from '../backend/changeChain';

import WalletModal from "../components/WalletModal"
import TransactionModal from '../components/TransactionModal';
import Loader from '../components/Loader';
import StakingPool from '../components/StakingPool';


const EthereumStaking = () => {
    const { web3Provider } = useConnectWeb3()
    const { address, chainId } = useAppSelector(state => state.account)
    const { MGHBalance, allowance, totalStaked, earned, totalSupply, rewardRate, APY, loading } = useStakingContract(web3Provider, address, chainId)

    // const [stakeInput, setStakeInput] = useState("")
    // const [unstakeInput, setUnstakeInput] = useState("")

    const [openModal, setOpenModal] = useState(false)
    const [transactionLoading, setTransactionLoading] = useState(true)
    const [transactionModal, setTransactionModal] = useState(false)
    const [success, setSuccess] = useState(true)
    const [hash, setHash] = useState("")

    // useEffect(() => {
    //     if (!web3Provider) {
    //         setStakeInput("")
    //         setUnstakeInput("")
    //     }
    // }, [web3Provider])

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

    const approve = async () => {
        const transaction = await approveMGH(web3Provider, address)
        await processTransaction(transaction)
    }

    const stake = async (stakeInput: string) => {
        const amount = ethers.utils.parseEther(stakeInput)
        const transaction = await stakeMGH(web3Provider, address, amount)
        await processTransaction(transaction)
    }

    const unstake = async (unstakeInput: string) => {
        const amount = ethers.utils.parseEther(unstakeInput)
        const transaction = await unstakeMGH(web3Provider, address, amount)
        await processTransaction(transaction)
    }

    const claimRewards = async () => {
        const transaction = await getReward(web3Provider, address)
        await processTransaction(transaction)
    }

    const reinvest = async () => {
        const transaction = await reinvestReward(web3Provider, address)
        await processTransaction(transaction)
    }


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

            {loading ? (<Loader />) : (

                <div className="flex flex-col lg:flex-row justify-evenly space-x-0 lg:space-x-5 space-y-5 lg:space-y-0 w-full mt-8 xl:mt-0">

                    <StakingPool id={0} MGHBalance={MGHBalance} totalStaked={totalStaked} stake={stake} unstake={unstake} color="bg-blue-200 bg-opacity-30" />
                    <StakingPool id={1} MGHBalance={MGHBalance} totalStaked={totalStaked} stake={stake} unstake={unstake} color="bg-blue-300 bg-opacity-30" />
                    <StakingPool id={2} MGHBalance={MGHBalance} totalStaked={totalStaked} stake={stake} unstake={unstake} color="bg-blue-400 bg-opacity-30" />
                    <StakingPool id={3} MGHBalance={MGHBalance} totalStaked={totalStaked} stake={stake} unstake={unstake} color="bg-blue-500 bg-opacity-30" />

                </div>
            )}

        </>
    )
}


export default EthereumStaking
