import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import { TileMap } from '../components/Heatmap/TileMap'
import { Coord, Layer } from '../lib/heatmap/commonTypes'
import { atlasLayer, onSaleLayer } from '../lib/heatmap/decentralandHeatmap'

const HeatMap: NextPage = () => {
  let selected: Coord[] = []

  function isSelected(x: number, y: number) {
    return selected.some((coord) => coord.x === x && coord.y === y)
  }
  const selectedStrokeLayer: Layer = (x, y) => {
    return isSelected(x, y) ? { color: '#ff0044', scale: 1.4 } : null
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
    <section ref={sectionRef} className='w-full h-full min-h-[85vh]'>
      <TileMap
        className='atlas'
        width={dims.width}
        height={dims.height}
        layers={[
          // atlasLayer,
          onSaleLayer,
          selectedStrokeLayer,
          selectedFillLayer,
        ]}
        onClick={(x, y) => {
          if (isSelected(x, y)) {
            selected = selected.filter(
              (coord) => coord.x !== x || coord.y !== y
            )
          } else {
            selected.push({ x, y })
          }
        }}
      />
    </section>
  )
}

export default HeatMap
