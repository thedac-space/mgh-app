// import * as React from 'react'

// import { debounce } from '../../lib/heatmap/debounce'
// import { getViewport } from '../../lib/heatmap/viewport'
// import { Coord } from '../../lib/heatmap/commonTypes'
// import { renderMap } from './map'
// import { Props, State } from './TileMap.types'
// import { useEffect, useState } from 'react'

// const MOBILE_WIDTH = 768
// export const TileMap = ({
//   x = 0,
//   y = 0,
//   className = '',
//   initialX = 0,
//   initialY = 0,
//   size = 14,
//   width = 640,
//   height = 480,
//   zoom = 1,
//   minSize = 7,
//   maxSize = 40,
//   minX = -150,
//   maxX = 150,
//   minY = -150,
//   maxY = 150,
//   panX = 0,
//   panY = 0,
//   padding = 4,
//   isDraggable = true,
//   renderMap,
//   onChange,
//   onClick,
//   onHover,
//   onMouseDown,
//   onMouseUp,
//   onPopup,
//   layers,
// }: Partial<Props>) => {
//   const halfWidth = (width - padding) / 2
//   const halfHeight = (height - padding) / 2

//   // const boundaries = {
//   //   nw: { x: minX - halfWidth, y: maxY + halfHeight },
//   //   se: { x: maxX + halfWidth, y: minY - halfHeight },
//   // }

//   const [state, setState] = useState<State>({
//     center: { x: x == null ? initialX : x, y: y == null ? initialY : y },
//     pan: { x: panX, y: panY },
//     zoom: zoom,
//     size: size * zoom,
//     width: width,
//     height: height,
//     nw: {
//       x: x - halfWidth,
//       y: y + halfHeight,
//     },
//     se: {
//       x: x + halfWidth,
//       y: y - halfHeight,
//     },
//   })
//   const [mounted, setMounted] = useState(false)
//   const [mousedownTimestamp, setMousedownTimestamp] = useState(0)
//   const [popupTimeout, setPopupTimeout] = useState<number | null>(null)
//   const canvasRef = React.useRef<HTMLCanvasElement>(null)
//   const [destroy, setDestroy] = useState<any>()
//   const [hover, setHover] = useState<Coord | null>(null)

//   const generateState = (
//     props: { width: number; height: number; padding: number },
//     state: { pan: Coord; center: Coord; zoom: number; size: number }
//   ): State => {
//     const { width, height, padding } = props
//     const { pan, zoom, center, size } = state
//     const viewport = getViewport({
//       width,
//       height,
//       center,
//       pan,
//       size,
//       padding,
//     })
//     return { ...viewport, pan, zoom, center, size }
//   }

//   const handlePanZoom = (args: { dx: number; dy: number; dz: number }) => {
//     if (!isDraggable) return
//     const { dx, dy, dz } = args
//     const { pan, zoom } = state

//     const maxZoom = maxSize / size
//     const minZoom = minSize / size

//     const newPan = { x: pan.x - dx, y: pan.y - dy }
//     const newZoom = Math.max(
//       minZoom,
//       Math.min(maxZoom, zoom - dz * getDzZoomModifier())
//     )
//     const newSize = newZoom * size

//     const halfWidth = (state.width - padding) / 2
//     const halfHeight = (state.height - padding) / 2

//     const boundaries = {
//       nw: { x: minX - halfWidth, y: maxY + halfHeight },
//       se: { x: maxX + halfWidth, y: minY - halfHeight },
//     }

//     const viewport = {
//       nw: {
//         x: state.center.x - halfWidth,
//         y: state.center.y + halfHeight,
//       },
//       se: {
//         x: state.center.x + halfWidth,
//         y: state.center.y - halfHeight,
//       },
//     }

//     if (viewport.nw.x + newPan.x / newSize < boundaries.nw.x) {
//       newPan.x = (boundaries.nw.x - viewport.nw.x) * newSize
//     }
//     if (viewport.nw.y - newPan.y / newSize > boundaries.nw.y) {
//       newPan.y = (viewport.nw.y - boundaries.nw.y) * newSize
//     }
//     if (viewport.se.x + newPan.x / newSize > boundaries.se.x) {
//       newPan.x = (boundaries.se.x - viewport.se.x) * newSize
//     }
//     if (viewport.se.y - newPan.y / newSize < boundaries.se.y) {
//       newPan.y = (viewport.se.y - boundaries.se.y) * newSize
//     }

