import { useRouter } from 'next/dist/client/router';
import Link from "next/link"
import { RiHome6Line } from "react-icons/ri"
import { IoIosSwap,IoIosBody,IoMdTrophy } from "react-icons/io"
import { AiFillHome, AiOutlinePicture } from "react-icons/ai"
import { VscLock } from "react-icons/vsc"
import { MdOutlineCollections, MdOutlineAttachMoney } from "react-icons/md"
import {FaHandHoldingUsd} from "react-icons/fa"


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
                return <AiFillHome className={`text-4xl z-10 ${focus && "text-grey-icon"} group-hover:text-grey-icon`} />
            case "/swap":
                return <IoIosSwap className={`text-4xl z-10 ${focus && "text-grey-icon"} group-hover:text-grey-icon`} />
            case "/liquidity":
                return <FaHandHoldingUsd className={`text-4xl z-10 ${focus && "bg-slate-600 text-grey-icon"} group-hover:text-grey-icon`} />
            case "/stake": case "/stake-ethereum": case "stake-polygon":
                return <VscLock className={`text-4xl z-10 ${focus && "text-grey-icon"} group-hover:text-grey-icon`} />
            case "https://snapshot.org/#/metagamehub.eth" || "/pools":
                return <MdOutlineCollections className={`text-4xl z-10 ${focus && "text-grey-icon"} group-hover:text-grey-icon`} />
            case "/valuation":
                return <MdOutlineAttachMoney className={`text-4xl z-10 ${focus && "text-grey-icon"} group-hover:text-grey-icon`} />
            case "/nftValuation":
                return <AiOutlinePicture className={`text-4xl z-10 ${focus && "text-grey-icon"} group-hover:text-grey-icon`} />
            case "https://eth-india-hackaton-git-pushnotifications-dap-frontend.vercel.app/":
                return <IoMdTrophy  className={`text-4xl z-10 ${focus && "text-grey-icon"} group-hover:text-grey-icon`}/>    
            case "https://avatar-generator-metagamehub.vercel.app/?campaign=decentraland":
                return <IoIosBody className={`text-4xl z-10 ${focus && "text-grey-icon"} group-hover:text-grey-icon`}/>

        }
    }

    return (
        <>
            <Link href={link}>
                <a className={`${focus ? "  shadowNavItem" : "shadowNormal"} hover:shadowNavItem relative flex items-center rounded-xl px-3 py-3 text-grey-icon w-full `}>
                    <div className={`${focus ? "shadowNavItem" : "shadowNormal"} hidden h-full w-full absolute  rounded-xl blur-xl`} />
                    {getIcon(link)}
                    {/* <span className="pt-1.5 z-10">{text}</span> */}
                </a>
            </Link>

        </>
    )
}


export default NavItem
