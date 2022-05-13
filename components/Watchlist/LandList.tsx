import { Fade } from 'react-awesome-reveal'
import { Metaverse } from '../../lib/enums'
import { typedKeys } from '../../lib/utilities'
import {
  IWatchListCard,
  LandListAPIResponse,
  LandsKey,
} from '../../lib/valuation/valuationTypes'
import LandItem from './LandItem'

interface Props {
  lands: LandListAPIResponse
  removeFromWatchList: (landId: string, metaverse: Metaverse) => Promise<void>
}
const LandList = ({ lands, removeFromWatchList }: Props) => {
  return (
    <ul className='w-full flex lg:flex-col flex-wrap justify-center gap-4'>
      <Fade duration={550} className='w-full flex justify-center'>
        {typedKeys(lands).map((land) => (
          <LandItem
            remove={removeFromWatchList}
            land={lands[land]}
            landId={land}
            key={land}
          />
        ))}
      </Fade>
    </ul>
  )
}

export default LandList
