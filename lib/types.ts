import { Metaverse, Network } from "./enums";

export interface NetworkState {
    value: Network
}

export interface AccountState {
    connected: boolean,
    address: string | undefined,
    chainId: number | undefined
}

export interface AddEthereumChainParameter {
    chainId: string; // A 0x-prefixed hexadecimal string
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string; // 2-6 characters long
        decimals: 18;
    };
    rpcUrls: string[];
}


export interface IAssetData {
    name: string
    symbol: string
    decimals: number
    contractAddress?: string
}

export interface IChainData {
    name: string,
    chainId: number,
    chainIdHex: string,
    rpcUrl: string,
    nativeCurrency: IAssetData,
    blockExplorer: string,
}

export interface IPoolData {
    id: number;
    name: string;
    APY: number | string;
    lockingMonth: number;
}

export interface IAPIData {
    metaverse: Metaverse;
    name: string;
    opensea_link: string;
    external_link: string;
    images: {
        image_url: string;
    };
    tokenId: number;
}

export interface IPredictions {
    ethPrediction: number;
    usdPrediction: number;
    sandPrediction?: number;
    manaPrediction?: number;
}