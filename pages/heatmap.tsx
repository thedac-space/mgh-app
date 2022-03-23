import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import { TileMap } from '../components/Heatmap/TileMap'
import { atlasLayer } from '../lib/heatmap/decentralandHeatmap'

const HeatMap: NextPage = () => {
  const MAX_LANDS = 278784
  const sectionRef = useRef<HTMLElement>(null)
  const [dims, setDims] = useState({
    height: sectionRef.current?.offsetHeight,
    width: sectionRef.current?.offsetWidth,
  })

  const resize = () => {
    console.log('hola')
    if (!sectionRef.current) return
    setDims({
      height: sectionRef.current.offsetHeight,
      width: sectionRef.current.offsetWidth,
    })
  }
  useEffect(() => {
    resize()
    console.log('useEffect')
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [])
  return (
    <section ref={sectionRef} className='w-full h-full'>
      <TileMap
        height={dims?.height}
        width={dims?.width}
        className='atlas'
        isDraggable={true}
        layers={[atlasLayer]}
      />
    </section>
  )
}

export default HeatMap
