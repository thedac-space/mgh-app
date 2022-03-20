import { Fade } from 'react-awesome-reveal'
import { Metaverse } from '../../lib/enums'
import { IWatchListCard, LandsKey } from '../../lib/valuation/valuationTypes'
import LandItem from './LandItem'

interface Props {
  lands: IWatchListCard[]
  removeFromWatchList: (landId: string, metaverse: Metaverse) => Promise<void>
}
const LandList = ({ lands, removeFromWatchList }: Props) => {
  const keys = Object.keys(lands) as LandsKey[]
  return (
    <ul className='w-full flex lg:flex-col flex-wrap justify-center gap-4'>
      <Fade duration={550} className='w-full flex justify-center'>
        {lands.map((land) => (
          <LandItem
            remove={removeFromWatchList}
            apiData={land.apiData}
            predictions={land.predictions}
            key={land.apiData?.tokenId}
            currentPrice={land.currentPrice}
          />
        ))}
      </Fade>
    </ul>
  )
}

export default LandList
