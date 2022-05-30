import { Metaverse } from '../../lib/enums'

export interface ChartInfo {
  data: number
  time: string
}

export const fetchChartData = async (metaverse: Metaverse, route: string) => {
  const response = await fetch(
    'https://services.itrmachines.com/val-analytics/' +
      route +
      '?metaverse=' +
      metaverse
  )
  const data = (await response.json()) as ChartInfo[]
  return data
}
