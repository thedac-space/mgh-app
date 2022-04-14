import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import MapCard from '../components/Heatmap/MapCard'
import MapChooseFilter from '../components/Heatmap/MapChooseFilter'
import MapChooseMetaverse from '../components/Heatmap/MapChooseMetaverse'
import MapLandSummary from '../components/Heatmap/MapLandSummary'
import { TileMap } from '../components/Heatmap/TileMap'
import { Metaverse } from '../lib/enums'
import {
  Atlas,
  AtlasTile,
  HeatmapSize,
  Layer,
  MapFilter,
} from '../lib/heatmap/heatmapCommonTypes'
import { useVisible } from '../lib/hooks'
import { formatName, getState, typedKeys } from '../lib/utilities'
import { ICoinPrices } from '../lib/valuation/valuationTypes'
import {
  decentralandAPILayer,
  filteredLayer,
} from '../lib/heatmap/heatmapLayers'
import {
  fetchDecentralandAtlas,
  fetchITRMAtlas,
} from '../lib/heatmap/fetchAtlas'
import { setColours } from '../lib/heatmap/valuationColoring'
import HeatmapLoader from '../components/Heatmap/HeatmapLoader'
import { getHeatmapSize } from '../lib/heatmap/getHeatmapSize'
import ColorGuide from '../components/Heatmap/ColorGuide'
import MapSearch from '../components/Heatmap/MapSearch'
import { fetchHeatmapLand } from '../lib/heatmap/fetchHeatmapLand'
import { IAPIData, IPredictions } from '../lib/types'
import { FloorPriceTracker, SalesVolumeDaily } from '../components/Valuation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const FloorAndVolumeChart = dynamic(
  () => import('../components/Valuation/FloorAndVolumeChart'),
  {
    ssr: false,
  }
)

// Making this state as an object in order to iterate easily through it
export const HEATMAP_STATE = {
  loading: 'loading',
  loaded: 'loaded',
  error: 'error',
  loadingQuery: 'loadingQuery',
  loadedQuery: 'loadedQuery',
  errorQuery: 'errorQuery',
}

interface CardData {
  apiData: IAPIData
  predictions: IPredictions
  currentPrice: number
  landCoords: { x: string | number; y: string | number }
}

