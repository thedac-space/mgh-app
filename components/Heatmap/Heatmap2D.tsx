import { useEffect, useRef, useState } from 'react'
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

const socket = io(process.env.SOCKET_SERVICE!, { transports: ['websocket'] })

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
    x,
    y,
}: IMaptalksCanva) => {
    const [map, setMap] = useState<PIXI.Application>()
    const [mapData, setMapData] = useState()
    const [chunks, setChunks] = useState<any>()
    const CHUNK_SIZE = 32
    const TILE_SIZE = 64
    const BORDE_SIZE = 14
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
        let map: any = new PIXI.Application({
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
        setMap(map)

        let lands: any = {}
        let chunks: any = {}
        container.drag().pinch().wheel()
        let currentTint: any
        let currentSprite: any
        container.on('mousemove', (e: any): any => {
            let { x, y } = container.toLocal(e.data.global)

            x = Math.floor(x / TILE_SIZE)
            y = Math.floor(y / TILE_SIZE)

            const chunkX = Math.floor(x / CHUNK_SIZE)
            const chunkY = Math.floor(y / CHUNK_SIZE)
            const chunkKey = `${chunkX}:${chunkY}`
            let chunkContainer = chunks[chunkKey]

            x = x * TILE_SIZE - chunkX * BLOCK_SIZE
            y = y * TILE_SIZE - chunkY * BLOCK_SIZE

            const child = chunkContainer?.children.find(
                (child: any) => child.x === x && child.y === y
            )
            if (child) {
                if (currentSprite && child.name != child) {
                    currentSprite.tint = currentTint
                    currentTint = child.tint
                }
                if (!currentTint) currentTint = child.tint
                currentSprite = child
                currentSprite.tint = 0xdb2777
                onHover(
                    currentSprite.landX,
                    currentSprite.landY * -1,
                    currentSprite?.name,
                    lands[`${currentSprite.landX},${currentSprite.landY}`]
                        ?.owner
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
            if (currentSprite && !isDragging) {
                const x = currentSprite.landX,
                    y = currentSprite.landY
                const land = lands[x + ',' + y]
                onClick(land, x, y * -1)
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
        socket.emit('render', metaverse)
        socket.on('render', (land: any) => {
            let name = ''
            land.coords.y *= -1
            if (land.coords) {
                name = land.coords.x + ',' + land.coords.y
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
            const rectangle: any = new PIXI.Sprite(PIXI.Texture.WHITE)
            const chunkX = Math.floor(land.coords.x / CHUNK_SIZE)
            const chunkY = Math.floor(land.coords.y / CHUNK_SIZE)
            const chunkKey = `${chunkX}:${chunkY}`
            let chunkContainer = chunks[chunkKey]
            rectangle.tint = color
            rectangle.width = rectangle.height = TILE_SIZE - BORDE_SIZE
            rectangle.name = land.name
            rectangle.landX = land.coords.x
            rectangle.landY = land.coords.y
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
                setChunks(chunks)
            }
            chunkContainer.addChild(rectangle)
            container.addChild(chunkContainer)
        })

        socket.on('render-finish', () => {
            console.log('FINISH')
            setMapData(lands)
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

    useEffect(() => {
        if (!chunks) return
        let coloredAtlas = setColours(mapData!, filter)
        for (const key in chunks) {
            for (const child of chunks[key].children) {
                let tile: any = filteredLayer(
                    child.landX,
                    child.landY,
                    {
                        ITRM: coloredAtlas,
                        decentraland: undefined,
                    } as Atlas,
                    filter,
                    percentFilter,
                    legendFilter
                )
                let { color } = tile
                child.tint = color.includes('rgb')
                ? rgbToHex(color.split('(')[1].split(')')[0])
                : '0x' + color.split('#')[1]
            }
        }
    }, [filter, percentFilter, legendFilter])

    return <div id="map" style={{ width, height }} />
}

export default MaptalksCanva
