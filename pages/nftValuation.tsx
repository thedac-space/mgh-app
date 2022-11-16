import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import NftCard from "../components/NftCard";

const Home: NextPage = () => {
	const [nftFluf, setnftFluf] = useState([]);
    const [nftFlufGlobal, setnftFlufGlobal] = useState();
	const [searchId, setSearchById] = useState(nftFluf)
    const [nftId, setnftId] = useState('');


    const filtered = (e:any) => {
        const keyWord = e.target.value
		const results = nftFluf.filter((fluf: any) => {
            return fluf.tokenId == keyWord
        });
        setSearchById(results);
		setnftId(keyWord);
    }

	const filters = (e:any) => {
        const keyWord = e.target.value
		const results = nftFluf.filter((fluf: any) => {
			let result = false
			if(fluf.traits)
            return fluf.tokenId == keyWord
        });
        setSearchById(results);
		setnftId(keyWord);
    }

	useEffect(() => {
		let flag = 0;
		const size = 200;
		const dataArray: any = [];
		const getnftFluf = async () => {
			await axios
				.get(
					"https://services.itrmachines.com/" +
						"fluf/collection?from=0&size=10000"
				)
				.then((response) => {
					Object.entries(response.data).forEach(([key, value]) => {
						dataArray.push(value);
					});
				})
				.then(() => {
					setnftFluf(dataArray);
				});
		};
		getnftFluf();
	}, []);

	useEffect(() => {
		const getnftFlufGlobal = async () => {
            setnftFlufGlobal(
                    (
                        await axios.get(
                        "https://services.itrmachines.com/" +
                            "fluf/globalData"
				        )
                    ).data
                )
		};
		getnftFlufGlobal();
	}, []);
    console.log("global",nftFlufGlobal)
	return (
		<>
			<Head>
				<title>MGH - NFT Valuation</title>
				<meta
					name="description"
					content="Swap your MGH, become a liquidity provider by staking your tokens and access our data ecosytem."
				/>
			</Head>
			<div className="bg-[#F8F9FD] rounded-lg p-8">
				<div className="w-full flex flex-col  space-y-10 max-w-7xl mt-8 xl:mt-0">
					<span>
						<img src="/images/imagenft.svg" alt="IMG" className="w-[1500px]" />
					</span>
					<div className="flex  border-t border-l border-white/10 rounded-3xl shadowDiv p-5 bg-opacity-30 justify-between bg-[#F9FAFB]">
						<div className="pr-5 w-3/4">
							<h2 className="text-grey-content font-plus font-normal rounded-2xl lg:text-5xl text-3xl mb-0 sm:mb-2">
								Description
								<br />
							</h2>
							<p
								className={`text-sm xs:text-base xl:text-lg font-plus font-normal text-grey-content`}
							>
								Direct repair of aneurysm, pseudoaneurysm, or excision (partial
								or total) and graft insertion, with or without patch graft; for
								ruptured aneurysm, abdominal aorta Direct repair of aneurysm,
								pseudoaneurysm, or excision (partial or total) and graft
								insertion, with or without patch graft; for ruptured aneurysm,
								abdominal aorta
							</p>
						</div>
						<div className="flex border-t border-l border-white/10 shadow-blck rounded-xl p-3 bg-[#D4D7DD] bg-opacity-30 w-1/4 pt-5 pb-5">
							<div className="flex flex-col ">
								<p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 sm:pt-5 flex justify-between">
									FLOOR :
								</p>
								<p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 sm:pt-5 flex justify-between">
									TRADING VOLUME :
								</p>
								<p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 sm:pt-5 flex justify-between">
									MCAP :
								</p>
								<p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 sm:pt-5 flex justify-between">
									OWNERS :
								</p>
							</div>
							<div className="items-end">
								<p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 pl-2 sm:pt-5">
                                    {/* {nftFlufGlobal.floor_price} */}
								</p>
								<p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 pl-2 sm:pt-5">
                                    {/* {nftFlufGlobal.total_volume} */}
								</p>
								<p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 pl-2 sm:pt-5">
                                    {/* {nftFlufGlobal.market_cap} */}
								</p>
								<p className="text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 pl-2 sm:pt-5">
									{/* {nftFlufGlobal.num_owners} */}
								</p>
							</div>
						</div>
					</div>
					<div className="flex space-x-12">
						<select name="traits" className="shadowDiv rounded-full px-10 py-5 font-bold font-plus w-1/4 focus:outline-none">
							<option value="traits1" className="shadowDiv rounded-full py-5 font-bold font-plus">TRAITS</option>
							<option value="traits2" className="shadowDiv rounded-full py-5 font-bold font-plus">HEAD</option>
							<option value="traits3" className="shadowDiv rounded-full py-5 font-bold font-plus">FUR</option>
						</select>
						<div className="relative searchBy rounded-full w-3/4 flex">
							<input
								type='number'
								onChange={filtered}
								value={nftId}
								placeholder='Search by ID'
								className="font-bold font-plus justify-center text-grey-content focus:outline-none placeholder-gray-300 p-3 searchBy rounded-full w-3/4"
							/>
							<button type="submit" className="absolute block right-4 top-6 text-grey-content text-xl"><FiSearch/></button> 
						</div>
						
					</div>
					{ searchId && searchId.length > 0 ? (
						<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 xs:gap-2 sm:gap-5 w-full">
						{searchId.map((fluf: any, key) => {
							return (
								<>
								<NftCard
									key={key}
									image={fluf.images.image_small}
									text="Estimated Price: "
									value={fluf.floor_adjusted_predicted_price}
								/>
								</>
								
							)
						})}
						</div>
						) : (
							nftFluf && (
								<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 xs:gap-2 sm:gap-5 w-full">
									{nftFluf.map((fluf: any, key:any) => {
										return (
											<NftCard
												key={key}
												image={fluf.images.image_small}
												text="Estimated Price: "
												value={fluf.floor_adjusted_predicted_price}
											/>	
										)
									})}
								</div>
							)
						)
					}
				</div>
			</div>
		</>
	);
};

export default Home;
