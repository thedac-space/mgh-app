import { Metaverse } from '../enums'
import { typedKeys } from '../utilities'
import { AtlasTile, ValuationTile } from './heatmapCommonTypes'
import { heatmapMvOptions } from './heatmapMvOptions'

export const fetchITRMAtlas = async (
  metaverse: Metaverse,
  setLandsLoaded: React.Dispatch<React.SetStateAction<number>>
) => {
  const valuationAtlas: Record<string, ValuationTile> = {}
  await Promise.all(
    [...Array(Math.ceil(heatmapMvOptions[metaverse].lands / 500))].map(
      async (_, i) => {
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
        setLandsLoaded((prev) =>
          heatmapMvOptions[metaverse].lands < prev + 500
            ? heatmapMvOptions[metaverse].lands
            : prev + 500
        )
      }
    )
  )
  return valuationAtlas
}

export const fetchDecentralandAtlas = async () => {
  const resp = await fetch('https://api.decentraland.org/v1/tiles')
  const json = await resp.json()
  return json.data as Record<string, AtlasTile> | undefined
}
