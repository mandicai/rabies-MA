mapboxgl.accessToken = 'pk.eyJ1IjoibWFuZGlsaWNhaSIsImEiOiJjanJmc3Vndm4yNjh2NDNycDM0dDc5emxoIn0.N-48noomcumq-ThOGBcWEQ'

let map = new mapboxgl.Map({
  container: 'map-2017', // container id
  style: 'mapbox://styles/mapbox/dark-v9', //hosted style id
  center: [-71.760653, 42.352326], // starting position
  zoom: 7 // starting zoom
})

let mapAllYears = new mapboxgl.Map({
  container: 'map-all-years',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-71.760653, 42.352326],
  zoom: 7
})

map.scrollZoom.disable()
mapAllYears.scrollZoom.disable()

d3.json('data/by_county_2017.json').then(data => {
  let stops2017 = []

  data.features.forEach(d => {
    stops2017.push([d.properties.radius, d.properties.radius / 2])
  })

  stops2017.sort((a,b) => {
    return a[0] - b[0]
  })

  map.on('load', function () {
    map.addSource('county', {
      type: 'geojson',
      data: 'data/by_county_2017.json',
    })

    map.addLayer({
      id: 'animals-by-county-2017',
      type: 'circle',
      source: 'county',
      paint: {
        'circle-color': {
          property: 'year',
          stops: [
            [2017, '#f94343']
          ]
        },
        'circle-radius': {
          property: 'radius',
          stops: stops2017
        },
        'circle-stroke-width': {
          property: 'category',
          type: 'categorical',
          stops: [
            ['positive', 1],
            ['submitted', 0]
          ]
        },
        'circle-stroke-color': '#fff',
        'circle-opacity': {
          property: 'category',
          type: 'categorical',
          stops: [
            ['positive', 0.75],
            ['submitted', 0]
          ]
        },
      }
    })

    map.addLayer({
      id: 'county-label-2017',
      type: 'symbol',
      source: 'county',
      layout: {
        'text-field': '{county-name}',
        'symbol-placement': 'point',
        'text-size': 10,
        'text-anchor': 'top',
        'text-offset': [0, -2.5]
      },
      paint: {
        'text-color': '#fff'
      }
    })
  })
})

d3.json('data/by_county_allyears.json').then(data => {
  let stopsAllYears = []

  data.features.forEach(d => {
    stopsAllYears.push([d.properties.radius, d.properties.radius / 2])
  })

  stopsAllYears.sort((a, b) => {
    return a[0] - b[0]
  })

   mapAllYears.on('load', function () {
     mapAllYears.addSource('county', {
       type: 'geojson',
       data: 'data/by_county_allyears.json',
     })

     mapAllYears.addLayer({
       id: 'animals-by-county-all-years',
       type: 'circle',
       source: 'county',
       paint: {
         'circle-color': {
           property: 'year',
           stops: [
             [2013, '#d53e4f'],
             [2014, '#fdae61'],
             [2015, '#ffffbf'],
             [2016, '#abdda4'],
             [2017, '#3288bd'],
           ]
         },
         'circle-radius': {
           property: 'radius',
           stops: stopsAllYears
         },
         'circle-stroke-width': {
           property: 'category',
           type: 'categorical',
           stops: [
             ['positive', 1],
             ['submitted', 0]
           ]
         },
         'circle-stroke-color': '#fff',
         'circle-opacity': {
           property: 'category',
           type: 'categorical',
           stops: [
             ['positive', 0.25],
             ['submitted', 0]
           ]
         },
       }
     })

     mapAllYears.addLayer({
       id: 'county-label-2017',
       type: 'symbol',
       source: 'county',
       layout: {
         'text-field': '{county-name}',
         'symbol-placement': 'point',
         'text-size': 10,
         'text-anchor': 'top',
         'text-offset': [0, -3]
       },
       paint: {
         'text-color': '#fff'
       }
     })
   })
})
