import { Network } from "./enums";

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
    symbol: string
    name: string
    decimals: string
    contractAddress: string
    balance?: string
}

export interface IChainData {
    name: string
    short_name: string
    chain: string
    network: string
    chain_id: number
    network_id: number
    rpc_url: string
    native_currency: IAssetData
}