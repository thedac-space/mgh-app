import "animate.css"
import { useState } from "react";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { changeToEthereum, changeToPolygon } from "../state/network";
import { Network } from "../state/types";



const NetworkButton = () => {
    const [open, setOpen] = useState(false)

    const network = useAppSelector(state => state.network.value)
    const dispatch = useAppDispatch()
    

    return (
        <>
            <div className="relative scale-90 xl:scale-100 z-20">
                <div onClick={() => setOpen(!open)} className={`${open ? "text-gray-200" : "text-gray-600 hover:text-gray-200"} relative w-52 flex items-center justify-between cursor-pointer  transition ease-in-out duration-300 font-medium text-xl rounded-xl p-3 px-4 bg-white bg-opacity-5 group shadow-black overflow-hidden`}>
                    <div className="h-full w-full absolute bg-gradient-to-br from-grey-dark to-grey-darkest rounded-xl blur-xl" />
                    <div className="flex space-x-3">
                        <img src={`${network === Network.ETHEREUM ? "/images/ethereum-eth-logo.png" : "/images/polygon-matic-logo.png"}`} className="h-8 w-8 z-10" />
                        <span className="pt-1 z-10 text-gray-200">{network}</span>
                    </div>
                    <IoIosArrowUp className="block md:hidden z-10 text-2xl mt-0.5" />
                    <IoIosArrowDown className="hidden md:block z-10 text-2xl mt-0.5" />
                </div>
                {open &&
                    <div className="absolute md:-bottom-32 bottom-auto -top-32 md:top-auto h-32 w-full rounded-xl p-5 space-y-5 font-medium bg-grey-darkest bg-opacity-40 backdrop-filter backdrop-blur z-50 overflow-hidden flex flex-col justify-center items-start">
                        <div onClick={() => { dispatch(changeToEthereum()); setOpen(false) }} className={`flex items-center cursor-pointer ${network === Network.ETHEREUM ? "opacity-100" : "opacity-70 hover:opacity-100"}`}>
                            <img src="/images/ethereum-eth-logo.png" className="h-8 w-8 z-10" />
                            <span className="pt-1 z-10 text-gray-200 px-4 ">Ethereum</span>
                        </div>

                        <div onClick={() => { dispatch(changeToPolygon()); setOpen(false) }} className={`flex items-center cursor-pointer ${network === Network.ETHEREUM ? "opacity-70 hover:opacity-100" : "opacity-100"}`}>
                            <img src="/images/polygon-matic-logo.png" className="h-8 w-8 z-10" />
                            <span className="pt-1 z-10 text-gray-200 px-4 ">Polygon</span>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}


export default NetworkButton
