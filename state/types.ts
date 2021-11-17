export enum Network {
    ETHEREUM = 'Ethereum',
    POLYGON = 'Polygon',
}

export enum Tokens {
    ETH = 'ETH',
    MGH = 'MGH',
    MMGH = 'mMGH',
    MGH_DATA = "MGH Data"
}

export interface NetworkState {
    value: Network
}

export interface AccountState {
    connected: boolean,
    address: string | undefined,
    chainId: string | undefined
}

export enum Provider {
    METAMASK = "metamask",
    WALLETCONNECT = "walletconnect"
}