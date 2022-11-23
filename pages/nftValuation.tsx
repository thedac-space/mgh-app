import axios from "axios";
import { AnyObject } from "immer/dist/internal";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { GiFluffySwirl } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

import NftCard from "../components/NftCard";

const Home: NextPage = () => {
	const [nftFluf, setnftFluf] = useState([])
    const [nftFlufGlobal, setnftFlufGlobal] = useState<AnyObject>({})
	const [searchId, setSearchById] = useState(nftFluf)
	const [nftId, setnftId] = useState('')


	const [loading, setLoading] = useState(true);
	const [pageLenght, setPageLenght] = useState(0)
	const [pageSearcher, setPageSearcher] = useState<number>()
	const [controlPageIndex, setControlPageIndex] = useState<number>(0)
	


	const styleContent = 'text-xxs xs:text-xxs xl:text-xs font-plus font-bold text-grey-content pt-0 sm:pt-5 flex justify-between'

    const filtered = (e:any) => {
        const keyWord = e.target.value
		const results = nftFluf.filter((fluf: any) => {
            return fluf.tokenId == keyWord
        });
        setSearchById(results);
		setnftId(keyWord);
    }

	// const filters = (e:any) => {
    //     const keyWord = e.target.value
	// 	const results = nftFluf.filter((fluf: any) => {
	// 		let result = false
	// 		if(fluf.traits)
    //         return fluf.tokenId == keyWord
    //     });
    //     setSearchById(results);
	// 	setnftId(keyWord);
    // }

	useEffect(() => {
		const dataArray: any = [];
		const getnftFluf = async () => {
			setLoading(true);
			await axios
				.get(
					process.env.ITRM_SERVICE  +
						"/fluf/collection?from=0&size=10000"
				)
				.then((response) => {
					setnftFluf(response.data);
					setLoading(false);
					setPageLenght(Math.trunc(response.data.length / 10 + 1));
					setControlPageIndex(0);
				})
				// .then((response) => {
				// 	Object.entries(response.data).forEach(([key, value]) => {
				// 		dataArray.push(value);
				// 	});
				// })
				// .then(() => {
				// 	setnftFluf(dataArray);
				// })
				.catch((error) => {
					console.log(error);
				});
		};
		getnftFluf().catch((e) => console.log(e));
	}, []);

	useEffect(() => {
		const getnftFlufGlobal = async () => {
            setnftFlufGlobal(
                    (
                        await axios.get(
							process.env.ITRM_SERVICE +
                            "/fluf/globalData"
				        )
                    ).data
                )
		};
		getnftFlufGlobal();
	}, []);

	const dataFluf = () => {
		const flufs: any = [];
		for (
			let index: number = controlPageIndex * 10;
			index < controlPageIndex * 10 + 20;
			index++
		) {
			if (!nftFluf[index]) return flufs;
			flufs.push(
				<NftCard 
					image={nftFluf[index]["images"]["image_small"]}
					text="Estimated Price: "
					value={nftFluf[index]["floor_adjusted_predicted_price"]}
				/>
			)
		}
		return flufs;
	}
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
					<div className="flex border-t border-l border-white/10 rounded-3xl shadowDiv p-5 bg-opacity-30 justify-between bg-[#F9FAFB]">
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
						<div className="flex border-t border-l border-white/10 shadow-blck rounded-xl p-3 bg-[#D4D7DD] bg-opacity-30 w-1/4  justify-between pt-5 pb-5">
							<div className="flex flex-col ">
								<p className={styleContent}>
									FLOOR :
								</p>
								<p className={styleContent}>
									TRADING VOLUME :
								</p>
								<p className={styleContent}>
									MCAP :
								</p>
								<p className={styleContent}>
									OWNERS :
								</p>
							</div>
							<div className="items-end">
								<p className={styleContent}>
                                    {nftFlufGlobal.stats?.floor_price}
								</p>
								<p className={styleContent}>
                                    {nftFlufGlobal.stats?.total_volume}
								</p>
								<p className={styleContent}>
                                    {nftFlufGlobal.stats?.market_cap}
								</p>
								<p className={styleContent}>
									{nftFlufGlobal.stats?.num_owners}
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
					<div className="grid grid-cols-3 content-center justify-items-center w-full">
						{controlPageIndex === 0 ? (
							<div></div>
						) : (
							<button
								type="button"
								className="py-2.5 px-5 mr-2 mb-2 text-sm font-small focus:outline-none rounded-lg border text-grey-content font-plus bg-[#ECEEF8] hover:text-white hover:bg-gray-700"
								onClick={() => {
									setControlPageIndex(controlPageIndex - 1);
								}}
							>
								{"< Prev Page"}
							</button>
						)}
						<h3 className="text-lg text-grey-content">
							{controlPageIndex + 1 + "/" + pageLenght}
						</h3>
						{controlPageIndex === pageLenght - 1 ? (
							<div></div>
						) : (
							<button
								type="button"
								className="py-2.5 px-5 mr-2 mb-2 text-sm font-small focus:outline-none rounded-lg border text-grey-content font-plus bg-[#ECEEF8] hover:bg-gray-200"
								onClick={() => {
									setControlPageIndex(controlPageIndex + 1);
								}}
							>
								{"Next Page >"}
							</button>
						)}
						<div className="w-full col-span-3 grid grid-cols-2 mb-7">
							<button
								type="button"
								className="py-2.5 px-5 mr-2 mb-2 text-sm font-small focus:outline-none rounded-lg border text-grey-content font-plus bg-[#ECEEF8] hover:bg-gray-200 h-full"
								onClick={() => {
									if (!pageSearcher) return;
									if (pageSearcher >= 1 && pageSearcher <= pageLenght) {
										setControlPageIndex(pageSearcher - 1);
									}
								}}
							>
								{"Search by Number of Page:"}
							</button>
							<input
								type="number"
								id="page"
								className="border text-sm rounded-lg block w-full p-2.5 text-grey-content font-plus bg-[#ECEEF8] hover:bg-gray-200 placeholder-gray-400 focus:outline-none"
								placeholder={`1 - ${pageLenght}`}
								required
								value={pageSearcher}
								onChange={(event) => {
									setPageSearcher(parseInt(event.target.value));
								}}
							/>
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
							<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 xs:gap-2 sm:gap-5 w-full">
								{/* {nftFluf.map((fluf: any, key:any) => {
									return (
										<NftCard
											key={key}
											image={fluf.images.image_small}
											text="Estimated Price: "
											value={fluf.tokenId}
										/>	
									)
								})} */}
								{dataFluf()}
							</div>
							
						)
					}
					
				</div>
			</div>
		</>
	);
};

export default Home;
