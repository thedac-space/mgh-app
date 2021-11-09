import { useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { IoSwapVertical } from "react-icons/io5"

import TokenInput from '../components/TokenInput';
import { useAppSelector } from '../state/hooks';
import { Network, Tokens } from '../state/types';
import dynamic from 'next/dynamic';


const Bridge = dynamic(import('../components/Bridge'), { ssr: false });


const Swap: NextPage = () => {
    const [ethToMGH, setEthtoMGH] = useState(true);
    const network = useAppSelector(state => state.network.value)

    return (
        <>
            <Head>
                <title>MGH - Swap</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>

            <div className=" w-full flex flex-col lg:flex-row space-y-10 lg:space-y-0 space-x-0 lg:space-x-5 xl:space-x-10 items-stretch justify-center">
                {/* <div className="flex flex-col items-center border-t border-l border-opacity-20 shadow-black rounded-xl p-0 w-full bg-grey-dark bg-opacity-30 max-w-full lg:max-w-4xl"> */}
                    {/* <h3 className="pb-5 text-gray-300">Swap</h3> */}

                    <iframe
                        src="https://app.uniswap.org/#/swap?inputCurrency=0x8765b1a0eb57ca49be7eacd35b24a574d0203656&outputCurrency=ETH&theme=dark"
                        height="550px"
                        width="100%"
                        id="myId"
                        className="rounded-xl shadow-black opacity-80 max-w-full lg:max-w-4xl"
                    />

                {/* </div> */}

                <div className="flex flex-col sm:flex-row lg:flex-col w-full lg:w-max space-x-0 sm:space-x-5 lg:space-x-0 space-y-5 sm:space-y-0 lg:space-y-5 xl:space-y-10 justify-between lg:justify-center">
                    <div className="flex flex-col items-center text-center text-gray-200 p-3 border-t border-l border-opacity-0 rounded-xl w-full lg:w-72 bg-grey-dark bg-opacity-30 max-w-4xl">
                        <h3 className="mb-0 lg:mb-5">Acquire Data Tokens</h3>
                        <p className="max-w-md">Switch to the Polygon network, swap $mMGH against our Data Token and access key metaverse related data through the Ocean marketplace.</p>
                    </div>
                    <div className="flex flex-col text-center items-center text-gray-200 p-3 border-t border-l border-opacity-0 rounded-xl w-full lg:w-72 bg-grey-dark bg-opacity-30 max-w-4xl">
                        <h3 className="mb-0 lg:mb-5">Get $mMGH</h3>
                        <p className="max-w-md">Simply change your $MGH Tokens to $mMGH Tokens using the Polygon Bridge.</p>
                        <Bridge />
                        {/* <a href="https://wallet.polygon.technology/bridge" target="_blank" className="mt-3 text-gray-400 font-medium max-w-max text-lg hover:text-blue-400 transition ease-in-out duration-300">Learn more</a> */}
                    </div>
                </div>

            </div>

        </>
    )
}


export default Swap
