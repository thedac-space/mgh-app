import { useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { IoSwapVertical } from "react-icons/io5"

import TokenInput from '../components/TokenInput';
import { useAppSelector } from '../state/hooks';
import { Network, Tokens } from '../state/types';


const Liquidity: NextPage = () => {
    const [ethToMGH, setEthtoMGH] = useState(true);
    const network = useAppSelector(state => state.network.value)

    return (
        <>
            <Head>
                <title>MGH - Liquidity</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>

            <div className="h-full w-full flex flex-col lg:flex-row space-y-10 lg:space-y-0 space-x-0 lg:space-x-5 xl:space-x-10 items-stretch justify-center">

                <iframe
                    src="https://app.uniswap.org/#/add/v2/0x6B175474E89094C44Da98b954EedeAC495271d0F/0xdAC17F958D2ee523a2206206994597C13D831ec7&theme=dark"
                    height="100%"
                    width="100%"
                    id="myId"
                    className="rounded-xl shadow-black opacity-80 max-w-full h-full min-h-screen xl:min-h-full"
                />


            </div>

        </>
    )
}


export default Liquidity
