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


const Home: NextPage = ({ prices }: any) => {

    return (
        <>
            <Head>
                <title>MetaGameHub DAO</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
                {/* <meta name="robots" content="noodp,noydir" /> */}
            </Head>


        </>
    )
}


export default Home
