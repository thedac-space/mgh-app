import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { HorizontalPriceCard } from '../components/General'
import MapCard from '../components/Heatmap/MapCard'
import MapChooseFilter from '../components/Heatmap/MapChooseFilter'
import MapChooseMetaverse from '../components/Heatmap/MapChooseMetaverse'
import MapLandSummary from '../components/Heatmap/MapLandSummary'
import { TileMap } from '../components/Heatmap/TileMap'
import { Metaverse } from '../lib/enums'
import {
  Coord,
  Layer,
  MapFilter,
  ValuationTile,
} from '../lib/heatmap/heatmapCommonTypes'
import { atlasLayer, onSaleLayer } from '../lib/heatmap/decentralandHeatmap'
import { useVisible } from '../lib/hooks'
import { formatMetaverseName, getState, typedKeys } from '../lib/utilities'
import { ICoinPrices } from '../lib/valuation/valuationTypes'
import { filteredLayer } from '../lib/heatmap/heatmapLayers'
import { fetchAtlas } from '../lib/heatmap/fetchAtlas'
import { Loader } from '../components'
import { setColours } from '../lib/heatmap/valuationColoring'

const HeatMap: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const [mapState, setMapState] = useState<'loading' | 'loaded' | 'error'>(
    'loading'
  )
  const [loading, loaded, error] = getState(mapState, [
    'loading',
    'loaded',
    'error',
  ])
  const metaverseOptions = {
    decentraland: { baseLayer: [atlasLayer] },
    sandbox: { baseLayer: [onSaleLayer] },
    'axie-infinity': { baseLayer: [onSaleLayer] },
  }
  const [selected, setSelected] = useState<{ x: number; y: number }>()
  const [hovered, setHovered] = useState<{ x: number; y: number }>({
    x: NaN,
    y: NaN,
  })
  // Hook for Popup
  const { ref, isVisible, setIsVisible } = useVisible(false)
  const [metaverse, setMetaverse] = useState<Metaverse>(Metaverse.DECENTRALAND)
  const [filterBy, setFilterBy] = useState<MapFilter>('eth_predicted_price')
  const [atlas, setAtlas] = useState<Record<string, ValuationTile>>()

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
    height: sectionRef.current?.offsetHeight,
    width: sectionRef.current?.offsetWidth,
  })

  const resize = () => {
    if (!sectionRef.current) return
    setDims({
      height: sectionRef.current.offsetHeight,
      width: sectionRef.current.offsetWidth,
    })
  }

  // Use Effect for Metaverse Fetching and Map creation
  useEffect(() => {
    console.log('hola')
    const setData = async () => {
      setMapState('loading')
      const mv = await fetchAtlas(metaverse)
      const atlasWithColours = await setColours(mv, filterBy)
      setAtlas(atlasWithColours)
      setMapState('loaded')
    }
    setData()
    resize()
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [metaverse])

  useEffect(() => {
    if (!atlas) return
    const changeColours = async () => {
      const atlasWithColours = await setColours(atlas, filterBy)
      setAtlas(atlasWithColours)
    }
    changeColours()
  }, [filterBy])
  return (
    <section ref={sectionRef} className='w-full h-full min-h-[75vh] relative'>
      <div className='absolute top-0 z-20 flex gap-4 p-2'>
        {/* Top left GUI */}
        <MapLandSummary coordinates={hovered} metaverse={metaverse} />
        {/* Metaverse Selection */}
        <MapChooseMetaverse metaverse={metaverse} setMetaverse={setMetaverse} />
        {/* Metaverse Selection */}
        <MapChooseFilter filterBy={filterBy} setFilterBy={setFilterBy} />
      </div>
      {loading && <Loader />}
      {/* Map */}
      {atlas && loaded && (
        <TileMap
          filter={filterBy}
          atlas={atlas}
          className='atlas'
          width={dims.width}
          height={dims.height}
          layers={[
            // ...metaverseOptions[metaverse].baseLayer,
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
              setSelected({ x, y })
              setIsVisible(true)
            }
          }}
        />
      )}
      {/* Predictions Card */}
      {selected && isVisible && (
        <div
          ref={ref}
          className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4'
        >
          <Fade>
            <MapCard
              prices={prices}
              metaverse={metaverse}
              x={selected.x.toString()}
              y={selected.y.toString()}
            />
          </Fade>
        </div>
      )}
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
export default HeatMap
