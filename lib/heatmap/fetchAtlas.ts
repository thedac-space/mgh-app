import { Metaverse } from '../metaverse'
import { typedKeys } from '../utilities'
import { AtlasTile, ValuationTile } from './heatmapCommonTypes'
import { heatmapMvOptions, heatmapMvLandsPerRequest } from './heatmapMvOptions'

export const fetchITRMAtlas = async (
    metaverse: Metaverse,
    setLandsLoaded: React.Dispatch<React.SetStateAction<number>>
) => {
    const valuationAtlas: Record<string, ValuationTile> = {}
    const LANDS_PER_REQUEST = heatmapMvLandsPerRequest[metaverse].lands
    const metaverseAddress = getMetaverseAddress(metaverse)
    await Promise.all(
        [
            ...Array(
                Math.ceil(heatmapMvOptions[metaverse].lands / LANDS_PER_REQUEST)
            ),
        ].map(async (_, i) => {
            try {
                // Getting valuations from ITRM
                let valuationRes: any = await fetch(
                    `https://services.itrmachines.com/${metaverse}/map?from=${i * LANDS_PER_REQUEST
                    }&size=${LANDS_PER_REQUEST}&reduced=true`
                )
                valuationRes = await valuationRes.json()
                const tokenIds: any = Object.keys(valuationRes)
                if (tokenIds.length == 0) {
                    return Array(1).fill(1)
                }
                //console.log(arr);
                let ores: any
                let cnt: any = 0
                if (metaverseAddress !== 'None') {
                    do {
                        try {
                            let urlOpensea =
                                'https://services.itrmachines.com/test-opensea/service/getTokens'
                            let data = {
                                collection: metaverseAddress,
                                tokenIds: tokenIds,
                            }
                            ores = await fetch(urlOpensea, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),
                            })
                            ores = await ores.json()
                            for (let value of ores.results) {
                                let pred_price =
                                    valuationRes[value.token_id].predicted_price
                                if (value.current_price) {
                                    valuationRes[
                                        value.token_id
                                    ].current_price_eth = value.current_price
                                            ? value.current_price.eth_price
                                            : undefined
                                    valuationRes[value.token_id].percent =
                                        value.current_price
                                            ? 100 *
                                            (value.current_price.eth_price /
                                                pred_price -
                                                1)
                                            : undefined
                                }
                                valuationRes[
                                    value.token_id
                                ].best_offered_price_eth = value.best_offered_price
                                        ? value.best_offered_price.eth_price
                                        : undefined
                            }
                        } catch (error) {
                            ores = undefined
                            cnt = cnt + 1
                            console.log('Error trying again...', error)
                        }
                    } while (ores == undefined && cnt < 10)
                }
                const valuations = valuationRes as Record<
                    string,
                    ValuationTile | undefined
                >
                //console.log(valuations);
                // Mapping through those valuations
                typedKeys(valuations).map((key) => {
                    {
                        // Making a name to fit with our tile map
                        let name = ""
                        if (valuations[key]?.coords) {
                            name =
                                valuations[key]?.coords.x +
                                ',' +
                                valuations[key]?.coords.y
                        } else {
                            name =
                                valuations[key]?.center.x +
                                ',' +
                                valuations[key]?.center.y
                        }
                        // // Setting the land info in the valuation atlas
                        valuationAtlas[name] = valuations[key]!
                        valuationAtlas[name].land_id = key
                    }
                })
            } catch (e) {
                console.log('error', e)
                return Array(1).fill(1)
            }
            setLandsLoaded((prev) =>
                heatmapMvOptions[metaverse].lands < prev + LANDS_PER_REQUEST
                    ? heatmapMvOptions[metaverse].lands
                    : prev + LANDS_PER_REQUEST
            )
        })
    )
    return valuationAtlas
}

export const fetchDecentralandAtlas = async () => {
    const resp = await fetch('https://api.decentraland.org/v1/tiles')
    const json = await resp.json()
    return json.data as Record<string, AtlasTile> | undefined
}

export const getMetaverseAddress = (metaverse: Metaverse) => {
    let res = ''
    switch (metaverse) {
        case 'sandbox':
            res = '0x5cc5b05a8a13e3fbdb0bb9fccd98d38e50f90c38'
            break
        case 'decentraland':
            res = '0xF87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d'
            break
        default:
            res = 'None'
            break
    }
    return res
}

export const sliceIntoChunks = (arr: string[], chunkSize: number) => {
    const res = []
    for (let index = 0; index < arr.length; index += chunkSize) {
        const chunk = arr.slice(index, index + chunkSize)
        res.push(chunk)
    }
    return res
}