//     setState({ ...state, pan: newPan, zoom: newZoom, size: newSize })
//     renderHeatmap()
//     debouncedUpdateCenter()
//   }

//   const mouseToCoords = (x: number, y: number) => {
//     const { size, pan, center, width, height } = state

//     const panOffset = { x: (x + pan.x) / size, y: (y + pan.y) / size }

//     const viewportOffset = {
//       x: (width - padding - 0.5) / 2 - center.x,
//       y: (height - padding) / 2 + center.y,
//     }

//     const coordX = Math.round(panOffset.x - viewportOffset.x)
//     const coordY = Math.round(viewportOffset.y - panOffset.y)

//     return [coordX, coordY]
//   }

//   const handleClick = (event: MouseEvent) => {
//     const [x, y] = mouseToCoords(event.offsetX, event.offsetY)
//     if (!inBounds(x, y)) {
//       return
//     }

//     if (onClick) {
//       const elapsed = Date.now() - mousedownTimestamp
//       if (elapsed < 200) {
//         onClick(x, y)
//         renderHeatmap()
//       }
//     }
//     if (onMouseUp) {
//       onMouseUp(x, y)
//       renderHeatmap()
//     }
//   }

//   const handleMouseDown = (event: MouseEvent) => {
//     setMousedownTimestamp(Date.now())
//     if (onMouseDown) {
//       const [x, y] = mouseToCoords(event.offsetX, event.offsetY)
//       if (!inBounds(x, y)) {
//         return
//       }
//       onMouseDown(x, y)
//       renderHeatmap()
//     }
//   }

//   const handleMouseMove = (event: MouseEvent) => {
//     const { offsetX, offsetY } = event
//     const [x, y] = mouseToCoords(offsetX, offsetY)
//     if (!inBounds(x, y)) {
//       // hidePopup()
//       return
//     }

//     if (!hover || hover.x !== x || hover.y !== y) {
//       setHover({ x, y })
//       // showPopup(x, y, offsetY, offsetX)
//     }
//   }

//   const handleMouseOut = () => {
//     // hidePopup()
//   }

//   const inBounds = (x: number, y: number) => {
//     return x >= minX && x <= maxX && y >= minY && y <= maxY
//   }

//   // const showPopup = (x: number, y: number, top: number, left: number) => {
//   //   const { onPopup, onHover } = props

//   //   if (onPopup) {
//   //     hidePopup()
//   //     setPopupTimeout ((previous) => previous +setTimeout(() => {
//   //       if (mounted) {
//   //         setState(
//   //           {
//   //             popup: { x, y, top, left, visible: true },
//   //           },
//   //           () => onPopup(state.popup!)
//   //         )
//   //       }
//   //     }, 400))
//   //   }

//   //   if (onHover) {
//   //     onHover(x, y)
//   //     renderMap()
//   //   }
//   // }

//   // const hidePopup = () => {

//   //   if (onPopup) {
//   //     if (popupTimeout) {
//   //       clearTimeout(popupTimeout)
//   //     }

//   //     if (state.popup) {
//   //       setState(
//   //         {
//   //           popup: {
//   //             ...state.popup,
//   //             visible: false,
//   //           },
//   //         },
//   //         () => {
//   //           onPopup(state.popup!)
//   //         }
//   //       )
//   //     }
//   //   }
//   // }

//   const renderHeatmap = () => {
//     if (!canvasRef.current) {
//       return
//     }

//     const { nw, se, pan, size, center } = state
//     const ctx = canvasRef.current.getContext('2d')!
//     if (!layers || !renderMap) return
//     renderMap({
//       ctx,
//       width,
//       height,
//       size,
//       pan,
//       nw,
//       se,
//       center,
//       layers,
//     })
//   }

//   // const refCanvas = (canvas: HTMLCanvasElement | null) => {
//   //   canvas = canvas
//   // }

//   const handleTarget = () => {
//     setState({ ...state, center: { x, y } })
//   }

