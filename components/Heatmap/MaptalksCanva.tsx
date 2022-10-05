import { useEffect, useRef } from 'react'
import * as maptalks from 'maptalks'
import {
    Atlas,
    Layer,
    LegendFilter,
    MapFilter,
    PercentFilter,
} from '../../lib/heatmap/heatmapCommonTypes'
import { filteredLayer } from '../../lib/heatmap/heatmapLayers'
import React from 'react'

interface IMaptalksCanva {
    width: number | string | undefined
    height: number | string | undefined
    filter: MapFilter
    percentFilter: PercentFilter
    legendFilter: LegendFilter
    atlas: Atlas
    x: number | undefined
    y: number | undefined
    onHover: (x: any, y: any) => void
    onClick: (x: any, y: any, name: string) => void 
}

const MaptalksCanva = ({
    width,
    height,
    filter,
    percentFilter,
    legendFilter,
    atlas,
    x,
    y,
    onHover,
    onClick,
}: IMaptalksCanva) => {
    let map: maptalks.Map
    useEffect(() => {
        if (!atlas) return undefined
        var imageLayer = new maptalks.ImageLayer('images', [
            {
                url: '/images/Waterfront_Extended_Parcels_Map_allgreen.jpg',
                extent: [-1, -1, 1, 1],
                opacity: 1,
            },
        ])

        map = new maptalks.Map('map', {
            center: [0, 0],
            zoom: 10,
            minZoom: 9,
            maxZoom: 12,
            pitch: 45,
            attribution: false,
            dragRotate: true, // set to true if you want a rotatable map
        })
        //added background map layer
        //console.log('1:', JSON.parse(JSON.stringify(map)))
        map.addLayer(imageLayer)
        let landColection: any = []
        if (x && y){ map.setCenter(new maptalks.Coordinate(x, y)) }
        Object.entries(atlas.ITRM).forEach(([key, value]: any) => {
            let tile: any
            if (!value.center) return

            tile = filteredLayer(
                value.center.x,
                value.center.y,
                atlas,
                filter,
                percentFilter,
                legendFilter
            )
            let { color } = tile
            let borderColor = '#000'
            let borderSize = 0

            //set color if the land is selected
            if (value.center.x == x && value.center.y == y) {
                color = '#ff9990'
                borderColor = '#ff0044'
                borderSize = 3
            }

            let polygon = new maptalks.Polygon(
                [
                    [
                        [value.geometry[0].x, value.geometry[0].y],
                        [value.geometry[1].x, value.geometry[1].y],
                        [value.geometry[2].x, value.geometry[2].y],
                        [value.geometry[3].x, value.geometry[3].y],
                    ],
                ],
                {
                    visible: true,
                    editable: true,
                    shadowBlur: 0,
                    shadowColor: 'black',
                    draggable: false,
                    dragShadow: false, // display a shadow during dragging
                    drawOnAxis: null, // force dragging stick on a axis, can be: x, y
                    symbol: {
                        lineWidth: borderSize,
                        lineColor: borderColor,
                        polygonFill: color,
                        polygonOpacity: 1,
                    },
                    cursor: 'pointer',
                }
            )
                .on('click', () => { onClick(value.center.x, value.center.y, value.name) })
                .on('mouseenter', (e) => {
                    e.target.updateSymbol({
                        polygonFill: '#db2777',
                        lineWidth: 3,
                        lineColor: '#db2777',
                    })
                    onHover(value.center.x, value.center.y)
                })
                .on('mouseout', (e) => {
                    e.target.updateSymbol({
                        polygonFill: color,
                        lineWidth: borderSize
                    })
                })

            landColection.push(polygon)
        })
        let layer = new maptalks.VectorLayer('vector', landColection, {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true,
            forceRenderOnZooming: true
        }).addTo(map)

        return () => { map.remove() }
    }, [atlas, legendFilter, x, y])

    return (
        <canvas
            width={width}
            height={height}
            /* style={{ width, height }} */
            id="map"
        />
    )
}

export default MaptalksCanva
