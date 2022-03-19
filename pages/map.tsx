import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import { FaEthereum } from 'react-icons/fa'
import { LandSquare } from '../components/Heatmap'
import { Metaverse } from '../lib/enums'
import { setFirebaseLands } from '../lib/FirebaseUtilities'
import { getLandData } from '../lib/valuation/valuationUtils'

const Map: NextPage = () => {
  const MAX_LANDS = 278784
  const MAX_SQUARES = MAX_LANDS * 10
  const [lands, setLands] = useState<any[]>([...Array(MAX_LANDS)])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // useEffect(() => {
  const ctx = canvasRef.current?.getContext('2d')
  const canvasDim = { width: 5500, height: 5500 }
  useEffect(() => {
    // const getData = async () => {
    //   let lands: any[] = []
    //   await Promise.all(
    //     [...Array(528 * 528)].map(async (e, i) => {
    //       const data = { X: 10, Y: 1 }
    //       // const data = await getLandData(Metaverse.SANDBOX, undefined, {
    //       //   X: '1',
    //       //   Y: '2',
    //       // })
    //       lands.push(data)
    //     })
    //   )
    //   console.log(lands.length)
    //   console.log(lands)
    //   setFirebaseLands(lands)
    // }
    // getData()
    // const element = { x: 5, y: 5 }
    // for (let i = 0; i <= MAX_SQUARES; i++) {
    //   if (!ctx) return
    //   ctx.fillStyle = 'green'
    //   if (element.x + 3 >= canvasDim.width) {
    //     element.y += 10
    //     element.x = 5
    //   }
    //   ctx.strokeStyle = 'light-gray'
    //   ctx.lineWidth = 3
    //   ctx.strokeRect(element.x, element.y, 10, 10)
    //   ctx.fillStyle = 'green'
    //   ctx.fillRect(element.x, element.y, 9, 9)
    //   element.x += 10
    // }
  }, [canvasRef])

  return (
    <section className='w-full h-full overflow-scroll'>
      <canvas
        id='map'
        ref={canvasRef}
        width={canvasDim.width}
        height={canvasDim.height}
        className='border border-green-300'
      ></canvas>
    </section>
  )
}

export default Map
