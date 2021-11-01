import "animate.css"
import { useState } from "react";

import { IoIosArrowDown } from "react-icons/io"
import NavItem from './NavItem';


const Layout = ({ children }: any) => {
    const [open, setOpen] = useState(false)
    const [network, setNetwork] = useState("Ethereum")

    return (
        <>
            <div className="flex flex-col w-screen h-screen bg-grey-darkest">

                <div className="flex space-x-10 h-1/6 w-full items-center justify-between p-10">
                    <a href="/" className="hover:scale-110 transition-all duration-500 ease-in-out">
                        <img src="/images/mgh_logo.png" className={`h-18 w-18`} />
                    </a>

                    <div className="flex space-x-10">
                        <div className="relative">
                            <div onClick={() => setOpen(!open)} className={`${open ? "text-gray-200" : "text-gray-600 hover:text-gray-200"} relative w-52 flex items-center justify-between cursor-pointer  transition ease-in-out duration-300 font-medium text-xl rounded-xl p-3 px-4 bg-white bg-opacity-5 group shadow-black overflow-hidden`}>
                                <div className="h-full w-full absolute bg-gradient-to-br from-grey-dark to-grey-darkest rounded-xl blur-xl" />
                                <div className="flex space-x-3">
                                    <img src={`${network === "Ethereum" ? "/images/ethereum-eth-logo.png" : "/images/polygon-matic-logo.png"}`} className="h-8 w-8 z-10" />
                                    <span className="pt-1 z-10 text-gray-200">{network}</span>
                                </div>
                                <IoIosArrowDown className="z-10 text-2xl mt-0.5" />
                            </div>
                            {open &&
                                <div className="absolute -bottom-32 h-32 w-full rounded-xl p-5 space-y-5 font-medium bg-grey-darkest bg-opacity-80 z-50 overflow-hidden flex flex-col justify-center items-start">
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


                        <div className="relative w-52 flex items-center justify-center cursor-pointer text-gray-200 font-medium text-xl rounded-xl p-3 px-5 bg-white bg-opacity-5 group shadow-black hover:scale-105 overflow-hidden transition ease-in-out duration-500">
                            <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl blur-2xl group-hover:blur-xl" />
                            <span className="pt-1 z-10">Connect Wallet</span>
                        </div>
                    </div>

                </div>



                <div className="flex w-full justify-end h-full">
                    <div className="h-full w-1/6 flex flex-col items-start p-5">
                        <li className="space-y-6 w-full">

                            <NavItem text="Home" link="/" />
                            <NavItem text="Swap" link="/swap" />
                            <NavItem text="Liquidity" link="/stake" />
                            <NavItem text="NFT Pools" link="/pools" />
                            <NavItem text="LAND Valuation" link="/valuation" />

                        </li>

                    </div>

                    <main className="w-5/6 h-full animate__animated animate__slideInRight grid grid-cols-2 gap-10 border-l border-t border-opacity-10 rounded-tl-3xl self-end bg-gradient-to-br from-grey-dark to-grey-darkest shadow-black p-10">
                        {children}
                    </main>

                </div>

            </div>


        </>
    )
}


export default Layout
