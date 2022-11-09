import { NextPage } from "next";
import Head from "next/head";

import HomeCard from "../components/HomeCard";


const Home: NextPage = () => {

    return (
        <>
            <Head>
                <title>MGH - NFT Valuation</title>
                <meta name="description" content="Swap your MGH, become a liquidity provider by staking your tokens and access our data ecosytem." />
            </Head>

            <div className="w-full flex flex-col items-center justify-start space-y-10 max-w-7xl mt-8 xl:mt-0">
                <span>
                    <img src="/images/imagenft.svg" alt="IMG" className="w-[1500px]"/>
                </span>
                <div className="flex  border-t border-l border-white/10 shadow-blck rounded-xl p-5  bg-grey-dark bg-opacity-30 justify-between">
                    <div className="pr-5 w-3/4">
                        <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-blue-400 to-blue-500">Description<br /></h2>
                        <p className={`text-sm xs:text-base xl:text-lg font-medium text-gray-200`}>Direct repair of aneurysm, pseudoaneurysm, or excision (partial or total) and graft insertion, with or without patch graft; for ruptured aneurysm, abdominal aorta  Direct repair of aneurysm, pseudoaneurysm, or excision (partial or total) and graft insertion, with or without patch graft; for ruptured aneurysm, abdominal aorta</p>
                    </div>
                    <div className="flex border-t border-l border-white/10 shadow-blck rounded-xl p-3 bg-grey-dark bg-opacity-30 w-1/4">
                        <div className="flex flex-col">
                        <p className="text-xxs xs:text-sm xl:text-base font-medium text-gray-200 pt-0 sm:pt-5 flex justify-between">FLOOR <p>:</p></p>
                        <p className="text-xxs xs:text-sm xl:text-base font-medium text-gray-200 pt-0 sm:pt-5 flex justify-between">TRADING VOLUME <p className="pl-1">:</p></p>
                        <p className="text-xxs xs:text-sm xl:text-base font-medium text-gray-200 pt-0 sm:pt-5 flex justify-between">MCAP <p>:</p></p>
                        <p className="text-xxs xs:text-sm xl:text-base font-medium text-gray-200 pt-0 sm:pt-5 flex justify-between">OWNERS <p>:</p></p>
                        </div>
                        <div>
                            <p  className="text-xxs xs:text-sm xl:text-base font-medium text-gray-200 pt-0 pl-2 sm:pt-5">
                                value
                            </p>
                            <p  className="text-xxs xs:text-sm xl:text-base font-medium text-gray-200 pt-0 pl-2 sm:pt-5">
                                value
                            </p>
                            <p  className="text-xxs xs:text-sm xl:text-base font-medium text-gray-200 pt-0 pl-2 sm:pt-5">
                                value
                            </p>
                            <p  className="text-xxs xs:text-sm xl:text-base font-medium text-gray-200 pt-0 pl-2 sm:pt-5">
                                value
                            </p>
                        </div>
                    </div>
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
