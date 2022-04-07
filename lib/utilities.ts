import { supportedChains } from './chains'
import { stakingPools } from './pools'
import { IChainData, IPoolData } from './types'

export function getChainData(
  chainId: number | undefined
): IChainData | undefined {
  if (!chainId) {
    return
  }

  const chainData = supportedChains.filter(
    (chain: IChainData) => chain.chainId === chainId
  )[0]

  return chainData
}

export function ellipseAddress(address = '', width = 5): string {
  if (!address) {
    return ''
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`
}

export function getPoolData(poolId: number | undefined): IPoolData {
  const poolData = stakingPools.filter((pool) => pool.id === poolId)[0]

  return poolData
}

export const formatMetaverseName = (
  metaverseName: string,
  uppercase?: boolean
) => {
  const nameArray = metaverseName.split('-')
  const formattedName = nameArray
    .map((word, i) => {
      if (uppercase) return word.toUpperCase()
      return word[0].toUpperCase() + word.substring(1)
    })
    .join(' ')
  return formattedName
}

export const getState = (state: string, stateOptions: string[]) => {
  return stateOptions.map((option) => state === option)
}

/**
 * @returns Array of Object keys with their proper types. Use this instead of Object.keys
 */
export function typedKeys<O extends object, K extends keyof O = keyof O>(
  obj: O
): K[] {
  return Object.keys(obj) as K[]
}
