import { useEffect, useRef, useState } from 'react'
import * as maptalks from 'maptalks'
import {
    Atlas,
    Layer,
    LegendFilter,
    MapFilter,
    PercentFilter,
    ValuationTile,
} from '../../lib/heatmap/heatmapCommonTypes'
import { filteredLayer } from '../../lib/heatmap/heatmapLayers'
import { io } from 'socket.io-client'
import React from 'react'
import { Metaverse } from '../../lib/metaverse'
import { typedKeys } from '../../lib/utilities'
import { setColours } from '../../lib/heatmap/valuationColoring'
const socket = io('http://localhost:3005', { transports: ['websocket'] })
interface IMaptalksCanva {
    width: number | string | undefined
    height: number | string | undefined
    filter: MapFilter
    percentFilter: PercentFilter
    legendFilter: LegendFilter
    onHover: (x: any, y: any) => void
    onClick: (x: any, y: any, name: string) => void
    metaverse: Metaverse
    x: number | undefined
    y: number | undefined
    minX: number
    maxX: number
    minY: number
    maxY: number
    initialX: number
    initialY: number
}

const MaptalksCanva = ({
    width,
    height,
    filter,
    percentFilter,
    legendFilter,
    onHover,
    onClick,
    metaverse,
    x = 0,
    y = 0,
    minX,
    maxX,
    minY,
    maxY,
    initialX,
    initialY,
}: IMaptalksCanva) => {
    const [map, setMap] = useState<maptalks.Map>()
    const [mapData, setMapData] = useState<Record<string, ValuationTile>>()

    useEffect(() => {
        let map: any

        map = new maptalks.Map('map', {
            center: [initialX / 10, initialY / 10],
            zoom: 8,
            minZoom: 6,
            maxZoom: 10,
            dragPitch: false,
            dragRotate: false,
        })

        let layer = new maptalks.VectorLayer('vector', [], {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true,
            forceRenderOnZooming: true,
            enableSimplify: false,
        }).addTo(map)

        let lands: any = {}
        let polygons: any = []
        let c = 0
        socket.emit('render', metaverse)
        socket.on('render', (land) => {
            if (
                c < Infinity /* && land.coords.y < 50 && land.coords.y > -55 */
            ) {
                c++
                //flag = false //console.log(land)
                let name = ''
                if (land.coords) {
                    name = land?.coords.x + ',' + land?.coords.y
                } else {
                    name = land?.center.x + ',' + land?.center.y
                }
                lands[name] = land!
                lands[name].land_id = land.tokenId
                let value = land
                let tile: any

                tile = filteredLayer(
                    value.coords.x,
                    value.coords.y,
                    {
                        ITRM: metaverse != 'decentraland' ? lands : null,
                        decentraland:
                            metaverse == 'decentraland' ? lands : null,
                    } as Atlas,
                    filter,
                    percentFilter,
                    legendFilter
                )

                let { color } = tile
                let borderColor = '#000'
                let borderSize = 0

                let polygon = new maptalks.Rectangle(
                    new maptalks.Coordinate(
                        value.coords.x / 10,
                        value.coords.y / 10
                    ),
                    10000,
                    10000,
                    {
                        symbol: {
                            lineWidth: borderSize,
                            lineColor: borderColor,
                            polygonFill: color,
                            polygonOpacity: 1,
                        },
                        cursor: 'pointer',
                        id: name,
                    }
                )
                    .on('click', () => {
                        onClick(value.center?.x, value.center?.y, value.name)
                    })
                    .on('mouseenter', (e) => {
                        e.target.updateSymbol({
                            polygonFill: '#db2777',
                            lineWidth: 3,
                            lineColor: '#db2777',
                        })
                        onHover(value.center?.x, value.center?.y)
                    })
                    .on('mouseout', (e) => {
                        e.target.updateSymbol({
                            polygonFill: color,
                            lineWidth: borderSize,
                            lineColor: borderColor,
                        })
                    })
                //console.log(polygon)
                layer.addGeometry(polygon)
                polygons.push(polygon)
            }
        })
        socket.on('render-finish', () => {
            console.log('FINISH')
            setMapData(lands)
            setMap(map)
        })
    }, [])

    useEffect(() => {
        if (!map) return
        let lands: any = []
        map.removeLayer('vector')
        let polygons: any = []
        let coloredAtlas = setColours(mapData!, filter)

        let layer = new maptalks.VectorLayer('vector', [], {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true,
            forceRenderOnZooming: true,
            enableSimplify: false,
        }).addTo(map)

        if (map && x && y) { map.setCenter(new maptalks.Coordinate(x, y)) }

        Object.values(mapData!).forEach((value: any) => {
            let tile: any
            
            tile = filteredLayer(
                value.coords.x,
                value.coords.y,
                {
                    ITRM: metaverse != 'decentraland' ? lands : null,
                    decentraland:
                        metaverse == 'decentraland' ? lands : null,
                } as Atlas,
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

            let polygon = new maptalks.Rectangle(
                new maptalks.Coordinate(
                    value.coords.x / 10,
                    value.coords.y / 10
                ),
                10000,
                10000,
                {
                    symbol: {
                        lineWidth: borderSize,
                        lineColor: borderColor,
                        polygonFill: color,
                        polygonOpacity: 1,
                    },
                    cursor: 'pointer',
                    //id: name,
                }
            )
                .on('click', () => {
                    onClick(value.center?.x, value.center?.y, value.name)
                })
                .on('mouseenter', (e) => {
                    e.target.updateSymbol({
                        polygonFill: '#db2777',
                        lineWidth: 3,
                        lineColor: '#db2777',
                    })
                    onHover(value.center?.x, value.center?.y)
                })
                .on('mouseout', (e) => {
                    e.target.updateSymbol({
                        polygonFill: color,
                        lineWidth: borderSize,
                        lineColor: borderColor,
                    })
                })
            //console.log(polygon)
            layer.addGeometry(polygon)
            polygons.push(polygon)
        })

        new maptalks.VectorLayer('vector', lands, {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true,
            forceRenderOnZooming: true,
        }).addTo(map)
    }, [filter, percentFilter, legendFilter, x, y])
    /*     useEffect(() => {
        if (map) {
            let lands: any = []
            map.removeLayer('vector')
            let coloredAtlas = setColours(mapData!, filter)
            Object.values(mapData!).forEach((value: any) => {
                let tile: any
                tile = filteredLayer(
                    value.center.x,
                    value.center.y,
                    {
                        ITRM: metaverse != 'decentraland' ? coloredAtlas : null,
                        decentraland:
                            metaverse == 'decentraland' ? mapData : null,
                    } as Atlas,
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
                lands.push(polygon)
            })
            new maptalks.VectorLayer('vector', lands, {
                forceRenderOnMoving: true,
                forceRenderOnRotating: true,
                forceRenderOnZooming: true,
            }).addTo(map)
        }
    }, [filter, percentFilter, legendFilter]) */

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
