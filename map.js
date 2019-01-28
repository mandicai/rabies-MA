mapboxgl.accessToken = 'pk.eyJ1IjoibWFuZGlsaWNhaSIsImEiOiJjanJmc3Vndm4yNjh2NDNycDM0dDc5emxoIn0.N-48noomcumq-ThOGBcWEQ'

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v9', //hosted style id
  center: [-71.989393, 42.347425], // starting position
  zoom: 6.5 // starting zoom
})
