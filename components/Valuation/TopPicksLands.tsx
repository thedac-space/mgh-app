import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Metaverse } from "../../lib/metaverse";
import axios from "axios";
import { RiLoader3Fill } from "react-icons/ri";

interface Props {
	metaverse: Metaverse;
}

const TopPicksLands = ({ metaverse }: Props) => {
	const [loading, setLoading] = useState(true);
	const [picks, setPicks] = useState([]);
	const [controlPageIndex, setControlPageIndex] = useState<number>(0);
	const [pageLenght, setPageLenght] = useState(0);
	const [pageSearcher, setPageSearcher] = useState<number>();

	useEffect(() => {
		const setData = async () => {
			setLoading(true);

			await axios
				.get(process.env.ITRM_SERVICE + "/val-analytics/topPicks", {
					params: { metaverse: metaverse },
				})
				.then((response) => {
					setPicks(response.data);
					setLoading(false);
					setPageLenght(Math.trunc(response.data.length / 10 + 1));
					setControlPageIndex(0);
				})
				.catch((error) => {
					console.log(error);
				});
		};
		setData().catch((e) => console.log(e));
	}, [metaverse]);

	const rowDataStyle =
		"flex justify-start px-4 content-center items-center text-sm lg:text-2xl font-medium md:text-base pt-0.5 w-1/5";

	const rowData = () => {
		const rows: any = [];
		for (
			let index: number = controlPageIndex * 10;
			index < controlPageIndex * 10 + 10;
			index++
		) {
			if (!picks[index]) return rows;
			rows.push(
				<tr
					key={index}
					className="flex w-full mb-4 text-grey-content font-plus"
				>
					<td className="flex justify-start px-4 content-center w-1/5 relative">
						<div className="relative lg:h-12 lg:w-12 md:h-8 md:w-8 bg-white rounded-full border mb-4 mt-4 w-6 h-6">
							<Image
								src={picks[index]["images"]["image_url"]}
								layout="fill"
								className="rounded-full"
								alt="land image"
								loading="lazy"
							/>
						</div>
					</td>
					<td className="flex justify-start px-4 content-center items-center text-sky-400 pt-0.5 w-1/5 hover:underline">
						<a
							className="text-sm lg:text-2xl font-medium md:text-base"
							href={picks[index]["external_link"]}
						>
							{picks[index]["coords"]
								? `(x:${picks[index]["coords"]["x"]}, y:${picks[index]["coords"]["y"]})`
								: picks[index]["center"]
								? `(${picks[index]["name"]})`
								: `no-asset`}
						</a>
					</td>
					<td className={rowDataStyle}>
						<span>
							{parseFloat(picks[index]["current_price_eth"]).toFixed(2)}
						</span>
					</td>
					<td className={rowDataStyle}>
						<span>
							{parseFloat(picks[index]["eth_predicted_price"]).toFixed(2)}
						</span>
					</td>
					<td className={rowDataStyle}>
						<span>{parseFloat(picks[index]["gap"]).toFixed(2)}%</span>
					</td>
				</tr>
			);
		}
		return rows;
	};

	return (
		<div className="flex flex-col items-start mb-10">
			{loading ? (
				<p className="text-grey-content flex gap-2">
					Loading Top Picks{" "}
					<RiLoader3Fill className="animate-spin-slow h-5 w-5 xs:h-6 xs:w-6" />
				</p>
			) : (
				<>
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
								id="phone"
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
					<table className="w-full table-fixed border-collapse">
						<thead className="bg-transparent text-slate-200 w-full">
							<tr className="flex w-full mb-4 text-left text-grey-content font-plus bg-[#ECEEF8] rounded-lg">
								<th className="p-4 w-1/5 text-xs lg:text-lg md:text-base ">
									Land
								</th>
								<th className="p-4 w-1/5 text-xs lg:text-lg md:text-base ">
									Coord
								</th>
								<th className="p-4 w-1/5 text-xs lg:text-lg md:text-base ">
									Current price
								</th>
								<th className="p-4 w-1/5 text-xs lg:text-lg md:text-base ">
									Predicted price
								</th>
								<th className="p-4 w-1/5 text-xs lg:text-lg md:text-base">
									Gap
								</th>
							</tr>
						</thead>
						<tbody className="bg-transparent flex flex-col items-center justify-between overflow-y-scroll w-full h-[50vh] md:h-[30vh] scrollbar--y scrollbar overflow-x-hidden">
							{rowData()}
						</tbody>
					</table>
				</>
			)}
		</div>
	);
};

export default TopPicksLands;
