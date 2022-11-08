import { useEffect, useState } from 'react'
import {
    Atlas,
    Layer,
    LegendFilter,
    MapFilter,
    PercentFilter,
    ValuationTile,
} from '../../lib/heatmap/heatmapCommonTypes'
import { filteredLayer } from '../../lib/heatmap/heatmapLayers'
import React from 'react'
import { Metaverse } from '../../lib/metaverse'
import { setColours } from '../../lib/heatmap/valuationColoring'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { io } from 'socket.io-client'
import { Container, Sprite } from 'pixi.js'

const socket = io('http://localhost:3005', { transports: ['websocket'] })

interface IMaptalksCanva {
    width: number | undefined
    height: number | undefined
    filter: MapFilter
    percentFilter: PercentFilter
    legendFilter: LegendFilter
    onHover: (
        x: number,
        y: number,
        name: string | undefined,
        owner: string | undefined
    ) => void
    onClick: (land: ValuationTile, x: number, y: number) => void
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
    const [map, setMap] = useState<PIXI.Application>()
    const [mapData, setMapData] = useState<Record<string, ValuationTile>>({})
    const CHUNK_SIZE = 32
    const TILE_SIZE = 64
    const BLOCK_SIZE = CHUNK_SIZE * TILE_SIZE
    const rgbToHex = (values: any) => {
        let a = values.split(',')
        a = a.map(function (value: any) {
            value = parseInt(value).toString(16)
            return value.length == 1 ? '0' + value : value
        })
        return '0x' + a.join('')
    }

    useEffect(() => {
        let map: any
        map = new PIXI.Application({
            width,
            height,
            resolution: 1,
            transparent: true,
        })
        let container: any = new Viewport({
            worldWidth: width,
            worldHeight: height,
            interaction: map.renderer.plugins.interaction,
            passiveWheel: false,
        })
        let lands: any = {}
        let chunks: any = {}
        container.drag().pinch().wheel()
        let currentTint: any
        let currentSprite: any
        container.on('mousemove', (e: any): any => {
            if (e.target && e.target != e.currentTarget) {
                if (currentSprite && e.target.name != currentSprite.name) {
                    currentSprite.tint = currentTint
                    currentTint = e.target.tint
                }
                if (!currentTint) currentTint = e.target.tint
                currentSprite = e.target
                e.target.tint = 0xdb2777


                onHover(
                    e.target.landX,
                    e.target.landY,
                    e.target?.name,
                    lands[
                        e.target.landX +
                            ',' +
                            e.target.landY
                    ]?.owner
                )
            } else {
                if (currentSprite && e.target != currentSprite) {
                    currentSprite.tint = currentTint
                    currentSprite = null
                    currentTint = null
                }
            }
        })
        let isDragging = false
        container.on('drag-start', () => {
            isDragging = true
        })
        container.on('drag-end', () => {
            isDragging = false
        })
        container.on('click', (e: any) => {
            if (e.target && e.target != e.currentTarget && !isDragging) {
                const x = e.target.position.x / TILE_SIZE,
                    y = e.target.position.y / TILE_SIZE
                const land = lands[x + ',' + y]
                onClick(land, x, y)
            }
        })
        let previousTopBlock: any,
            previousLeftBlock: any,
            previousRightBlock: any,
            previousBottomBlock: any
        container.on('moved', () => {
            const { left, top, worldScreenWidth, worldScreenHeight } = container
            const topBlock = Math.floor(top / BLOCK_SIZE)
            const leftBlock = Math.floor(left / BLOCK_SIZE)
            const rightBlock = Math.ceil((left + worldScreenWidth) / BLOCK_SIZE)
            const bottomBlock = Math.ceil(
                (top + worldScreenHeight) / BLOCK_SIZE
            )

            const skip =
                previousTopBlock === topBlock &&
                previousLeftBlock === leftBlock &&
                previousRightBlock === rightBlock &&
                previousBottomBlock === bottomBlock

            if (skip) {
                return
            }

            previousTopBlock = topBlock
            previousLeftBlock = leftBlock
            previousRightBlock = rightBlock
            previousBottomBlock = bottomBlock
            for (const key in chunks) {
                const { x, y, width, height } = chunks[key]
                chunks[key].visible =
                    left < x + width &&
                    left + worldScreenWidth > x &&
                    top < y + height &&
                    top + worldScreenHeight > y
            }
        })

        map.stage.addChild(container)
        document.getElementById('map')?.appendChild(map.view)
        setMap(map)

        let polygons: any = []
        let count = 0
        socket.emit('render', metaverse)
        socket.on('render', (land: any) => {
            count++
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
            color = color.includes('rgb')
                ? rgbToHex(color.split('(')[1].split(')')[0])
                : '0x' + color.split('#')[1]
            let rectangle: any = new PIXI.Sprite(PIXI.Texture.WHITE)
            rectangle.tint = color
            rectangle.width = rectangle.height = TILE_SIZE
            rectangle.interactive = true
            rectangle.name = land.name || land.coords.x + ',' + land.coords.y
            const chunkX = Math.floor(land.coords.x / CHUNK_SIZE)
            const chunkY = Math.floor(land.coords.y / CHUNK_SIZE)
            const chunkKey = `${chunkX}:${chunkY}`
            let chunkContainer = chunks[chunkKey]
            rectangle.landX=land.coords.x
            rectangle.landY=land.coords.y
            rectangle.position.set(
                land.coords.x * TILE_SIZE - chunkX * BLOCK_SIZE,
                land.coords.y * TILE_SIZE - chunkY * BLOCK_SIZE
            )
            if (!chunkContainer) {
                chunkContainer = chunks[chunkKey] = new Container()
                chunkContainer.position.set(
                    chunkX * BLOCK_SIZE,
                    chunkY * BLOCK_SIZE
                )
            }

            chunkContainer.addChild(rectangle)

            container.addChild(chunkContainer)
            polygons.push(land)
        })

        socket.on('render-finish', () => {
            /*             for (const key in chunks) {
                chunks[key].cacheAsBitmap =true
            } */
            console.log('FINISH')
            setMapData(lands)
            setMap(map)
        })

        return () => {
            document.getElementById('map')?.removeChild(map.view)
            map.destroy()
            onHover(0 / 0, 0 / 0, undefined, undefined)
        }
    }, [metaverse])

    useEffect(() => {
        map?.renderer.resize(width || 0, height || 0)
    }, [width, height])

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

    return <div id="map" style={{ width, height }} />
}

export default MaptalksCanva
