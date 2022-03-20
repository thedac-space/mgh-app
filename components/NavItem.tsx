import { useRouter } from 'next/dist/client/router';
import Link from "next/link"
import { RiHome6Line } from "react-icons/ri"
import { IoIosSwap } from "react-icons/io"
import { VscLock } from "react-icons/vsc"
import { MdOutlineCollections, MdOutlineAttachMoney } from "react-icons/md"
import {FaHandHoldingUsd} from "react-icons/fa"
import { BsBank } from 'react-icons/bs';


const NavItem = ({ text, link }: any) => {
    const router = useRouter()

    let focus = router.pathname === link
    if (router.pathname === "/stake-ethereum" || router.pathname === "/stake-polygon") {
        if (link === "/stake") {
            focus = true
        }
    }

    function getIcon(link: any) {

        switch (link) {
            case "/":
                return <RiHome6Line className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
            case "/swap":
                return <IoIosSwap className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
            case "/liquidity":
                return <FaHandHoldingUsd className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
            case "/stake": case "/stake-ethereum": case "stake-polygon":
                return <VscLock className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
            case "/pools":
                return <MdOutlineCollections className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
            case "/valuation":
                return <MdOutlineAttachMoney className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
            case "/stake-metaverse":
                return <BsBank className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
        }
    }

    return (
        <>
            <Link href={link}>
                <a className={`${focus ? "shadow-none xl:shadow-dark text-gray-200 bg-opacity-0 xl:bg-opacity-30" : "text-gray-400 xl:text-gray-500 bg-opacity-0"} hover:text-gray-200 bg-grey-dark xl:hover:bg-opacity-30 xl:hover:shadow-dark relative overflow-hidden flex items-center font-medium text-xl rounded-xl px-3 py-2 pr-8 w-full group `}>
                    <div className={`${focus ? "opacity-70" : "opacity-0"} hidden xl:bock group-hover:opacity-70 h-full w-full absolute bg-gradient-to-br from-grey-dark to-grey-darkest rounded-xl blur-xl`} />
                    {getIcon(link)}
                    <span className="pt-1.5 z-10">{text}</span>
                </a>
            </Link>

        </>
    )
}


export default NavItem
