import "animate.css"
import { useState } from "react";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"


const NetworkButton = () => {
    const [open, setOpen] = useState(false)
    const [network, setNetwork] = useState("Ethereum")

    return (
        <>
            <div className="relative scale-90 xl:scale-100 z-20">
                <div onClick={() => setOpen(!open)} className={`${open ? "text-gray-200" : "text-gray-600 hover:text-gray-200"} relative w-52 flex items-center justify-between cursor-pointer  transition ease-in-out duration-300 font-medium text-xl rounded-xl p-3 px-4 bg-white bg-opacity-5 group shadow-black overflow-hidden`}>
                    <div className="h-full w-full absolute bg-gradient-to-br from-grey-dark to-grey-darkest rounded-xl blur-xl" />
                    <div className="flex space-x-3">
                        <img src={`${network === "Ethereum" ? "/images/ethereum-eth-logo.png" : "/images/polygon-matic-logo.png"}`} className="h-8 w-8 z-10" />
                        <span className="pt-1 z-10 text-gray-200">{network}</span>
                    </div>
                    <IoIosArrowUp className="block md:hidden z-10 text-2xl mt-0.5" />
                    <IoIosArrowDown className="hidden md:block z-10 text-2xl mt-0.5" />
                </div>
                {open &&
                    <div className="absolute md:-bottom-32 bottom-auto -top-32 md:top-auto h-32 w-full rounded-xl p-5 space-y-5 font-medium bg-grey-darkest bg-opacity-40 backdrop-filter backdrop-blur z-50 overflow-hidden flex flex-col justify-center items-start">
                        <div onClick={() => { setNetwork("Ethereum"); setOpen(false) }} className={`flex items-center cursor-pointer ${network === "Ethereum" ? "opacity-100" : "opacity-70 hover:opacity-100"}`}>
                            <img src="/images/ethereum-eth-logo.png" className="h-8 w-8 z-10" />
                            <span className="pt-1 z-10 text-gray-200 px-4 ">Ethereum</span>
                        </div>

                        <div onClick={() => { setNetwork("Polygon"); setOpen(false) }} className={`flex items-center cursor-pointer ${network === "Ethereum" ? "opacity-70 hover:opacity-100" : "opacity-100"}`}>
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
