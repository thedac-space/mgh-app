import "animate.css"
import { useState } from "react";

import NavItem from './NavItem';
import NetworkButton from "./NetworkButton"
import WalletButton from "./WalletButton"

import { HiMenuAlt4 } from "react-icons/hi"
import { MdClose } from "react-icons/md"


const Layout = ({ children }: any) => {
    const [openSidebar, setOpenSidebar] = useState(false)

    return (
        <>
            <div className="flex flex-col w-screen h-full xl:h-screen pt-20 xl:pt-0 bg-grey-darkest">

                <div className="hidden xl:flex space-x-10 h-32 w-full items-center justify-between p-10">
                    <a href="/" className="hover:scale-110 transition-all duration-500 ease-in-out">
                        <img src="/images/mgh_logo.png" className={` h-18 w-18`} />
                    </a>

                    <div className="flex space-x-10">
                        <NetworkButton />
                        <WalletButton />
                    </div>
                </div>



                <div className="flex space-x-10 xl:hidden h-20 md:h-24 w-full items-center justify-between p-10 z-20 fixed top-0 left-0 backdrop-filter backdrop-blur-2xl bg-black bg-opacity-10">
                    <a href="/" className="hover:scale-110 transition-all duration-500 ease-in-out">
                        <img src="/images/mgh_logo.png" className={` h-12 w-12`} />
                    </a>

                    <div className="md:flex space-x-0 xl:space-x-10 hidden items-center flex-grow justify-end">
                        <NetworkButton />
                        <WalletButton />
                    </div>

                    <div className={`transform hover:scale-110 transition duration-300 ease-in-out text-gray-200 cursor-pointer`} onClick={() => setOpenSidebar(!openSidebar)}>
                        {openSidebar ? <MdClose size={34} /> : <HiMenuAlt4 size={34} />}
                    </div>

                </div>

                <nav className={`${openSidebar ? "animate__animated animate__fadeInRight" : "animate__animated animate__fadeOutUp hidden"} p-5 pt-24 md:pt-32 z-10 top-0 right-0 fixed h-screen backdrop-filter backdrop-blur-2xl bg-black bg-opacity-10 flex flex-col justify-between items-center`} >
                    <div onClick={() => setOpenSidebar(!openSidebar)} className="space-y-1 md:space-y-4 flex flex-col w-full">
                        <NavItem text="Home" link="/" />
                        <NavItem text="Swap" link="/swap" />
                        <NavItem text="Liquidity" link="/stake" />
                        <NavItem text="NFT Pools" link="/pools" />
                        <NavItem text="LAND Valuation" link="/valuation" />
                    </div>

                    <div className="flex flex-col space-y-3 md:hidden">
                        <NetworkButton/>
                        <WalletButton />
                    </div>
                </nav>



                <div className="flex w-full justify-end h-full">

                    <div className="hidden xl:flex h-full w-1/6 max-w-sm min-w-max flex-col items-start p-5 pt-16">
                        <div className="space-y-6 flex flex-col w-full">
                            <NavItem text="Home" link="/" />
                            <NavItem text="Swap" link="/swap" />
                            <NavItem text="Liquidity" link="/stake" />
                            <NavItem text="NFT Pools" link="/pools" />
                            <NavItem text="LAND Valuation" link="/valuation" />
                        </div>
                    </div>

                    <main className="w-full h-full flex-grow overflow-scroll overscroll-contain animate__animated animate__slideInRight grid grid-cols-2 gap-10 border-l border-t border-opacity-10 rounded-none xl:rounded-tl-3xl self-end bg-gradient-to-br from-grey-dark to-grey-darkest shadow-black p-10">
                        {children}
                    </main>

                </div>

            </div>


        </>
    )
}


export default Layout
