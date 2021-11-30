import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic';


import TokenInput from '../../components/TokenInput'
import { Tokens } from '../../lib/enums'
import { approveMGH, calcReward, getMGHAllowance, getMGHBalance, getReward, stakeMGH, unstakeMGH } from '../../backend/contractInteraction';
import useConnectWallet from '../../backend/connectWallet';
import { useAppSelector } from '../../state/hooks';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import useStakingContract from '../../backend/stakingContract';
import WalletModal from "../../components/WalletModal"
import switchNetworkMumbai from '../../backend/changeChain';

const Bridge = dynamic(import('../../components/Bridge'), { ssr: false });


const Stake: NextPage = () => {
    const { address, chainId } = useAppSelector(state => state.account)
    const { walletProvider } = useConnectWallet()
    const { MGHBalance, allowance, totalStaked, earned, totalSupply, rewardRate, APY } = useStakingContract(walletProvider, address, chainId)

    const [stakeInput, setStakeInput] = useState("")
    const [unstakeInput, setUnstakeInput] = useState("")

    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)


    const approve = async () => {
        const transaction = await approveMGH(walletProvider, address)
        setLoading(true)
        const result = await transaction.wait();
        window.location.reload()
    }

    const stake = async () => {
        const amount = ethers.utils.parseEther(stakeInput)
        const transaction = await stakeMGH(walletProvider, address, amount)
        setLoading(true)
        const result = await transaction.wait();
        window.location.reload()
    }

    const unstake = async () => {
        const amount = ethers.utils.parseEther(unstakeInput)
        const transaction = await unstakeMGH(walletProvider, address, amount)
        setLoading(true)
        const result = await transaction.wait();
        window.location.reload()
    }

    const claimRewards = async () => {
        const transaction = await getReward(walletProvider, address)
        setLoading(true)
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
            {loading && (
                <div className="absolute top-0 left-0 h-screen w-screen flex flex-col items-center justify-center space-y-10 bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm z-20 ">

                    <img src="/images/mgh_logo.png" className={` h-24 w-24 logo`} />
                    <p className="text-3xl text-blue-400 font-medium">Processing Transaction</p>
                </div>
            )}


            <div className="flex flex-col lg:flex-row space-x-5 max-w-5xl mt-8 xl:mt-0">
                <div className="flex flex-col space-y-5">

                    <div className="flex flex-col space-y-5 items-center justify-between border-t border-l border-opacity-20 shadow-black rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 max-w-4xl">
                        <h3 className="text-gray-300 pb-0">Stake</h3>

                        <div className="flex flex-col items-center w-full rounded-xl max-w-sm">
                            <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full pr-2 mb-2">
                                <img src="/images/mgh_logo.png" className="object-scale-down h-9 p-1" />
                                <p className={`text-gray-300 font-medium flex-grow text-lg pt-1`}>{Tokens.MGH}</p>
                                <p onClick={() => setStakeInput(MGHBalance)} className="text-gray-400 cursor-pointer font-medium pt-1 hover:text-gray-300 transition ease-in-out duration-300">Max {(+MGHBalance) ? (+MGHBalance).toFixed(1) : ""}</p>
                            </div>

                            <input disabled={(+allowance) ? false : true} onChange={(e) => { setStakeInput(e.target.value) }} value={stakeInput} autoComplete="off" required id={Tokens.MGH} type="number" placeholder="0.0" className={`disabled:cursor-default disabled:opacity-50 disabled:hover:shadow-black disabled:hover:border-opacity-10 text-right flex-initial w-full bg-grey-dark shadow-black hover:shadow-colorbottom focus:shadow-colorbottom bg-opacity-70 text-gray-200 font-medium text-2xl p-3 sm:p-4 pt-4 sm:pt-5 focus:outline-none border border-opacity-10 hover:border-opacity-30 focus:border-opacity-60 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />

                            {walletProvider ? (+allowance) ? (
                                <button disabled={stakeInput ? false : true} onClick={stake} className="disabled:opacity-50 disabled:hover:shadow-black disabled:cursor-default mt-4 relative flex justify-center items-center border border-opacity-0 hover:border-opacity-20 hover:shadow-button transition ease-in-out duration-500 shadow-black rounded-xl w-full py-4 text-gray-200 font-medium text-lg overflow-hidden">
                                    <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl blur-2xl group-hover:blur-xl" />
                                    <span className="pt-1 z-10">Lock MGH</span>
                                </button>
                            ) : chainId === 80001 ? (
                                <button onClick={approve} className="disabled:opacity-50 disabled:hover:shadow-black disabled:cursor-default mt-4 relative flex justify-center items-center border border-opacity-0 hover:border-opacity-20 hover:shadow-button transition ease-in-out duration-500 shadow-black rounded-xl w-full py-4 text-gray-200 font-medium text-lg overflow-hidden">
                                    <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl blur-2xl group-hover:blur-xl" />
                                    <span className="pt-1 z-10">Approve MGH</span>
                                </button>
                            ) : (
                                <button onClick={() => { switchNetworkMumbai(walletProvider.provider) }} className="disabled:opacity-50 disabled:hover:shadow-black disabled:cursor-default mt-4 relative flex justify-center items-center border border-opacity-0 hover:border-opacity-20 hover:shadow-button transition ease-in-out duration-500 shadow-black rounded-xl w-full py-4 text-gray-200 font-medium text-lg overflow-hidden">
                                    <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl blur-2xl group-hover:blur-xl" />
                                    <span className="pt-1 z-10">Switch to Polygon</span>
                                </button>
                            ) : (
                                <button onClick={() => setOpenModal(true)} className="disabled:opacity-50 disabled:hover:shadow-black disabled:cursor-default mt-4 relative flex justify-center items-center border border-opacity-0 hover:border-opacity-20 hover:shadow-button transition ease-in-out duration-500 shadow-black rounded-xl w-full py-4 text-gray-200 font-medium text-lg overflow-hidden">
                                    <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl blur-2xl group-hover:blur-xl" />
                                    <span className="pt-1 z-10">Connect Wallet</span>
                                </button>
                            )}

                        </div>

                    </div>


                    <div className="flex flex-col space-y-5 items-center justify-between border-t border-l border-opacity-20 shadow-black rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 max-w-4xl">
                        <h3 className="text-gray-300 pb-0">Unstake</h3>

                        <div className="flex flex-col items-center w-full rounded-xl max-w-sm">
                            <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full pr-2 mb-2">
                                <img src="/images/mgh_logo.png" className="object-scale-down h-9 p-1" />
                                <p className={`text-gray-300 font-medium flex-grow text-lg pt-1`}>{Tokens.MGH}</p>
                                <p onClick={() => (+totalStaked) && setUnstakeInput(totalStaked)} className="text-gray-400 cursor-pointer font-medium pt-1 hover:text-gray-300 transition ease-in-out duration-300">Max {(+totalStaked) ? (+totalStaked).toFixed(1) : ""}</p>
                            </div>

                            <input onChange={(e) => { setUnstakeInput(e.target.value) }} value={unstakeInput} required id={Tokens.MGH} type="number" autoComplete="off" placeholder="0.0" className={`text-right flex-initial w-full bg-grey-dark shadow-black hover:shadow-colorbottom focus:shadow-colorbottom bg-opacity-70 text-gray-200 font-medium text-2xl p-3 sm:p-4 pt-4 sm:pt-5 focus:outline-none border border-opacity-10 hover:border-opacity-30 focus:border-opacity-60 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />

                            <button disabled={unstakeInput ? false : true} onClick={unstake} className="disabled:opacity-50 disabled:hover:shadow-black disabled:cursor-default mt-4 relative flex justify-center items-center border border-opacity-0 hover:border-opacity-20 hover:shadow-button transition ease-in-out duration-500 shadow-black rounded-xl w-full py-4 text-gray-200 font-medium text-lg overflow-hidden">
                                <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl blur-2xl group-hover:blur-xl" />
                                <span className="pt-1 z-10">Release MGH</span>
                            </button>
                        </div>

                    </div>
                </div>


                <div className="flex flex-col space-y-5 justify-between">
                    <div className="flex flex-col space-y-5 items-center border-t border-l border-opacity-0 shadow-black rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 max-w-4xl">
                        <h3 className="text-gray-300 pb-0">Rewards</h3>

                        <div className="flex flex-col items-center w-full max-w-sm">

                            <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full">
                                <p className={`text-gray-300 font-medium text-lg pt-1 flex-grow`}>Total MGH Locked</p>
                                <p className={`text-gray-400 font-medium text-lg pt-1`}>{(+totalSupply).toFixed(4)}</p>
                            </div>

                            <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full">
                                <p className={`text-gray-300 font-medium text-lg pt-1 flex-grow`}>Total Rewards per Second</p>
                                <p className={`text-gray-400 font-medium text-lg pt-1`}>{(+rewardRate).toFixed(4)}</p>
                            </div>

                            <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full">
                                <p className={`text-gray-300 font-medium text-lg pt-1 flex-grow`}>Current APR</p>
                                <p className={`text-gray-400 font-medium text-lg pt-1`}>{APY.toFixed(2)} %</p>
                            </div>
                            <p className="text-gray-400 text-xs font-mediu self-start">APR is subject to continuos change</p>

                            <hr className="w-8/12 xs:w-9/12 border-gray-600 my-5" />

                            <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full">
                                <p className={`text-gray-300 font-medium text-lg pt-1 flex-grow`}>Staked MGH</p>
                                <p className={`text-gray-400 font-medium text-lg pt-1`}>{(+totalStaked).toFixed(4)}</p>
                            </div>

                            <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full">
                                <p className={`text-gray-300 font-medium text-lg pt-1 flex-grow`}>Rewards claimable</p>
                                <p className={`text-gray-400 font-medium text-lg pt-1`}>{(+earned).toFixed(4)}</p>
                            </div>

                        </div>

                        <button disabled={(+earned) ? false : true} onClick={claimRewards} className={`disabled:opacity-50 disabled:hover:shadow-black disabled:cursor-default relative flex justify-center items-center border border-opacity-50 shadow-black hover:shadow-button transition ease-in-out duration-500 rounded-xl w-full max-w-sm py-4`}>
                            {/* <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl blur-2xl group-hover:blur-xl" /> */}
                            <span className="pt-1 z-10 text-gray-200 font-medium text-xl">Claim Rewards</span>
                        </button>
                    </div>



                    <div className="flex flex-col justify-center space-y-5 items-center border-t border-l border-opacity-0 shadow-blac rounded-xl p-5 w-full bg-grey-dark bg-opacity-20 max-w-4xl">
                        <p className="text-gray-300 font-medium max-w-sm text-center">$MGH staking is on Polygon for you to save network fees. To stake your $MGH, you first have to bridge them using the Polygon Bridge.</p>
                        <Bridge />
                    </div>
                </div>


            </div>

        </>
    )
}


export default Stake
