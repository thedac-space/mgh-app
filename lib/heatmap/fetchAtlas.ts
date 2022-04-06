import { Contracts } from '../contracts'
import { Metaverse } from '../enums'
import { typedKeys } from '../utilities'
import { ValuationTile } from './heatmapCommonTypes'
import { heatmapMvOptions } from './heatmapMvOptions'

export const fetchAtlas = async (
  metaverse: Metaverse,
  setLandsLoaded: React.Dispatch<React.SetStateAction<number>>
) => {
  const valuationAtlas: Record<string, ValuationTile> = {}
  await Promise.all(
    [...Array(Math.ceil(heatmapMvOptions[metaverse].lands / 500))].map(
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
        setLandsLoaded((prev) => prev + 500)
      }
    )
  )
  console.log('done!!')
  console.log(valuationAtlas)
  return valuationAtlas
  // await setColours(valuationAtlas, 'predicted_price')
}
