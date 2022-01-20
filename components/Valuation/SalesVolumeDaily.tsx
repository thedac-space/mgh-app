import React from 'react';
import { Metaverse } from '../../lib/enums';
import { getCollectionData, getETHExchangeValue } from '../../backend/services/openSeaDataManager'


interface SalesVolumeDailyProps {
    collectionName: any;
    one_day_volume: any;
}

interface SalesVolumeDailyState {
    stats: any;
}

const defaultProps = {
    collectionName: 'selected',
    one_day_volume: ''
}

class SalesVolumeDaily extends React.Component<SalesVolumeDailyProps, SalesVolumeDailyState>{

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

    async getCollectionData(){
        const {collectionName} = this.props;
        let stats;
        if(this.props.one_day_volume){
            stats = {
                one_day_volume: this.props.one_day_volume
            }
        } else {
           stats = await getCollectionData(collectionName);
        }
        
        const ethExchangeValue = await getETHExchangeValue();
        
        stats.one_day_volume_usd = stats.one_day_volume * ethExchangeValue.ethereum.usd;
        stats.one_day_volume_sand = (stats.one_day_volume * ethExchangeValue.ethereum.usd) / ethExchangeValue['the-sandbox'].usd;
        stats.one_day_volume_mana = (stats.one_day_volume * ethExchangeValue.ethereum.usd) / ethExchangeValue['decentraland'].usd;
       
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
        if(!this.props.one_day_volume && !this.props.collectionName) {
            const { one_day_volume, collectionName } = defaultProps;
            return (
                <>
                    <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                        <p className={`text-lg xl:text-xl font-medium text-gray-300`}>
                            We couldn't obtain Volume data for the {collectionName ? " "+collectionName : ""} collection. Check the <a href="https://opensea.io/collection" target="_blank" className="hover:underline text-pink-600">OpenSea Marketplace</a> for more information.
                        </p>
                    </div>
                </>
            );
        }
        
        return (
            <>
                <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                    <p className={`text-lg xl:text-xl font-medium text-gray-300`}>Daily volume: </p>

                    <div className={`flex space-x-4 items-center w-full justify-start py-2 h-full`}>
                        <img src="/images/ethereum-eth-logo.png" className="rounded-full  h-9 md:h-10 w-9 md:w-10 p-1 shadow-button" />
                        <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                            {this.state.stats.one_day_volume?.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="font-light text-lg md:text-xl">ETH</span>
                        </p>
                    </div>

                    <div className={`flex space-x-4 items-center w-full justify-start py-2 h-full`}>
                        <img src="/images/usd-coin-usdc-logo.png" className="rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button" />
                        <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                            {this.state.stats.one_day_volume_usd?.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="font-light text-lg md:text-xl">USDC</span>
                        </p>
                    </div>

                    {this.props.collectionName === Metaverse.SANDBOX && (
                        <div className={`flex space-x-4 items-center w-full justify-start py-2 h-full`}>
                            <img src="/images/the-sandbox-sand-logo.png" className="rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button" />
                            <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                                {this.state.stats.one_day_volume_sand?.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="font-light text-lg md:text-xl">SAND</span>
                            </p>
                        </div>
                    )}

                    {this.props.collectionName === Metaverse.DECENTRALAND && (
                        <div className={`flex space-x-4 items-center w-full justify-start py-2 h-full`}>
                            <img src="/images/decentraland-mana-logo.png" className="rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button" />
                            <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                                {this.state.stats.one_day_volume_mana?.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="font-light text-lg md:text-xl">MANA</span>
                            </p>
                        </div>
                    )}
                </div>
            </>
        )
    }
}

export default SalesVolumeDaily;