//   const getDz = () => {
//     const { zoom } = state
//     return Math.sqrt(zoom) * (isMobile() ? 100 : 50)
//   }

//   const getDzZoomModifier = () => {
//     return isMobile() ? 0.005 : 0.01
//   }

//   const isMobile = () => {
//     return width < MOBILE_WIDTH
//   }

//   const getCanvasClassName = () => {
//     let classes = 'react-tile-map-canvas'
//     if (isDraggable) classes += ' draggable'
//     if (onClick) classes += ' clickable'

//     return classes
//   }

//   const styles = { width, height }

//   const classes = ('react-tile-map ' + className).trim()

//   // static defaultProps = {
//   // }

//   // private oldState: State
//   // private canvas: HTMLCanvasElement | null
//   // private mounted: boolean
//   // private hover: Coord | null
//   // private popupTimeout: number | null
//   // private mousedownTimestamp?: number
//   // private destroy?: () => void
//   const updateCenter = () => {
//     const { pan, center, size } = state

//     const panX = pan.x % size
//     const panY = pan.y % size
//     const newPan = { x: panX, y: panY }
//     const newCenter = {
//       x: center.x + Math.floor((pan.x - panX) / size),
//       y: center.y - Math.floor((pan.y - panY) / size),
//     }

//     setState({ ...state, pan: newPan, center: newCenter })
//   }
//   const handleChange = () => {
//     const { nw, se, center, zoom } = state
//     if (mounted && onChange) {
//       onChange({ nw, se, center, zoom })
//     }
//   }
//   const debouncedRenderMap = debounce(renderHeatmap, 400)
//   const debouncedUpdateCenter = debounce(updateCenter, 50)
//   const debouncedHandleChange = debounce(handleChange, 50)

//   // UNSAFE_componentWillUpdate(nextProps: Props, nextState: State) {

//   //   if (
//   //     (x !== nextProps.x || y !== nextProps.y) &&
//   //     (nextProps.x !== nextState.center.x || nextProps.y !== nextState.center.y)
//   //   ) {

//   //   const isViewportDifferent =
//   //     newState.width !== oldState.width ||
//   //     newState.height !== oldState.height ||
//   //     newState.nw.x !== oldState.nw.x ||
//   //     newState.nw.y !== oldState.nw.y ||
//   //     newState.se.x !== oldState.se.x ||
//   //     newState.se.y !== oldState.se.y ||
//   //     newState.zoom !== oldState.zoom

//   //   // The coords or the amount of parcels changed, so we need to update the state
//   //   if (
//   //     nextProps.x !== x ||
//   //     nextProps.y !== y ||
//   //     !oldState ||
//   //     isViewportDifferent
//   //   ) {
//   //     oldState = newState
//   //   }
//   // }

//   // UNSAFE_componentWillReceiveProps(nextProps: Props) {
//   //   const { zoom, maxSize, minSize, size } = nextProps
//   useEffect(() => {
//     console.log('UseEffect')
//     const mountMap = async () => {
//       console.log('mountMap')
//       if (canvasRef.current) {
//         if (isDraggable) {
//           const panzoom = (await import('../../lib/heatmap/panzoom')).default
//           setDestroy(panzoom(canvasRef.current, handlePanZoom))
//         }
//         canvasRef.current.addEventListener('click', handleClick)
//         canvasRef.current.addEventListener('mousedown', handleMouseDown)
//         canvasRef.current.addEventListener('mousemove', handleMouseMove)
//         canvasRef.current.addEventListener('mouseout', handleMouseOut)
//       }
//       renderHeatmap()

//       setMounted(true)
//     }
//     mountMap()
//     return () => {
//       if (destroy) {
//         destroy()
//       }
//       if (canvasRef.current) {
//         canvasRef.current.removeEventListener('click', handleClick)
//         canvasRef.current.removeEventListener('mousedown', handleMouseDown)
//         canvasRef.current.removeEventListener('mousemove', handleMouseMove)
//         canvasRef.current.removeEventListener('mouseout', handleMouseOut)
//       }
//       setMounted(false)
//     }
//   }, [zoom, maxSize, minSize, size, width, height, x, y])
//   useEffect(() => {
//     console.log('secondUseEffect')
//     // const maxZoom = maxSize / size
//     // const minZoom = minSize / size
//     // const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom))

