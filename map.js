mapboxgl.accessToken = 'pk.eyJ1IjoibWFuZGlsaWNhaSIsImEiOiJjanJmc3Vndm4yNjh2NDNycDM0dDc5emxoIn0.N-48noomcumq-ThOGBcWEQ'

let map = new mapboxgl.Map({
  container: 'map-2017', // container id
  style: 'mapbox://styles/mapbox/dark-v9', //hosted style id
  center: [-71.760653, 42.352326], // starting position
  minZoom: 7,
  zoom: 8 // starting zoom
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
        stops: [
          [0, 0],
          [1, 0.5],
          [2, 2],
          [6, 6],
          [7, 3.5],
          [11, 5.5],
          [12, 6],
          [15, 7.5],
          [22, 11],
          [46, 23],
          [76, 38],
          [77, 38.5],
          [96, 48],
          [141, 70.5],
          [164, 82],
          [191, 95.5],
          [200, 200],
          [277, 138.5],
          [287, 143.5],
          [366, 183],
          [524, 262]
        ]
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

let mapAllYears = new mapboxgl.Map({
  container: 'map-all-years',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-71.760653, 42.352326],
  minZoom: 7,
  zoom: 8
})

mapAllYears.on('load', function () {
  mapAllYears.addSource('county', {
    type: 'geojson',
    data: 'data/by_county_all_years.json',
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
        stops: [
          [0, 0],
          [1, 0.5],
          [2, 1],
          [3, 1.5],
          [4, 2],
          [5, 2.5],
          [6, 3],
          [7, 3.5],
          [8, 4],
          [9, 4.5],
          [10, 5],
          [11, 5.5],
          [12, 6],
          [13, 6.5],
          [15, 7.5],
          [16, 8],
          [17, 8.5],
          [18, 9],
          [19, 9.5],
          [20, 10],
          [22, 11],
          [23, 11.5],
          [28, 14],
          [30, 15],
          [40, 20],
          [45, 22.5],
          [46, 23],
          [53, 26.5],
          [57, 28.5],
          [60, 30],
          [64, 32],
          [65, 32.5],
          [74, 37],
          [76, 38],
          [77, 38.5],
          [82, 41],
          [84, 42],
          [86, 43],
          [96, 48],
          [102, 51],
          [122, 61],
          [128, 64],
          [141, 70.5],
          [154, 77],
          [162, 81],
          [164, 82],
          [172, 86],
          [178, 89],
          [189, 94.5],
          [191, 95.5],
          [195, 97.5],
          [198, 99],
          [200, 100],
          [210, 105],
          [230, 115],
          [256, 128],
          [277, 138.5],
          [280, 140],
          [287, 143.5],
          [295, 147.5],
          [298, 149],
          [306, 153],
          [328, 164],
          [350, 175],
          [365, 182.5],
          [366, 183],
          [375, 187.5],
          [386, 193],
          [391, 195.5],
          [395, 197.5],
          [524, 262],
          [528, 264],
          [575, 287.5],
          [611, 305.5],
          [649, 324.5]
        ]
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