let width = 650,
  height = 400,
  margin = {
    top: 20,
    right: 100,
    bottom: 50,
    left: 50
  }

let svg = d3.select('#streamgraph-rabies').append('svg')
  .attr('viewBox', '0 0 ' + width + ' ' + height)

d3.csv('data/rabies.csv').then(data => {

  let color = ['#D57500', '#8F3B1B', '#DBCA69', '#404F24', '#668D3C', '#B99C6B', '#BDD09F', '#4E6172', '#493829', '#816C5B']

  data.forEach(d => {
    d.Year = new Date(d.Year)
  })

  let stack = d3.stack().keys(data.columns.slice(1))
    .order(d3.stackOrderAscending)
    .offset(d3.stackOffsetWiggle)

  let layers = stack(data)

  let area = d3.area()
    .x(function (d, i) { return x(d.data.Year) })
    .y0(function (d) { return y(d[0]) })
    .y1(function (d) { return y(d[1]) + 3 })

  let x = d3.scaleTime()
    .domain(d3.extent(data, d => d.Year))
    .range([margin.left, width])

  let y = d3.scaleLinear()
    .domain([0, 1])
    .range([height - margin.bottom, margin.top])

  svg.selectAll('path')
    .data(layers)
    .enter().append('path')
    .attr('d', area)
    .style('fill', function (d, i) { return color[i] })
    .attr('class', d => d.key)
    .on('mouseover', d => console.log(d))

  let yAxis = g => g
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat(d3.format('.0%')))
    .call(g => g.select('.tick:last-of-type text').clone()
      .attr('x', 4)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold'))
    .attr('class', 'y-axis')

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -2)
    .attr('x', -80)
    .attr('dy', '1em')
    .attr('font-size', '10px')
    .style('text-anchor', 'middle')
    .text('% of Total Rabid Animals')

  svg.append('g')
    .call(yAxis)

  let xAxis = g => g
    .attr('transform', `translate(0,${height - margin.bottom + margin.top})`)
    .call(d3.axisBottom(x))

  let xAxisGroup = svg.append('g')
    .call(xAxis)

  // instantiate the scrollama
  const scroller = scrollama()

  // setup the instance, pass callback functions
  scroller
    .setup({
      step: '.step', // required
      container: '.scrolly', // required (for sticky)
      graphic: '.sticky' // required (for sticky)
    })
    .onStepEnter(handleStepEnter)
    // .onStepExit(handleStepExit)
    // .onContainerEnter(handleContainerEnter)
    // .onContainerExit(handleContainerExit)

  function handleStepEnter(node) {
    console.log('index', node.index)
  }

  function transition() {
    d3.selectAll('path')
      .data(function () {
        let d = layers1
        layers1 = layers0
        return layers0 = d
      })
      .transition()
      .duration(2500)
      .attr('d', area)
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
    return a.forEach(function (d, i) {
      matrix[i]["layer" + layer] = Math.max(0, d) + 1
    })
  }
})