//     // if (newZoom !== zoom && newZoom !== state.zoom) {
//     //   setState({ ...state, zoom: newZoom, size: size * newZoom })
//     // }
//     const nextState = {
//       ...state,
//       center: {
//         x: x,
//         y: y,
//       },
//       pan: {
//         x: 0,
//         y: 0,
//       },
//     }

//     const newState = generateState(
//       { width: width!, height: height!, padding: padding },
//       nextState
//     )
//     setState(newState)
//     debouncedHandleChange()
//     debouncedRenderMap()
//   }, [])

//   return (
//     <div className={classes} style={styles}>
//       <canvas
//         className={getCanvasClassName()}
//         width={width}
//         height={height}
//         ref={canvasRef}
//       />
//     </div>
//   )
// }

import * as React from 'react'

import { debounce } from '../../lib/heatmap/debounce'
import { getViewport } from '../../lib/heatmap/viewport'
import { Coord } from '../../lib/heatmap/commonTypes'
import { renderMap } from './map'
import { Props, State } from './TileMap.types'

const MOBILE_WIDTH = 768

export class TileMap extends React.PureComponent<Props, State> {
  static defaultProps = {
    x: 0,
    y: 0,
    className: '',
    initialX: 0,
    initialY: 0,
    size: 14,
    width: 640,
    height: 480,
    zoom: 1,
    minSize: 7,
    maxSize: 40,
    minX: -150,
    maxX: 150,
    minY: -150,
    maxY: 150,
    panX: 0,
    panY: 0,
    padding: 4,
    isDraggable: true,
    renderMap: renderMap,
  }

  private oldState: State
  private canvas: HTMLCanvasElement | null
  private mounted: boolean
  private hover: Coord | null
  private popupTimeout: number | null
  private mousedownTimestamp?: number
  private destroy?: () => void

  debouncedRenderMap = debounce(this.renderMap.bind(this), 400)
  debouncedUpdateCenter = debounce(this.updateCenter.bind(this), 50)
  debouncedHandleChange = debounce(this.handleChange.bind(this), 50)

  constructor(props: Props) {
    super(props)

    const { x, y, initialX, initialY, size, zoom, panX, panY } = props
    const initialState = {
      pan: { x: panX, y: panY },
      center: {
        x: x == null ? initialX : x,
        y: y == null ? initialY : y,
      },
      size: zoom * size,
      zoom,
      popup: null,
    }
    this.state = this.generateState(props, initialState)
    this.oldState = this.state
    this.hover = null
    this.mounted = false
    this.canvas = null
    this.popupTimeout = null
  }

  UNSAFE_componentWillUpdate(nextProps: Props, nextState: State) {
    const { x, y } = this.props

    if (
      (x !== nextProps.x || y !== nextProps.y) &&
      (nextProps.x !== nextState.center.x || nextProps.y !== nextState.center.y)
    ) {
      nextState = {
        ...nextState,
        center: {
          x: nextProps.x,
          y: nextProps.y,
        },
        pan: {
          x: 0,
          y: 0,
        },
      }
    }

    const newState = this.generateState(nextProps, nextState)
    const isViewportDifferent =
      newState.width !== this.oldState.width ||
      newState.height !== this.oldState.height ||
      newState.nw.x !== this.oldState.nw.x ||
      newState.nw.y !== this.oldState.nw.y ||
      newState.se.x !== this.oldState.se.x ||
      newState.se.y !== this.oldState.se.y ||
      newState.zoom !== this.oldState.zoom

    // The coords or the amount of parcels changed, so we need to update the state
    if (
      nextProps.x !== x ||
      nextProps.y !== y ||
      !this.oldState ||
      isViewportDifferent
    ) {
      this.oldState = newState
      this.setState(newState)
      this.debouncedHandleChange()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { zoom, maxSize, minSize, size } = nextProps
    const maxZoom = maxSize / size
    const minZoom = minSize / size
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom))

