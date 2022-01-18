import { useState } from "react";

interface SalesVolumeDailyProps {
    volume: any;
    nftID: any;
}

const defaultProps = {
    volume: undefined,
    nftID: undefined
}

const SalesVolumeDaily  = ({volume, nftID }: SalesVolumeDailyProps)=>{

    if(!volume && !nftID) {
        const { volume, nftID } = defaultProps;
        return (
            <>
                <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                    <p className={`text-lg xl:text-xl font-medium text-gray-300`}>
                        We couldn't obtain Volume data for the selected NFT id{nftID ? " "+nftID : ""}. Contact the <a href="https://market.oceanprotocol.com/asset/did:op:8331D69bF312604542D5f5f41D859dA27568B7cd" target="_blank" className="hover:underline text-pink-600">Ocean Marketplace</a> for more information.
                    </p>
                </div>
            </>
        );
    }

    if(volume) return (
        <>
            <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                <img src="/images/ethereum-eth-logo.png" className="h-18 sm:h-24 w-auto mb-8" />
                Current Floor Price for the NFT with id {nftID} : {volume? volume: "CHANGE ME"} 
                <br></br>Consult <a href="https://market.oceanprotocol.com/asset/did:op:8331D69bF312604542D5f5f41D859dA27568B7cd" target="_blank" className="hover:underline text-pink-600">Ocean Marketplace</a> for more information.
            </div>
        </>
    )

    
    if(nftID) return (
        <>
            <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                <p className={`text-lg xl:text-xl font-medium text-gray-300`}>Current Volume for NFT with id {nftID} : {volume? volume: "CHANGE ME"} </p>
                <p className={`text-lg xl:text-xl font-medium text-gray-300`}>Contact the <a href="https://market.oceanprotocol.com/asset/did:op:8331D69bF312604542D5f5f41D859dA27568B7cd" target="_blank" className="hover:underline text-pink-600">Ocean Marketplace</a> for more information.</p>
            </div>
        </>
    )

    
};


export default SalesVolumeDaily;