const Valuation: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const [mapState, setMapState] =
    useState<keyof typeof HEATMAP_STATE>('loading')
  const [loading, loaded, error, loadingQuery, loadedQuery, errorQuery] =
    getState(mapState, typedKeys(HEATMAP_STATE))

  const [selected, setSelected] = useState<{ x: number; y: number }>()
  const [hovered, setHovered] = useState<{ x: number; y: number }>({
    x: NaN,
    y: NaN,
  })
  // Hook for Popup
  const { ref, isVisible, setIsVisible } = useVisible(false)
  const [metaverse, setMetaverse] = useState<Metaverse>(Metaverse.DECENTRALAND)
  const [filterBy, setFilterBy] = useState<MapFilter>('basic')
  const [atlas, setAtlas] = useState<Atlas>()
  const [landsLoaded, setLandsLoaded] = useState<number>(0)
  const [heatmapSize, setHeatmapSize] = useState<HeatmapSize>()
  const [cardData, setCardData] = useState<CardData>()

  function isSelected(x: number, y: number) {
    return selected?.x === x && selected?.y === y
  }
  const selectedStrokeLayer: Layer = (x, y) => {
    return isSelected(x, y) ? { color: '#ff0044', scale: 1.4 } : null
  }

  const hoverLayer: Layer = (x, y) => {
    return hovered?.x === x && hovered?.y === y
      ? { color: '#db2777', scale: 1.4 }
      : null
  }

  const selectedFillLayer: Layer = (x, y) => {
    return isSelected(x, y) ? { color: '#ff9990', scale: 1.2 } : null
  }

  const sectionRef = useRef<HTMLElement>(null)
  const [dims, setDims] = useState({
    height: 500,
    width: sectionRef.current?.offsetWidth,
  })

  const resize = () => {
    if (!sectionRef.current) return
    setDims({
      height: sectionRef.current.offsetHeight,
      width: sectionRef.current.offsetWidth,
    })
  }

  // Main Search Function through Clicks,Form inputs.
  const handleMapSelection = async (
    x?: number,
    y?: number,
    tokenId?: string
  ) => {
    x && y && setSelected({ x: x, y: y })
    setCardData(undefined)
    setMapState('loadingQuery')
    setIsVisible(true)
    const landData = await fetchHeatmapLand(prices, metaverse, tokenId, {
      x: x,
      y: y,
    })
    if (!landData) {
      setMapState('errorQuery')
      return setTimeout(() => setIsVisible(false), 1100)
    }
    const id = landData?.landCoords.x + ',' + landData?.landCoords.y
    if (
      !atlas?.ITRM ||
      !(id in atlas.ITRM) ||
      (atlas.decentraland &&
        (!(id in atlas.decentraland) ||
          [5, 6, 7, 8, 12].includes(atlas.decentraland[id].type)))
    ) {
      setMapState('errorQuery')
      return setTimeout(() => setIsVisible(false), 1100)
    }
    setSelected({ x: landData.landCoords.x, y: landData.landCoords.y })
    setMapState('loadedQuery')
    setCardData(landData)
  }

  // Use Effect for Metaverse Fetching and Map creation
  useEffect(() => {
    const setData = async () => {
      setLandsLoaded(0)
      setSelected(undefined)
      setMapState('loading')
      const ITRMAtlas = await fetchITRMAtlas(metaverse, setLandsLoaded)
      let decentralandAtlas: Record<string, AtlasTile> | undefined
      if (metaverse === 'decentraland') {
        decentralandAtlas = await fetchDecentralandAtlas()
      }
      const atlasWithColours = await setColours(ITRMAtlas, filterBy)
      const heatmapSize = getHeatmapSize({ ITRM: ITRMAtlas })
      setHeatmapSize(heatmapSize)
      setAtlas({ ITRM: atlasWithColours, decentraland: decentralandAtlas })
      setMapState('loaded')
    }
    setData()
    resize()
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [metaverse])

  // Use Effect for changing filters
  useEffect(() => {
    if (!atlas) return
    const changeColours = async () => {
      const atlasWithColours = await setColours(atlas.ITRM, filterBy)
      setAtlas({ ...atlas, ITRM: atlasWithColours })
    }
    changeColours()
  }, [filterBy])

  return (
    <section ref={sectionRef} className='w-full h-2/4 min-h-[50vh] relative'>
      {/* Main Header */}
      <div className='gray-box flex flex-col sm:flex-row justify-between items-center mb-8'>
        <h1 className='text-transparent bg-clip-text lg:text-5xl text-3xl bg-gradient-to-br from-blue-500 via-green-400 to-green-500 mb-0 sm:mb-2'>
          LAND Valuation
        </h1>
        {/* Watchlist and Portfolio Button's wrapper */}
        <div className='flex gap-5'>
          {/* Portfolio */}
          {['portfolio', 'watchlist', 'valuations-dashboard', 'analytics'].map(
            (option) => (
              <Link href={`/${option}`}>
                <a className='hover:scale-105 font-medium text-white px-5 py-3 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-green-500/30 transition-all duration-300'>
                  <span className='pt-1 text-xl'>{formatName(option)}</span>
                </a>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Heatmap */}
      <div className='relative mb-8'>
        {loading && (
          <HeatmapLoader landsLoaded={landsLoaded} metaverse={metaverse} />
        )}
        {atlas && heatmapSize && !loading && (
          <>
            <div className='absolute top-0 z-20 flex gap-4 p-2 w-fit'>
              <div>
                {/* Top left Coordinates */}
                <div className='mb-2 w-[177px]'>
                  <MapLandSummary coordinates={hovered} metaverse={metaverse} />
                </div>
                {/* Search Forms */}
                <div>
                  <MapSearch
                    handleMapSelection={handleMapSelection}
                    metaverse={metaverse}
                  />
                </div>
              </div>
              {/* Metaverse Selection */}
              <MapChooseMetaverse
                metaverse={metaverse}
                setMetaverse={setMetaverse}
              />
              {/* Metaverse Selection */}
              <MapChooseFilter filterBy={filterBy} setFilterBy={setFilterBy} />
              {/* Color Guide */}
              {filterBy !== 'basic' && <ColorGuide />}
            </div>
            {/*  Map */}
            <TileMap
              minX={heatmapSize.minX}
              maxX={heatmapSize.maxX}
              minY={heatmapSize.minY}
              maxY={heatmapSize.maxY}
              x={selected?.x || heatmapSize.initialY}
              y={selected?.y || heatmapSize.initialX}
              filter={filterBy}
              atlas={atlas}
              className='atlas'
              width={dims.width}
              height={dims.height}
              layers={[
                decentralandAPILayer,
                filteredLayer,
                selectedStrokeLayer,
                selectedFillLayer,
                hoverLayer,
              ]}
              onHover={(x, y) => {
                setHovered({ x, y })
              }}
              onClick={(x, y) => {
                if (isSelected(x, y)) {
                  setSelected(undefined)
                } else {
                  handleMapSelection(x, y)
                }
              }}
            />
          </>
        )}
        {/* Predictions Card */}
        {isVisible && (
          <div ref={ref} className='absolute bottom-2 right-8'>
            <Fade duration={300}>
              <MapCard
                setIsVisible={setIsVisible}
                metaverse={metaverse}
                currentPrice={cardData?.currentPrice}
                apiData={cardData?.apiData}
                predictions={cardData?.predictions}
                landCoords={cardData?.landCoords}
                mapState={mapState}
              />
            </Fade>
          </div>
        )}
      </div>

      {/* Tier 1 - Most Undervalued Land */}
      {/* <MostUnderValuedLand verticalUnder="sm" predictions={undefined} processing={false} showCard={true} apiData={undefined} /> */}
      {/* Daily Volume and Floor Price Wrapper */}
      <div className='flex flex-col sm:flex-row space-y-5 sm:space-y-0 space-x-0 sm:space-x-5 md:space-x-10 items-stretch justify-between w-full'>
        {/* Daily Volume */}
        <SalesVolumeDaily metaverse={metaverse} coinPrices={prices} />
        {/* Floor Price */}
        <div className='flex flex-col justify-between w-full space-y-5 md:space-y-10 lg:space-y-5'>
          <FloorPriceTracker metaverse={metaverse} coinPrices={prices} />
        </div>
      </div>
      {/*Graph*/}
      <div className='flex flex-col shadow-blck rounded-xl py-3 px-4 w-full bg-grey-dark bg-opacity-20 '>
        <FloorAndVolumeChart metaverse={metaverse} />
      </div>
      <div className='flex flex-col items-start shadow-blck rounded-xl py-3 px-4 w-full bg-grey-dark bg-opacity-20 text-left'>
        <p className={`text-xs sm:text-sm text-gray-400`}>
          The MGH DAO does not provide, personalized investment recommendations
          or advisory services. Any information provided through the land
          evaluation tool and others is not, and should not be, considered as
          advice of any kind and is for information purposes only. That land is
          “valuated” does not mean, that it is in any way approved, checked
          audited, and/or has a real or correct value. In no event shall the MGH
          DAO be liable for any special, indirect, or consequential damages, or
          any other damages of any kind, including but not limited to loss of
          use, loss of profits, or loss of data, arising out of or in any way
          connected with the use of or inability to use the Service, including
          without limitation any damages resulting from reliance by you on any
          information obtained from using the Service.
        </p>
      </div>
    </section>
  )
}

export async function getServerSideProps() {
  const coin = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox%2Cdecentraland%2Caxie-infinity&vs_currencies=usd'
  )
  const prices: ICoinPrices = await coin.json()

  return {
    props: {
      prices,
    },
  }
}
export default Valuation
