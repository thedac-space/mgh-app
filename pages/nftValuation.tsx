import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

import NftCard from "../components/NftCard";


const Home: NextPage = () => {

    const [nftFluf, setnftFluf] = useState()

useEffect(() => {
    const getnftFluf = async () => {
        // // setnftFluf(
        // //     (
        // //         await axios.get(
        // //             process.env.REACT_APP_WALLETCONNECT_BACKEND_URL +
        // //             '/wearables?address=' +
        // //             wallet.address
        // //         )
        // //     )
        // // )
    }
    getnftFluf()
}, [])

    return (
        <>
            <Head>
                <title>MGH - NFT Valuation</title>
                <meta name="description" content="Swap your MGH, become a liquidity provider by staking your tokens and access our data ecosytem." />
            </Head>
            <div className="bg-[#F8F9FD] rounded-lg p-8">
                <div className="w-full flex flex-col items-center justify-start space-y-10 max-w-7xl mt-8 xl:mt-0">
                    <span>
                        <img src="/images/imagenft.svg" alt="IMG" className="w-[1500px]"/>
                    </span>
                    <div className="flex  border-t border-l border-white/10 rounded-3xl shadowDiv p-5 bg-opacity-30 justify-between bg-[#F9FAFB]">
                        <div className="pr-5 w-3/4">
                            <h2 className="text-grey-content font-plus font-normal rounded-2xl lg:text-5xl text-3xl mb-0 sm:mb-2">Description<br /></h2>
                            <p className={`text-sm xs:text-base xl:text-lg font-plus font-normal text-grey-content`}>Direct repair of aneurysm, pseudoaneurysm, or excision (partial or total) and graft insertion, with or without patch graft; for ruptured aneurysm, abdominal aorta  Direct repair of aneurysm, pseudoaneurysm, or excision (partial or total) and graft insertion, with or without patch graft; for ruptured aneurysm, abdominal aorta</p>
                        </div>
                        <div className="flex border-t border-l border-white/10 shadow-blck rounded-xl p-3 bg-[#D4D7DD] bg-opacity-30 w-1/4 pt-5 pb-5">
                            <div className="flex flex-col ">
                            <p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 sm:pt-5 flex justify-between">FLOOR <p>:</p></p>
                            <p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 sm:pt-5 flex justify-between">TRADING VOLUME <p className="pl-1">:</p></p>
                            <p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 sm:pt-5 flex justify-between">MCAP <p>:</p></p>
                            <p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 sm:pt-5 flex justify-between">OWNERS <p>:</p></p>
                            </div>
                            <div className="items-end">
                                <p  className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 pl-2 sm:pt-5">
                                    value
                                </p>
                                <p  className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 pl-2 sm:pt-5">
                                    value
                                </p>
                                <p  className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 pl-2 sm:pt-5">
                                    value
                                </p>
                                <p  className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 pl-2 sm:pt-5">
                                    value
                                </p>
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 xs:gap-2 sm:gap-5 w-full">
                        <NftCard image="/images/nft1.png" text="Estimated Price: " value="201"/>
                    </div>
                </div>
            </div>
        </>
    )
};


export default Home;
