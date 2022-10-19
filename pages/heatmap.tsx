import { NextPage } from 'next'
import React from 'react'
import {Heatmap2D} from '../components/Heatmap/index'

const Heatmap: NextPage = () => {
    return (
        <Heatmap2D
            width={800}
            height={600}
            filter={'basic'}
            percentFilter={undefined}
            legendFilter={undefined}
            atlas={{} as any}
            metaverse={"decentraland"}
            onHover={function (x: any, y: any): void { } }
            onClick={function (x: any, y: any, name: string): void { } }     />
    )
}

export default Heatmap
