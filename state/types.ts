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
    connected: Boolean,
    provider: any
}