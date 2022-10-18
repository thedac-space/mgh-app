import { NextPage } from 'next'
import React from 'react'
import Heatmap2D from '../components/Heatmap/Heatmap2D'

const Heatmap: NextPage = () => {
    return (
        <Heatmap2D
            width={undefined}
            height={undefined}
            filter={'eth_predicted_price'}
            percentFilter={undefined}
            legendFilter={undefined}
            atlas={{} as any}
            onHover={function (x: any, y: any): void { } }
            onClick={function (x: any, y: any, name: string): void { } } metaverse={'sandbox'}        />
    )
}

export default Heatmap
