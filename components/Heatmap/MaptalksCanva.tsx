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
import { io } from 'socket.io-client'
import React from 'react'
const socket = io('http://localhost:3001', { transports: ['websocket'] })
interface IMaptalksCanva {
    width: number | string | undefined
    height: number | string | undefined
    filter: MapFilter
    percentFilter: PercentFilter
    legendFilter: LegendFilter
    atlas: Atlas
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
    onHover,
    onClick,
}: IMaptalksCanva) => {

    useEffect(() => {
        if (!atlas) return undefined
        let map: any
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
        let layer = new maptalks.VectorLayer('vector',[], {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true,
            forceRenderOnZooming: true,
        }).addTo(map)
        let landColection: any = []
        socket.emit('render', 'somnium-space')
        socket.on('render', (land) => {
            console.log(land)
            let value = land[1]
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
            const { color } = tile
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
                        lineWidth: 0,
                        polygonFill: color,
                        polygonOpacity: 1,
                    },
                    cursor: 'pointer',
                }
            )
                .on('click', () => {
                    onClick(value.center.x, value.center.y, value.name)
                })
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
                        lineWidth: 0,
                    })
                })
                layer.addGeometry(polygon)
        })



        return () => {
            map.remove()
        }
    }, [atlas, legendFilter])

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
