import React from 'react';
import {getCollectionData, getETHExchangeValue} from '../../backend/services/openSeaDataManager';
import { Metaverse } from '../../lib/enums';

interface FloorPriceCardProps {
    price: any;
    priceHistory: any;
    collectionName: any;
}

interface FloorPriceCardState {
    stats: any;
}

const defaultProps = {
    price: undefined,
    priceHistory: undefined,
    collectionName: 'selected'
}

class FloorPriceTracker extends React.Component<FloorPriceCardProps, FloorPriceCardState>{

    constructor(props:any) {
        super(props);
        this.state = {
            stats: {}
        }    
    }

    componentDidUpdate(prevProps:any) {
        if (prevProps.collectionName !== this.props.collectionName) {
          this.getCollectionData();
        }
    }

    /* async getCollectionData(){
        const {collectionName} = this.props;
        const stats = await getCollectionData(collectionName);
        this.setState({stats});
    } */

    async getCollectionData(){
        const {collectionName} = this.props;
        let stats;
        if(this.props.price){
            stats = {
                floor_price: this.props.price
            }
        } else {
           stats = await getCollectionData(collectionName);
        }
        
        const ethExchangeValue = await getETHExchangeValue();
        
        stats.floor_price_usd = stats.floor_price * ethExchangeValue.ethereum.usd;
        stats.floor_price_sand = (stats.floor_price * ethExchangeValue.ethereum.usd) / ethExchangeValue['the-sandbox'].usd;
        stats.floor_price_mana = (stats.floor_price * ethExchangeValue.ethereum.usd) / ethExchangeValue['decentraland'].usd;
       
        this.setState({stats});
    }
    
    componentDidMount() {
        this.getCollectionData();
    }

    getStat(name: string){

        if(this.state.stats){
            if(this.state.stats[name]) return this.state.stats[name];
            else return '-';
        } else {
            return "-";
        }
    }
    
    render() {
        if(!this.props.price && !this.props.priceHistory && !this.props.collectionName) {
            const { collectionName } = defaultProps;
            return (
                <>
                    <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                        <p className={`text-lg xl:text-xl font-medium text-gray-300`}>
                            We couldn't obtain floor price for the {collectionName} lands collection. Check <a href="https://opensea.io/collection" target="_blank" className="hover:underline text-pink-600">Open Sea Market</a> for more information.
                        </p>
                    </div>
                </>
            );
        }


        return (
            <>
                <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                    <p className={`text-lg xl:text-xl font-medium text-gray-300`}>Floor Price: </p>

                    <div className={`flex space-x-4 items-center w-full justify-start py-2 h-full`}>
                        <img src="/images/ethereum-eth-logo.png" className="rounded-full  h-9 md:h-10 w-9 md:w-10 p-1 shadow-button" />
                        <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                            {this.state.stats.floor_price?.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="font-light text-lg md:text-xl">ETH</span>
                        </p>
                    </div>

                    <div className={`flex space-x-4 items-center w-full justify-start py-2 h-full`}>
                        <img src="/images/usd-coin-usdc-logo.png" className="rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button" />
                        <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                            {this.state.stats.floor_price_usd?.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="font-light text-lg md:text-xl">USDC</span>
                        </p>
                    </div>

                    {this.props.collectionName === Metaverse.SANDBOX && (
                        <div className={`flex space-x-4 items-center w-full justify-start py-2 h-full`}>
                            <img src="/images/the-sandbox-sand-logo.png" className="rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button" />
                            <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                                {this.state.stats.floor_price_sand?.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="font-light text-lg md:text-xl">SAND</span>
                            </p>
                        </div>
                    )}

                    {this.props.collectionName === Metaverse.DECENTRALAND && (
                        <div className={`flex space-x-4 items-center w-full justify-start py-2 h-full`}>
                            <img src="/images/decentraland-mana-logo.png" className="rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button" />
                            <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                                {this.state.stats.floor_price_mana?.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="font-light text-lg md:text-xl">MANA</span>
                            </p>
                        </div>
                    )}
                </div>
            </>
        )

        /* if(this.props.price) return (
            <>
                <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                    <img src="/images/ethereum-eth-logo.png" className="h-18 sm:h-24 w-auto mb-8" />
                    Current Floor Price for the {this.props.collectionName} collection: {this.props.price? this.props.price: "CHANGE ME"} 
                    <br></br>Consult <a href="https://market.oceanprotocol.com/asset/did:op:8331D69bF312604542D5f5f41D859dA27568B7cd" target="_blank" className="hover:underline text-pink-600">Ocean Marketplace</a> for more information.
                </div>
            </>
        )

        if(this.props.priceHistory) return (
            <>
                <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                    <p className={`text-lg xl:text-xl font-medium text-gray-300`}>You can also buy the full dataset containing detailed raw data about The Sandbox LANDs NFTs on the <a href="https://market.oceanprotocol.com/asset/did:op:8331D69bF312604542D5f5f41D859dA27568B7cd" target="_blank" className="hover:underline text-pink-600">Ocean Marketplace</a>.</p>
                </div>
            </>
        )

        if(this.props.collectionName) {
            return (
                <>
                    <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                        <p className={`text-lg xl:text-xl font-medium text-gray-300`}>{this.props.collectionName} collection floor price: {this.getStat("floor_price")} </p>
                        <p className={`text-lg xl:text-xl font-medium text-gray-300`}>Contact the <a href="https://market.oceanprotocol.com/asset/did:op:8331D69bF312604542D5f5f41D859dA27568B7cd" target="_blank" className="hover:underline text-pink-600">Ocean Marketplace</a> for more information.</p>
                    </div>
                </>
            )
        } */
    }
}

export default FloorPriceTracker;
