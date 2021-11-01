import { useEffect, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import "animate.css"
import { RiHome6Line, RiMoneyDollarCircleLine } from "react-icons/ri"
import { IoIosSwap, IoIosArrowDown } from "react-icons/io"
import { VscLock } from "react-icons/vsc"
import { MdOutlineCollections, MdOutlineAttachMoney } from "react-icons/md"
import { BsQuestionCircle } from "react-icons/bs"
import { HiOutlineSearch } from "react-icons/hi"
import Valuation from '../components/Valuation';


const Home: NextPage = ({ prices }: any) => {
    const [scroll, setScroll] = useState(0);

    useEffect(function onFirstMount() {
        function onScroll() {
            setScroll(window.scrollY);
        }
        window.addEventListener("scroll", onScroll, { passive: true });
    }, []);

    return (
        <>
            <Head>
                <title>MetaGameHub DAO</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
                {/* <meta name="robots" content="noodp,noydir" /> */}
            </Head>

            <svg width="0" height="0">
                <linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop stopColor="#7a6ded" offset="0%" />
                    <stop stopColor="#591885" offset="100%" />
                </linearGradient>
            </svg>


            <div className="flex w-full h-screen bg-grey-darkest">

                <div className="h-screen w-1/6 flex flex-col items-start p-5">
                    <a href="/" className="hover:scale-110 transition-all duration-500 ease-in-out self-center">
                        <img src="/images/mgh_logo.png" className={`h-18 w-18 mt-5 mb-16 animate__animated animate__flip`} />
                    </a>

                    <li className="space-y-6 w-full">
                        <a href="/" className="flex items-center space-x-4 text-gray-500 font-medium text-xl rounded-xl p-3 w-full">
                            <RiHome6Line className="text-2xl" />
                            <span className="pt-1.5">Home</span>
                        </a>

                        <a href="/swap" className="flex items-center space-x-4 text-gray-500 font-medium text-xl rounded-xl p-3 w-full">
                            <IoIosSwap className="text-2xl" />
                            <span className="pt-1.5">Swap</span>
                        </a>

                        <a href="/" className="flex items-center space-x-4 text-gray-500 font-medium text-xl rounded-xl p-3 w-full">
                            <VscLock className="text-2xl" />
                            <span className="pt-1.5">Liquidity</span>
                        </a>

                        <a href="/" className="flex items-center space-x-4 text-gray-500 font-medium text-xl rounded-xl p-3 w-full">
                            <MdOutlineCollections className="text-2xl" />
                            <span className="pt-1.5">NFT Pools</span>
                        </a>


                        <a href="/" className="relative overflow-hidden flex items-center text-gray-200 font-medium text-xl rounded-xl p-3 w-full  shadow-black">
                            <div className="h-full w-full absolute bg-gradient-to-br from-grey-dark to-grey-darkest rounded-xl blur-xl" />
                            <MdOutlineAttachMoney className="text-2xl text-pink-600 z-10 mr-4" />
                            <span className="pt-1 z-10">LAND Valuation</span>
                        </a>
                    </li>

                </div>

                <div className="flex flex-col w-5/6 justify-end h-screen">

                    <div className="flex space-x-10 h-1/6 w-full items-center justify-end p-10">

                        <div className="relative flex items-center  justify-evenly cursor-pointer text-gray-600 hover:text-gray-200 transition ease-in-out duration-300 font-medium text-xl rounded-xl p-3 bg-white bg-opacity-5 group shadow-black overflow-hidden">
                            <div className="h-full w-full absolute bg-gradient-to-br from-grey-dark to-grey-darkest rounded-xl blur-xl" />
                            <img src="/images/ethereum-eth-logo.png" className="h-8 w-8 z-10" />
                            <span className="pt-1 z-10 text-gray-200 px-3 ">Ethereum</span>
                            {/* <span className="pt-1 z-10 text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-blue-500 px-3">Ethereum</span> */}
                            <IoIosArrowDown className="z-10 text-2xl mt-1 " />
                        </div>

                        <div className="relative flex items-center justify-center cursor-pointer text-gray-200 font-medium text-xl rounded-xl p-3 px-5 bg-white bg-opacity-5 group shadow-black hover:scale-105 overflow-hidden transition ease-in-out duration-500">
                            <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl blur-2xl group-hover:blur-xl" />
                            <span className="pt-1 z-10">Connect Wallet</span>
                        </div>


                    </div>


                    <div className="w-full h-5/6 animate__animated animate__slideInRight grid grid-cols-2 gap-10 border-l border-t border-opacity-10 rounded-tl-3xl self-end bg-gradient-to-br from-grey-dark to-grey-darkest shadow-black p-10">

                        <div className="col-span-full flex flex-col items-start p-5 w-full bg-grey-darkest bg-opacity-30 border-t border-l border-opacity-20 rounded-3xl shadow-black">
                            <h2 className="text-transparent bg-clip-text bg-gradient-to-b from-blue-500 via-green-400 to-green-500 pt-5">Swap</h2>
                            <p className={`text-lg xl:text-xl font-medium text-gray-200 mt-5`}>Find the real value of The Sandbox LANDs with our machine learning pricing algorithm.</p>
                        </div>

                        <Valuation prices={prices} />

                    </div>

                </div>

            </div>


        </>
    )
}

export async function getStaticProps() {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox&vs_currencies=usd")
    const prices = await res.json();

    return {
        props: {
            prices,
        },
    }
}

export default Home
