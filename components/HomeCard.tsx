import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import "animate.css"
import Link from "next/link";


const HomeCard = ({ image, link, text }: any) => {

    return (
        <>

            <Link href={link}>
                <a className="flex flex-col space-y-3 items-start border border-opacity-0 hover:border-opacity-0 transition ease-in-out duration-500 hover:scale-105 shadow-black rounded-xl w-full bg-grey-dark bg-opacity-30 text-left">
                    <img src={image} className="rounded-t-lg shadow-colorbottom" />
                    <p className="text-gray-200 leading-tight px-3 pb-3 text-base xs:text-xs sm:text-base">{text}</p>
                </a>
            </Link>

        </>
    )
};


export default HomeCard;
