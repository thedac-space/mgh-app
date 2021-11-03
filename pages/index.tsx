import { NextPage } from "next";
import Head from "next/head";

import HomeCard from "../components/HomeCard";


const Home: NextPage = () => {

    return (
        <>
            <Head>
                <title>MGH - App</title>
                <meta name="description" content="Swap your MGH, become a liquidity provider by staking your tokens and access our data ecosytem." />
            </Head>
            <div className="h-full w-full flex flex-row items-center justify-evenly">
                <div className="w-full flex flex-col items-center justify-start space-y-10 max-w-7xl">

                    <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-blck rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                        <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-blue-400 to-blue-500">Leverage the MetaGameHub<br /> DeFi Ecosystem</h2>
                        <p className={`text-base xs:text-lg xl:text-xl font-medium text-gray-200 pt-0 sm:pt-5`}>Swap your MGH, become a liquidity provider by staking your tokens and access our data ecosytem.</p>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5 xs:gap-2 sm:gap-5 2xl:gap-10 w-full">
                        <HomeCard image="/images/swap.jpeg" link="/swap" text="Swap your mMGH to access curated datasets about land land valuations from The Sandbox and Decentraland."/>
                        <HomeCard image="/images/liquidity.jpeg" link="/stake" text="Provide liquidity to the MGH/ETH Pool."/>
                        <HomeCard image="/images/nft-pools.jpeg" link="/pools" text="Stake your NFTs and enter the world of MetaFi."/>
                        <HomeCard image="/images/land-valuation.jpeg" link="/valuation" text="Evaluate your metaverse lands and look for undervalued parcels."/>
                    </div>
                </div>
            </div>
        </>
    )
};


export default Home;
