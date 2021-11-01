import { useEffect, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from "next/link"
import "animate.css"
import { RiHome6Line, RiMoneyDollarCircleLine } from "react-icons/ri"
import { IoIosSwap, IoIosArrowDown } from "react-icons/io"
import { VscLock } from "react-icons/vsc"
import { MdOutlineCollections, MdOutlineAttachMoney } from "react-icons/md"
import { BsQuestionCircle } from "react-icons/bs"
import { HiOutlineSearch } from "react-icons/hi"
import Valuation from '../components/Valuation';
import { useRouter } from 'next/dist/client/router';


const NavItem = ({ text, link }: any) => {
    const router = useRouter()

    const focus = router.pathname === link

    function getIcon(link: any) {

        switch (link) {
            case "/":
                return <RiHome6Line className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
            case "/swap":
                return <IoIosSwap className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
            case "/stake":
                return <VscLock className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
            case "/pools":
                return <MdOutlineCollections className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
            case "/valuation":
                return <MdOutlineAttachMoney className={`text-2xl mr-4 z-10 ${focus && "text-pink-600"} group-hover:text-pink-600`} />
        }
    }

    return (
        <>
            <Link href={link}>
                <a className={`${focus ? "shadow-black text-gray-200 " : "text-gray-500"} hover:text-gray-200 hover:shadow-black relative overflow-hidden flex items-center font-medium text-xl rounded-xl p-3 w-full group `}>
                    <div className={`${focus ? "opacity-100" : "opacity-0"} group-hover:opacity-100 h-full w-full absolute bg-gradient-to-br from-grey-dark to-grey-darkest rounded-xl blur-xl`} />
                    {getIcon(link)}
                    <span className="pt-1.5 z-10">{text}</span>
                </a>
            </Link>

        </>
    )
}


export default NavItem
