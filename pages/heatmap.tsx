import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { HorizontalPriceCard } from '../components/General'
import MapCard from '../components/Heatmap/MapCard'
import MapLandSummary from '../components/Heatmap/MapLandSummary'
import { TileMap } from '../components/Heatmap/TileMap'
import { Metaverse } from '../lib/enums'
import { Coord, Layer } from '../lib/heatmap/commonTypes'
import { atlasLayer, onSaleLayer } from '../lib/heatmap/decentralandHeatmap'
import { useVisible } from '../lib/hooks'
import { formatMetaverseName, typedKeys } from '../lib/utilities'
import { ICoinPrices } from '../lib/valuation/valuationTypes'

const HeatMap: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const metaverseOptions = {
    decentraland: { layers: [atlasLayer, onSaleLayer] },
    sandbox: { layers: [onSaleLayer] },
    'axie-infinity': { layers: [onSaleLayer] },
  }
  const [selected, setSelected] = useState<{ x: number; y: number }>()
  const [hovered, setHovered] = useState<{ x: number; y: number }>()
  // Hook for Popup
  const { ref, isVisible, setIsVisible } = useVisible(false)
  const [metaverse, setMetaverse] = useState<Metaverse>(Metaverse.DECENTRALAND)

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
  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [])
  return (
    <section ref={sectionRef} className='w-full h-full min-h-[75vh] relative'>
      <div className='absolute top-0 z-20 flex gap-4 p-2'>
        {/* Top left GUI */}
        {hovered && (
          <MapLandSummary coordinates={hovered} metaverse={metaverse} />
        )}
        {/* Metaverse Selection */}
        <div className='flex gray-box bg-opacity-100'>
          {typedKeys(metaverseOptions).map((mv) => (
            <button key={mv} onClick={() => setMetaverse(mv as Metaverse)}>
              {formatMetaverseName(mv)}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <TileMap
        className='atlas'
        width={dims.width}
        height={dims.height}
        layers={[
          ...metaverseOptions[metaverse].layers,
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
