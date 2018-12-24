let n = 20, // number of layers
  m = 200, // number of samples per layer
  stack = d3.stack().keys(d3.range(n).map(function (d) { return "layer" + d; })).offset(d3.stackOffsetWiggle)

d3.csv('data/rabies.csv').then(data => {
  console.log(data)

  // Create empty data structures
  let matrix0 = d3.range(m).map(function (d) { return { x: d } })
  let matrix1 = d3.range(m).map(function (d) { return { x: d } })

  // Fill them with random data
  d3.range(n).map(function (d) { bumpLayer(m, matrix0, d) })
  d3.range(n).map(function (d) { bumpLayer(m, matrix1, d) })

  console.log(matrix0)
  console.log(matrix1)

  let layers0 = stack(matrix0),
    layers1 = stack(matrix1)

  let width = 960,
    height = 500

  let x = d3.scaleLinear()
    .domain([0, m - 1])
    .range([0, width])

  let y = d3.scaleLinear()
    .domain([d3.min(layers0.concat(layers1), function (layer) { return d3.min(layer, function (d) { return d[0] }) }), d3.max(layers0.concat(layers1), function (layer) { return d3.max(layer, function (d) { return d[1] }) })])
    .range([height, 0])

  let color = d3.scaleLinear()
    .range(["#aad", "#556"])

  let area = d3.area()
    .x(function (d, i) { return x(d.data.x) })
    .y0(function (d) { return y(d[0]) })
    .y1(function (d) { return y(d[1]) })

  let svg = d3.select("#streamgraph-rabies").append("svg")
    .attr("width", width)
    .attr("height", height)

  svg.selectAll("path")
    .data(layers0)
    .enter().append("path")
    .attr("d", area)
    .style("fill", function () { return color(Math.random()) })

  function transition() {
    d3.selectAll("path")
      .data(function () {
        let d = layers1
        layers1 = layers0
        return layers0 = d
      })
      .transition()
      .duration(2500)
      .attr("d", area)
  }

  // Inspired by Lee Byron's test data generator.
  function bumpLayer(n, matrix, layer) {

    function bump(a) {
      let x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random())
      for (let i = 0; i < n; i++) {
        let w = (i / n - y) * z
        a[i] += x * Math.exp(-w * w)
      }
    }

    let a = []
    let i

    for (i = 0; i < n; ++i) a[i] = 0
    for (i = 0; i < 5; ++i) bump(a)
    return a.forEach(function (d, i) { matrix[i]["layer" + layer] = Math.max(0, d) + 1 })
  }
})