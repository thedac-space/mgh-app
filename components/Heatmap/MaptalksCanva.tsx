import { useEffect } from 'react'
import * as maptalks from 'maptalks';

interface IMaptalksCanva {
  width: number | string | undefined
  height: number | string | undefined
}

const MaptalksCanva = ({ width, height }: IMaptalksCanva) => {
  useEffect(() => {
    /* const downloadMap = async (metaverse, size, layer) => {
      let response = {}, from = 0, result = {};

      do {
        let url = "https://services.itrmachines.com/" + metaverse + "/requestMap?from=" + from + "&size=" + size;
        from += size;
        console.log("> requesting:", from);
        response = await fetch(url, { method: 'GET' });
        response = await response.json();
        for (let key of Object.keys(response))
          result[key] = response[key];
      } while (Object.keys(response).length > 0);

      const landColection: any = []

      Object.entries(result).forEach(([key, value]) => {
        let polygon = new maptalks.Polygon([
          [
            [value.geometry[0].x, value.geometry[0].y],
            [value.geometry[1].x, value.geometry[1].y],
            [value.geometry[2].x, value.geometry[2].y],
            [value.geometry[3].x, value.geometry[3].y],
          ]
        ], {
          visible: true,
          editable: true,
          shadowBlur: 0,
          shadowColor: 'black',
          draggable: false,
          dragShadow: false, // display a shadow during dragging
          drawOnAxis: null,  // force dragging stick on a axis, can be: x, y
          symbol: {
            'lineColor': '#34495e',
            'lineWidth': 2,
            'polygonFill': 'rgb(0,0,0)',
            'polygonOpacity': 1
          },
          cursor: 'pointer',
        });

        landColection.push(polygon)
      })

      let collection = new maptalks.GeometryCollection(landColection);
      layer.addGeometry(collection)
    } */

    let map
    /* var imageLayer = new maptalks.ImageLayer('images', [
      {
        //url : 'images/map-hires-background.jpg',
        //url : '/images/Somnium_Space_World_Map_HQ2.jpg',
        url: '/images/Waterfront_Extended_Parcels_Map_allgreen.jpg',
        extent: [-1, -1, 1, 1],
        opacity: 1
      }
    ]); */

    map = new maptalks.Map('map', {
      center: [0, 0],
      zoom: 10,
      minZoom: 9,
      maxZoom: 12,
      pitch: 45,
      //bearing : 180,
      attribution: false,
      //zoomControl : true,
      //overviewControl : true,
      dragRotate: true, // set to true if you want a rotatable map
      baseLayer: new maptalks.TileLayer('base', {
        'urlTemplate' : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'subdomains'  : ['a','b','c','d'],
        'attribution'  : '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, '+
        '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      })
    });

    //let layer = new maptalks.VectorLayer('vector').addTo(map);

    //downloadMap("somnium-space", X)
    // downloadMap("somnium-space", 100, layer)

    /* map.on('click', function (e: any) {
      layer.forEach(function (g: any) {
        alert('Que hace este click?')
      });
    }); */
  }, [])

  return (
    <div id="map" className={`w-[${width}px] h-[${height}px]`} />
  )
}

export default MaptalksCanva