    if (newZoom !== this.props.zoom && newZoom !== this.state.zoom) {
      this.setState({
        zoom: newZoom,
        size: this.props.size * newZoom,
      })
    }
  }

  componentDidUpdate() {
    this.debouncedRenderMap()
    this.oldState = this.state
  }

  async componentDidMount() {
    const { isDraggable } = this.props

    this.renderMap()

    if (this.canvas) {
      if (isDraggable) {
        const panzoom = (await import('../../lib/heatmap/panzoom')).default

        this.destroy = panzoom(this.canvas, this.handlePanZoom)
      }
      this.canvas.addEventListener('click', this.handleClick)
      this.canvas.addEventListener('mousedown', this.handleMouseDown)
      this.canvas.addEventListener('mousemove', this.handleMouseMove)
      this.canvas.addEventListener('mouseout', this.handleMouseOut)
    }
    this.mounted = true
  }

  componentWillUnmount() {
    if (this.destroy) {
      this.destroy()
    }
    if (this.canvas) {
      this.canvas.removeEventListener('click', this.handleClick)
      this.canvas.removeEventListener('mousedown', this.handleMouseDown)
      this.canvas.removeEventListener('mousemove', this.handleMouseMove)
      this.canvas.removeEventListener('mouseout', this.handleMouseOut)
    }
    this.mounted = false
  }

  generateState(
    props: { width: number; height: number; padding: number },
    state: { pan: Coord; center: Coord; zoom: number; size: number }
  ): State {
    const { width, height, padding } = props
    const { pan, zoom, center, size } = state
    const viewport = getViewport({
      width,
      height,
      center,
      pan,
      size,
      padding,
    })
    return { ...viewport, pan, zoom, center, size }
  }

  handleChange() {
    const { onChange } = this.props
    const { nw, se, center, zoom } = this.state
    if (this.mounted && onChange) {
      onChange({ nw, se, center, zoom })
    }
  }

  handlePanZoom = (args: { dx: number; dy: number; dz: number }) => {
    if (!this.props.isDraggable) return
    const { dx, dy, dz } = args
    const { size, maxSize, minSize, minX, maxX, minY, maxY, padding } =
      this.props
    const { pan, zoom } = this.state

    const maxZoom = maxSize / size
    const minZoom = minSize / size

    const newPan = { x: pan.x - dx, y: pan.y - dy }
    const newZoom = Math.max(
      minZoom,
      Math.min(maxZoom, zoom - dz * this.getDzZoomModifier())
    )
    const newSize = newZoom * size

    const halfWidth = (this.state.width - padding) / 2
    const halfHeight = (this.state.height - padding) / 2

    const boundaries = {
      nw: { x: minX - halfWidth, y: maxY + halfHeight },
      se: { x: maxX + halfWidth, y: minY - halfHeight },
    }

    const viewport = {
      nw: {
        x: this.state.center.x - halfWidth,
        y: this.state.center.y + halfHeight,
      },
      se: {
        x: this.state.center.x + halfWidth,
        y: this.state.center.y - halfHeight,
      },
    }

    if (viewport.nw.x + newPan.x / newSize < boundaries.nw.x) {
      newPan.x = (boundaries.nw.x - viewport.nw.x) * newSize
    }
    if (viewport.nw.y - newPan.y / newSize > boundaries.nw.y) {
      newPan.y = (viewport.nw.y - boundaries.nw.y) * newSize
    }
    if (viewport.se.x + newPan.x / newSize > boundaries.se.x) {
      newPan.x = (boundaries.se.x - viewport.se.x) * newSize
    }
    if (viewport.se.y - newPan.y / newSize < boundaries.se.y) {
      newPan.y = (viewport.se.y - boundaries.se.y) * newSize
    }

    this.setState({
      pan: newPan,
      zoom: newZoom,
      size: newSize,
    })
    this.renderMap()
    this.debouncedUpdateCenter()
  }

  mouseToCoords(x: number, y: number) {
    const { padding } = this.props
    const { size, pan, center, width, height } = this.state

    const panOffset = { x: (x + pan.x) / size, y: (y + pan.y) / size }

    const viewportOffset = {
      x: (width - padding - 0.5) / 2 - center.x,
      y: (height - padding) / 2 + center.y,
    }

    const coordX = Math.round(panOffset.x - viewportOffset.x)
    const coordY = Math.round(viewportOffset.y - panOffset.y)

    return [coordX, coordY]
  }

  handleClick = (event: MouseEvent) => {
    const [x, y] = this.mouseToCoords(event.offsetX, event.offsetY)
    if (!this.inBounds(x, y)) {
      return
    }

    const { onClick, onMouseUp } = this.props
    if (onClick) {
      const elapsed = Date.now() - this.mousedownTimestamp!
      if (elapsed < 200) {
        onClick(x, y)
        this.renderMap()
      }
    }
    if (onMouseUp) {
      onMouseUp(x, y)
      this.renderMap()
    }
  }

  handleMouseDown = (event: MouseEvent) => {
    const { onMouseDown } = this.props
    this.mousedownTimestamp = Date.now()
    if (onMouseDown) {
      const [x, y] = this.mouseToCoords(event.offsetX, event.offsetY)
      if (!this.inBounds(x, y)) {
        return
      }
      onMouseDown(x, y)
      this.renderMap()
    }
  }

  handleMouseMove = (event: MouseEvent) => {
    const { offsetX, offsetY } = event
    const [x, y] = this.mouseToCoords(offsetX, offsetY)
    if (!this.inBounds(x, y)) {
      this.hidePopup()
      return
    }

    if (!this.hover || this.hover.x !== x || this.hover.y !== y) {
      this.hover = { x, y }
      this.showPopup(x, y, offsetY, offsetX)
    }
  }

  handleMouseOut = () => {
    this.hidePopup()
  }

  inBounds(x: number, y: number) {
    const { minX, minY, maxX, maxY } = this.props
    return x >= minX && x <= maxX && y >= minY && y <= maxY
  }

  showPopup(x: number, y: number, top: number, left: number) {
    const { onPopup, onHover } = this.props

    if (onPopup) {
      this.hidePopup()
      this.popupTimeout = +setTimeout(() => {
        if (this.mounted) {
          this.setState(
            {
              popup: { x, y, top, left, visible: true },
            },
            () => onPopup(this.state.popup!)
          )
        }
      }, 400)
    }

    if (onHover) {
      onHover(x, y)
      this.renderMap()
    }
  }

  hidePopup() {
    const { onPopup } = this.props
    if (onPopup) {
      if (this.popupTimeout) {
        clearTimeout(this.popupTimeout)
      }

      if (this.state.popup) {
        this.setState(
          {
            popup: {
              ...this.state.popup,
              visible: false,
            },
          },
          () => {
            onPopup(this.state.popup!)
          }
        )
      }
    }
  }

  updateCenter() {
    const { pan, center, size } = this.state

    const panX = pan.x % size
    const panY = pan.y % size
    const newPan = { x: panX, y: panY }
    const newCenter = {
      x: center.x + Math.floor((pan.x - panX) / size),
      y: center.y - Math.floor((pan.y - panY) / size),
    }

    this.setState({
      pan: newPan,
      center: newCenter,
    })
  }

  renderMap() {
    if (!this.canvas) {
      return
    }

    const { width, height, layers, renderMap } = this.props
    const { nw, se, pan, size, center } = this.state
    const ctx = this.canvas.getContext('2d')!

    renderMap({
      ctx,
      width,
      height,
      size,
      pan,
      nw,
      se,
      center,
      layers,
    })
  }

  refCanvas = (canvas: HTMLCanvasElement | null) => {
    this.canvas = canvas
  }

  handleTarget = () => {
    const { x, y } = this.props
    this.setState({ center: { x, y } })
  }

  getDz() {
    const { zoom } = this.state
    return Math.sqrt(zoom) * (this.isMobile() ? 100 : 50)
  }

  getDzZoomModifier() {
    return this.isMobile() ? 0.005 : 0.01
  }

  isMobile() {
    return this.props.width < MOBILE_WIDTH
  }

  getCanvasClassName() {
    const { isDraggable, onClick } = this.props

    let classes = 'react-tile-map-canvas'
    if (isDraggable) classes += ' draggable'
    if (onClick) classes += ' clickable'

    return classes
  }

  render() {
    const { width, height, className } = this.props

    const styles = { width, height }

    const classes = ('react-tile-map ' + className).trim()

    return (
      <div className={classes} style={styles}>
        <canvas
          className={this.getCanvasClassName()}
          width={width}
          height={height}
          ref={this.refCanvas}
        />
      </div>
    )
  }
}
