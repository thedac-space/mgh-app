import { Contracts } from '../contracts'
import { Metaverse } from '../enums'
import { typedKeys } from '../utilities'
import { ValuationTile } from './heatmapCommonTypes'

export const fetchAtlas = async (metaverse: Metaverse) => {
  const mvOptions: Record<Metaverse, { lands: number }> = {
    sandbox: {
      lands: 166604,
    },
    decentraland: {
      lands: 90601,
    },
    'axie-infinity': { lands: 90601 },
  }
  const valuationAtlas: Record<string, ValuationTile> = {}
  // Getting all lands and dividing by 500 to make requests
  // for (
  //   let i = 0;
  //   i <= [...Array(Math.ceil(mvOptions[metaverse].lands / 500))].length;
  //   i++
  // )
  await Promise.all(
    [...Array(Math.ceil(mvOptions[metaverse].lands / 500))].map(
      async (_, i) => {
        console.log('fetching', i * 500)
        // 500 lands each time
        try {
          // Getting valuations from ITRM
          const valuationRes = await fetch(
            `https://services.itrmachines.com/${metaverse}/requestMap?from=${
              i * 500
            }&size=500`
          )
          const valuations = (await valuationRes.json()) as Record<
            string,
            ValuationTile | undefined
          >
          // Mapping through those valuations
          typedKeys(valuations).map((key) => {
            {
              // Making a name to fit with our tile map
              const name =
                valuations[key]?.coords.x + ',' + valuations[key]?.coords.y
              // // Setting the land info in the valuation atlas
              valuationAtlas[name] = valuations[key]!
            }
          })
        } catch (e) {
          console.log('error', e)
        }
      }
    )
  )
  console.log('done!!')
  console.log(valuationAtlas)
  return valuationAtlas
  // await setColours(valuationAtlas, 'predicted_price')
}
