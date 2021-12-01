import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic';

import TokenInput from '../components/TokenInput'
import TransactionModal from '../components/TransactionModal';
import { Tokens } from '../lib/enums'
import { approveMGH, calcReward, getMGHAllowance, getMGHBalance, getReward, stakeMGH, unstakeMGH } from '../backend/contractInteraction';
import useConnectWallet from '../backend/connectWallet';
import { useAppSelector } from '../state/hooks';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import useStakingContract from '../backend/stakingContract';
import WalletModal from "../components/WalletModal"
import switchNetworkMumbai from '../backend/changeChain';

const Bridge = dynamic(import('../components/Bridge'), { ssr: false });


const Stake: NextPage = () => {
    const { address, chainId } = useAppSelector(state => state.account)
    const { walletProvider } = useConnectWallet()
    const { MGHBalance, allowance, totalStaked, earned, totalSupply, rewardRate, APY, loading } = useStakingContract(walletProvider, address, chainId)

    const [stakeInput, setStakeInput] = useState("")
    const [unstakeInput, setUnstakeInput] = useState("")

    const [openModal, setOpenModal] = useState(false)
    const [transactionLoading, setTransactionLoading] = useState(true)
    const [transactionModal, setTransactionModal] = useState(false)
    const [success, setSuccess] = useState(true)
    const [hash, setHash] = useState("")

    useEffect(() => {
        if (!walletProvider) {
            setStakeInput("")
            setUnstakeInput("")
        }
    }, [walletProvider])

    if (!transactionModal && !transactionLoading) {
        window.location.reload()
    }


    const approve = async () => {
        const transaction = await approveMGH(walletProvider, address)
        setTransactionLoading(true)
        const result = await transaction.wait();
        window.location.reload()
    }

    const stake = async () => {
        const amount = ethers.utils.parseEther(stakeInput)
        const transaction = await stakeMGH(walletProvider, address, amount)
        setHash(transaction.hash)
        setTransactionLoading(true)
        setTransactionModal(true)

        try {
            const receipt = await transaction.wait();
            setSuccess(true)
            setTransactionLoading(false)
        } catch (error: any) {
            console.log("error")
            console.log(error)
            setHash(error.receipt.transactionHash)
            setSuccess(false)
            setTransactionLoading(false)
        }


    }

    const unstake = async () => {
        const amount = ethers.utils.parseEther(unstakeInput)
        const transaction = await unstakeMGH(walletProvider, address, amount)
        setTransactionLoading(true)
        const result = await transaction.wait();
        window.location.reload()
    }

    const claimRewards = async () => {
        const transaction = await getReward(walletProvider, address)
        setTransactionLoading(true)
        const result = await transaction.wait();
        window.location.reload()
    }


    return (
        <>
            <Head>
                <title>MGH - Staking</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>

            {openModal && <WalletModal onDismiss={() => setOpenModal(false)} />}

            {loading ? (
                <div className="w-full h-full self-center flex items-center justify-center">
                    <img src="/images/mgh_logo.png" className={` h-24 w-24 logo`} />
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-10 space-y-5 lg:space-y-0 max-w-7xl w-full mt-8 xl:mt-0">

                    {transactionModal && (
                        <TransactionModal onDismiss={() => { setTransactionModal(false); !transactionLoading && window.location.reload() }} loading={transactionLoading} success={success} hash={hash} />
                    )}

                    <div className="flex flex-col space-y-5 w-full lg:w-7/12">

                        <div className="relative flex flex-col space-y-5 h-full items-center justify-between border-t border-l border-opacity-10 shadow-black rounded-xl p-2 sm:p-5 w-full bg-grey-dark bg-opacity-30">
                            {(!walletProvider || !allowance || chainId !== 80001) && <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 backdrop-blur-sm rounded-xl z-20"></div>}
                            <div className="self-start flex items-center justify-center space-x-2 sm:space-x-4 w-full pr-2 mb-2 z-30">
                                <img src="/images/mgh_logo.png" className="object-scale-down h-10 sm:h-14 p-1" />
                                <h3 className="text-gray-300 pb-1.5">$MGH Staking</h3>
                            </div>

                            <div className="flex flex-col flex-grow w-full items-stretch justify-center space-y-10 sm:space-y-10 max-w-md">
                                <div className="flex flex-col items-center">
                                    <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full px-1 mb-1.5">
                                        <p className="text-gray-300 font-medium text-xl flex-grow">Stake</p>
                                        <p onClick={() => setStakeInput(MGHBalance)} className="text-gray-400 cursor-pointer font-medium hover:text-gray-300 transition ease-in-out duration-300">Max: {(+MGHBalance) ? (+MGHBalance).toFixed(1) : ""}</p>
                                    </div>

                                    <input onChange={(e) => { setStakeInput(e.target.value) }} value={stakeInput} autoComplete="off" required id={Tokens.MGH} type="number" placeholder="0.0" className={`text-right w-full bg-grey-dark shadow-black hover:shadow-colorbottom focus:shadow-colorbottom bg-opacity-70 text-gray-200 font-medium text-lg sm:text-xl p-3 sm:p-4 pt-4 sm:pt-5 focus:outline-none border border-opacity-10 hover:border-opacity-30 focus:border-opacity-60 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />

                                    <button disabled={stakeInput ? (+stakeInput > +MGHBalance ? true : false) : true} onClick={stake} className={`disabled:opacity-30 disabled:hover:shadow-black disabled:cursor-default mt-2 sm:mt-4 flex justify-center items-center border border-pink-600 shadow-black hover:shadow-button transition ease-in-out duration-500 rounded-xl w-full py-3 sm:py-4`}>
                                        <p className="pt-1 z-10 text-pink-600 font-medium text-lg sm:text-xl">Stake $MGH</p>
                                    </button>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full px-1 mb-1.5">
                                        <p className="text-gray-300 font-medium text-xl flex-grow">Unstake</p>
                                        <p onClick={() => (+totalStaked) && setUnstakeInput(totalStaked)} className="text-gray-400 cursor-pointer font-medium pt-1 hover:text-gray-300 transition ease-in-out duration-300">Max: {(+totalStaked) ? (+totalStaked).toFixed(1) : ""}</p>
                                    </div>

                                    <input onChange={(e) => { setUnstakeInput(e.target.value) }} value={unstakeInput} required id={Tokens.MGH} type="number" autoComplete="off" placeholder="0.0" className={`text-right w-full bg-grey-dark shadow-black hover:shadow-colorbottom focus:shadow-colorbottom bg-opacity-70 text-gray-200 font-medium text-lg sm:text-xl p-3 sm:p-4 pt-4 sm:pt-5 focus:outline-none border border-opacity-10 hover:border-opacity-30 focus:border-opacity-60 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />

                                    <button disabled={unstakeInput ? (+unstakeInput > +totalStaked ? true : false) : true} onClick={unstake} className={`mt-2 sm:mt-4 disabled:opacity-30 disabled:hover:shadow-black disabled:cursor-default flex justify-center items-center border border-pink-600 shadow-black hover:shadow-button transition ease-in-out duration-500 rounded-xl w-full py-3 sm:py-4`}>
                                        <p className="pt-1 z-10 text-pink-600 font-medium text-lg sm:text-xl">Unstake $MGH</p>
                                    </button>
                                </div>
                            </div>



                            {walletProvider ? (+allowance) ? (
                                <></>
                            ) : chainId === 80001 ? (
                                <button onClick={approve} className="z-30 disabled:opacity-50 disabled:hover:shadow-black disabled:cursor-default mt-4 relative flex justify-center items-center  transition ease-in-out duration-500 shadow-black rounded-xl w-full max-w-md py-3 sm:py-4 group">
                                    <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80" />
                                    <span className="pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl">Approve MGH</span>
                                </button>
                            ) : (
                                <button onClick={() => { switchNetworkMumbai(walletProvider.provider) }} className="z-30 disabled:opacity-50 disabled:hover:shadow-black disabled:cursor-default mt-4 relative flex justify-center items-center  transition ease-in-out duration-500 shadow-black rounded-xl w-full max-w-md py-3 sm:py-4 group">
                                    <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80" />
                                    <span className="pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl">Switch to Polygon</span>v
                                </button>
                            ) : (
                                <button onClick={() => setOpenModal(true)} className="z-30 disabled:opacity-50 disabled:hover:shadow-black disabled:cursor-default mt-4 relative flex justify-center items-center  transition ease-in-out duration-500 shadow-black rounded-xl w-full max-w-md py-3 sm:py-4 group">
                                    <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80" />
                                    <span className="pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl">Connect Wallet</span>
                                </button>
                            )}

                        </div>


                    </div>


                    <div className="flex flex-col space-y-5 justify-between w-full lg:w-5/12 min-w-0 lg:min-w-max">

                        <div className="flex flex-col space-y-5 items-center border-t border-l border-opacity-0 shadow-black rounded-xl p-2 sm:p-5 w-full bg-grey-dark bg-opacity-30 max-w-4xl">
                            <h3 className="text-gray-300 pb-0">Rewards</h3>

                            <div className="flex flex-col items-center w-full max-w-sm">

                                <div className="self-start flex items-center justify-between space-x-1 sm:space-x-3 w-full">
                                    <p className={`text-gray-300 font-medium text-base sm:text-lg pt-1 flex-grow`}>Total MGH Locked</p>
                                    <p className={`text-gray-400 font-medium text-base sm:text-lg pt-1 text-right`}>{(+totalSupply).toFixed(2)} <span className="text-sm sm:text-base font-normal">$MGH</span></p>
                                </div>

                                <div className="self-start flex items-center justify-between space-x-1 sm:space-x-3 w-full">
                                    <p className={`text-gray-300 font-medium text-base sm:text-lg pt-1 flex-grow`}>Total Rewards/Second</p>
                                    <p className={`text-gray-400 font-medium text-base sm:text-lg pt-1 text-right`}>{(+rewardRate).toFixed(2)} <span className="text-sm sm:text-base font-normal">$MGH</span></p>
                                </div>

                                <div className="self-start flex items-center justify-between space-x-1 sm:space-x-3 w-full">
                                    <p className={`text-gray-300 font-medium text-base sm:text-lg pt-1 flex-grow`}>Current APR</p>
                                    <p className={`text-gray-400 font-medium text-base sm:text-lg pt-1 text-right`}>{APY.toFixed(2)}%</p>
                                </div>
                                <p className="text-gray-400 text-xs font-mediu self-start">APR is subject to continuos change</p>

                                <hr className="w-8/12 xs:w-9/12 border-gray-600 my-5" />

                                <div className="self-start flex items-center justify-between space-x-1 sm:space-x-3 w-full">
                                    <p className={`text-gray-300 font-medium text-base sm:text-lg pt-1 flex-grow`}>Your Stake</p>
                                    <p className={`text-gray-400 font-medium text-base sm:text-lg pt-1 text-right`}>{(+totalStaked).toFixed(2)} <span className="text-sm sm:text-base font-normal">$MGH <span className="text-xs sm:text-sm italic">({((+totalStaked) / (+totalSupply) * 100).toFixed(2)}%)</span></span></p>
                                </div>

                                <div className="self-start flex items-center justify-between space-x-1 sm:space-x-3 w-full">
                                    <p className={`text-gray-300 font-medium text-base sm:text-lg pt-1 flex-grow`}>Rewards claimable</p>
                                    <p className={`text-gray-400 font-medium text-base sm:text-lg pt-1 text-right`}>{(+earned).toFixed(2)} <span className="text-sm sm:text-base font-normal">$MGH</span></p>
                                </div>

                            </div>

                            <div className="flex flex-col items-center w-full sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 max-w-sm">
                                <button disabled={(+earned) ? false : true} onClick={claimRewards} className={`disabled:opacity-20 disabled:hover:shadow-black disabled:cursor-default flex justify-center items-center border bg-blue-400 border-blue-400 shadow-black hover:shadow-button transition ease-in-out duration-500 rounded-xl w-full max-w-sm py-3 sm:py-4`}>
                                    <p className="pt-1 z-10 text-grey-darkest font-medium text-lg sm:text-xl">Claim</p>
                                </button>
                                <button disabled={(+earned) ? false : true} onClick={claimRewards} className={`disabled:opacity-20 disabled:hover:shadow-black disabled:cursor-default flex justify-center items-center border border-blue-400 shadow-black hover:shadow-button transition ease-in-out duration-500 rounded-xl w-full max-w-sm py-3 sm:py-4`}>
                                    <p className="pt-1 z-10 text-blue-400 font-medium text-lg sm:text-xl">Reinvest</p>
                                </button>
                            </div>
                        </div>



                        <div className="flex flex-col justify-center space-y-5 items-center rounded-xl p-2 sm:p-5 w-full bg-grey-dark bg-opacity-30 shadow-black max-w-4xl">
                            <p className="text-gray-300 font-medium max-w-sm text-center text-sm sm:text-base pt-4 sm:pt-0">$MGH staking is on Polygon for you to save network fees. To stake your $MGH, you first have to bridge them using the Polygon Bridge.</p>
                            <Bridge />
                        </div>
                    </div>


                </div>
            )}




        </>
    )
}


export default Stake
