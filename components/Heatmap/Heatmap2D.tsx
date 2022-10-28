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
import { setColours } from '../../lib/heatmap/valuationColoring'
import * as d3 from 'd3'
const { tile } = require('d3-tile')

const socket = io('http://localhost:3005', { transports: ['websocket'] })
interface IMaptalksCanva {
    width: number
    height: number
    filter: MapFilter
    percentFilter: PercentFilter
    legendFilter: LegendFilter
    onHover: (
        x: number,
        y: number,
        name: string | undefined,
        owner: string | undefined
    ) => void
    onClick: (land: ValuationTile, name: string) => void
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
    let margin = { top: 80, right: 25, bottom: 30, left: 40 }

    useEffect(() => {
        let map: any
        map = d3.select('#map').attr('viewBox', [-300, -300, width, height]).attr('style','overflow-x:hidden;')
        map.call(
            d3
                .zoom()
                .scaleExtent([-10, 10])
                .on('zoom', function ({transform}) {
                    map.attr("transform", transform);
/*     gX.call(xAxis.scale(transform.rescaleX(x)));
    gY.call(yAxis.scale(transform.rescaleY(y))); */
                })
        )

        const tileGroup = map
            .append('g')
            .attr('pointer-events', 'none')
            .attr('font-family', 'var(--sans-serif)')
            .attr('font-size', 16)

        let _tile = tileGroup.selectAll('g')

        let lands: any = {}
        let polygons: any = []
        socket.emit('render', metaverse)
        socket.on('render', (land) => {
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
                    ITRM: lands,
                    decentraland: undefined,
                } as Atlas,
                filter,
                percentFilter,
                legendFilter,
                land
            )
            let { color } = tile
            let borderColor = '#000'
            let borderSize = 0

            _tile = _tile.data(polygons).join((enter: any) =>
                enter
                    .append('g')
                    .attr('transform', ({ coords }: any) => {
                        let { x, y } = coords
                        return `translate(${x}, ${y}) scale(${1 / 100000})`
                    })
                    .call((g: any) =>
                        g
                            .append('rect')
                            .attr('fill', (d: any) => color)
                            .attr('fill-opacity', 0.5)
                            .attr('stroke', 'black')
                            .attr('width', 100000)
                            .attr('height', 100000)
                            
                    )
            )
            map.selectAll('g')
            polygons.push(land)
            map.node()
        })
        socket.on('render-finish', () => {
            console.log('FINISH')

            setMapData(lands)
            setMap(map)
        })
    }, [])

    /*     useEffect(() => {
        if (!map) return
        let lands: any = []
        map.removeLayer('vector')
        let coloredAtlas = setColours(mapData!, filter)
        if (map && x && y) {
            map.setCenter(new maptalks.Coordinate(x / 10, y / 10))
        }

        Object.values(mapData!).forEach((value: any) => {
            let tile: any
            tile = filteredLayer(
                value.coords.x,
                value.coords.y,
                {
                    ITRM: coloredAtlas,
                    decentraland: undefined,
                } as Atlas,
                filter,
                percentFilter,
                legendFilter
            )
            let { color } = tile
            let borderColor = '#000'
            let borderSize = 0

            //set color if the land is selected
            if (value.coords.x == x && value.coords.y == y) {
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
                    enableSimplify: true,
                }
            )
                .on('click', () => {
                    onClick(value, value.name)
                })
                .on('mouseenter', (e) => {
                    e.target.updateSymbol({
                        polygonFill: '#db2777',
                        lineWidth: 3,
                        lineColor: '#db2777',
                    })
                    onHover(
                        value.coords?.x,
                        value.coords?.y,
                        value.name,
                        value.owner
                    )
                })
                .on('mouseout', (e) => {
                    e.target.updateSymbol({
                        polygonFill: color,
                        lineWidth: borderSize,
                        lineColor: borderColor,
                    })
                })
            lands.push(polygon)
        })

        new maptalks.VectorLayer('vector', lands, {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true,
            forceRenderOnZooming: true,
        }).addTo(map)
    }, [filter, percentFilter, legendFilter, x, y]) */

    return (
        <svg
            width={width}
            height={height}
            /* style={{ width, height }} */
            id="map"
        />
    )
}

export default MaptalksCanva
