import { NextPage } from 'next'
import React from 'react'
import { Heatmap2D } from '../components/Heatmap/index'

const Heatmap: NextPage = () => {
    return (
        <Heatmap2D
            width={800}
            height={600}
            filter={'basic'}
            percentFilter={undefined}
            legendFilter={undefined}
            metaverse={"sandbox"}
            onHover={function (x: any, y: any): void { }}
            onClick={function (x: any, y: any, name: string): void { }}
            x={0}
            y={0}
            minX={150}
            maxX={150}
            minY={150}
            maxY={150}
            initialX={0}
            initialY={0}
        />
    )
}

export default Heatmap
