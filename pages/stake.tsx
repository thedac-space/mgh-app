import type { NextPage } from 'next'
import Head from 'next/head'

import { useAppSelector } from '../state/hooks';


const Stake: NextPage = () => {
    const network = useAppSelector(state => state.network.value)

    return (
        <>
            <Head>
                <title>MGH - Staking</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>

            <div className="h-full w-full flex flex-row items-center justify-evenly">
                <p className="neonText text-4xl sm:text-7xl font-medium py-3">Coming Soon!</p>
            </div>


        </>
    )
}


export default Stake
