import "animate.css"
import { useState } from "react";

import NavItem from './NavItem';
import NetworkButton from "./NetworkButton"
import WalletButton from "./WalletButton"

import { HiMenuAlt4 } from "react-icons/hi"
import { MdClose } from "react-icons/md"


const SmallScreenToolbar = () => {
    const [openSidebar, setOpenSidebar] = useState(false)

    return (
        <>

            <div className="flex space-x-10 xl:hidden h-20 md:h-24 w-full items-center justify-between p-5 z-20 fixed top-0 left-0 backdrop-filter backdrop-blur-none md:backdrop-blur-2xl">
                <a href="/" className="hover:scale-110 transition-all duration-500 ease-in-out backdrop-filter backdrop-blur-lg md:backdrop-blur-none rounded-full">
                    <img src="/images/mgh_logo.png" className={` h-12 w-12`} />
                </a>

                <div className="md:flex space-x-0 xl:space-x-10 hidden items-center flex-grow justify-end">
                    <NetworkButton />
                    <WalletButton />
                </div>

                <div className={`transform hover:scale-110 transition duration-300 ease-in-out text-gray-200 cursor-pointer backdrop-filter backdrop-blur-lg md:backdrop-blur-none rounded-full`} onClick={() => setOpenSidebar(!openSidebar)}>
                    {openSidebar ? <MdClose size={34} /> : <HiMenuAlt4 size={34} />}
                </div>

            </div>

            <nav className={`${openSidebar ? "animate__animated animate__fadeInRight" : "animate__animated animate__fadeOutUp hidden"} p-5 pt-24 md:pt-32 z-10 top-0 right-0 fixed h-screen backdrop-filter backdrop-blur-3xl bg-black bg-opacity-20 flex flex-col justify-between items-center`} >
                <div onClick={() => setOpenSidebar(!openSidebar)} className="space-y-1 md:space-y-4 flex flex-col w-full">
                    <NavItem text="Home" link="/" />
                    <NavItem text="Swap" link="/swap" />
                    <NavItem text="Liquidity" link="/stake" />
                    <NavItem text="NFT Pools" link="/pools" />
                    <NavItem text="LAND Valuation" link="/valuation" />
                </div>

                <div className="flex flex-col space-y-3 md:hidden">
                    <NetworkButton />
                    <WalletButton />
                </div>
            </nav>




        </>
    )
}


export default SmallScreenToolbar
