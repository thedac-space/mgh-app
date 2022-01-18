import { useState } from "react";
const ScoreBox = ()=>{

    return (
        <>
            <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                <div>
                    <i></i>
                    <span>liked!</span>
                </div>

                <div>
                    <i></i>
                    <span>NOT liked!</span>
                </div>

                {/* <p className={`text-lg xl:text-xl font-medium text-gray-300`}>
                    We couldn't obtain Volume data for the selected NFT id{nftID ? " "+nftID : ""}. Contact the <a href="https://market.oceanprotocol.com/asset/did:op:8331D69bF312604542D5f5f41D859dA27568B7cd" target="_blank" className="hover:underline text-pink-600">Ocean Marketplace</a> for more information.
                </p> */}
            </div>
        </>
    );
    
};


export default ScoreBox;