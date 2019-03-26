let widthSlope = 650,
  heightSlope = 400,
  marginSlope = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 120
  },
  slopeGraphDomain = [0, 0.5],
  legendSlopeX = -100,
  totalLabelSlopeY = 220,
  widthStream = 650,
  heightStream = 400,
  marginStream = {
    top: 20,
    right: 30,
    bottom: 50,
    left: 110
  },
  legendStreamX = 20,
  totalLabelStreamY = 240,
  legendMargin = 10

let svg = d3.select('#graph-rabies').append('svg')
  .attr('viewBox', -marginSlope.left + ' ' + -marginSlope.top + ' ' + (widthSlope + marginSlope.left + marginSlope.right)  + ' ' + heightSlope)

d3.csv('data/rabies_summary_allyears.csv').then(data => {
  let color = [
    { text: 'Raccoon', color: '' },
    { text: 'Skunk', color: '' },
    { text: 'Bat', color: '' },
    { text: 'Fox', color: '' },
    { text: 'Woodchuck', color: '' },
    { text: 'Cat', color: ''},
    { text: 'Other*', color: '' },
    { text: 'Coyote', color: '' },
    { text: 'Dog', color: '' },
    { text: 'Cow', color: '' }
  ]

  let generated = ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2']

  color.forEach((c, i) => {
    c.color = generated[i]
  })

  let colorReportedRabid = [
    { text: 'Reported', color: '#309ef9' },
    { text: 'Rabid', color: '#f94343' }
  ]

  data.forEach(d => {
    d.Year = new Date(d.Year)
  })

  // create data entries
  let dataEntries = data.map(d => {
    let array = []
    Object.keys(d).forEach(k => {
      if (k != 'Year') {
        array.push({
          'year': d.Year,
          'animal': k,
          'percentage': d[k]
        })
      }
    })
    return array
  })

  let x = d3.scaleTime()
    .domain(d3.extent(data, d => d.Year))
    .range([marginSlope.left, widthSlope])

  let xStream = d3.scaleTime()
    .domain(d3.extent(data, d => d.Year))
    .range([marginStream.left, widthStream - marginStream.right])

  let y = d3.scaleLinear()
    .domain(slopeGraphDomain)
    .range([heightSlope - marginSlope.bottom, marginSlope.top])

  let yStream = d3.scaleLinear()
    .range([heightStream - marginStream.bottom, marginStream.top])

  let yAxis = g => g
    .attr('transform', `translate(${marginSlope.left},0)`)
    .call(d3.axisLeft(y).tickFormat(d3.format('.0%')))
    .call(g => g.select('.tick:last-of-type text').clone()
      .attr('x', 4)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold'))
    .attr('class', 'y-axis')

  let xAxis = g => g
    .attr('transform', `translate(0,${heightSlope - marginSlope.bottom + marginSlope.top})`)
    .call(d3.axisBottom(x))

  let xAxisStream = g => g
    .attr('transform', `translate(0,${heightStream - marginStream.bottom + marginStream.top})`)
    .call(d3.axisBottom(xStream))

  let formatTime = d3.timeFormat('%Y')

  // created nested structure for slopegraph
  let nestedByAnimal = d3.nest()
    .key(function (d) {
      return d.animal
    })
    .entries(flatten(dataEntries)) // pass in flattened data entries

  let borderLines = svg.append('g')
    .attr('class', 'border-lines')

  // 5 border lines, one for each year
  for (let i = 0; i < data.length; i++) {
     borderLines.append('line')
       .attr('x1', i * (widthSlope / 4))
       .attr('y1', marginSlope.top)
       .attr('x2', i * (widthSlope / 4))
       .attr('y2', heightSlope - marginSlope.bottom)

    borderLines.append('text')
      .text(formatTime(data[i].Year))
      .attr('dx', i * (widthSlope / 4))
      .attr('text-anchor', 'middle')
      .attr('dy', 10)
  }

  // 10 slope groups, one for each animal
  let slopeGroups = svg.append('g')
    .selectAll('g')
    .data(nestedByAnimal)
    .enter().append('g')
    .attr('class', d => 'slope-group ' + d.key)
    .attr('stroke', (d,i) => {
      let index = color.findIndex(function(c) {
        return c.text == d.key
      })
      return color[index].color
    })
    .attr('stroke-width', '5px')

  // data.length - 1 because we want intervals
  for (let i = 0; i < data.length - 1; i ++) {
    slopeGroups.append('line')
      .attr('x1', i * (widthSlope / 4))
      .attr('y1', function (d) {
        return y(d.values[i].percentage)
      })
      .attr('x2', (i + 1) * (widthSlope / 4))
      .attr('y2', function (d) {
        return y(d.values[i + 1].percentage)
      })
      .attr('class', 'slope-line')
  }

  // data.length because we want each year
  for (let i = 0; i < data.length; i++) {
    slopeGroups.append('circle')
      .attr('r', 5)
      .attr('fill', '#BEBF9F')
      .attr('cx', i * (widthSlope / 4))
      .attr('cy', d => y(d.values[i].percentage))
  }

  let scaleLabels = svg.append('g')
    .attr('class', 'scale-labels')
    .attr('transform', 'translate(' + (widthSlope + 10) + ',' + 0 + ')')

  scaleLabels.append('text')
    .text('50%')
    .attr('font-size', '10px')
    .attr('dy', 30)
    .attr('class', 'upper-scale-label')

  scaleLabels.append('text')
    .text('0%')
    .attr('font-size', '10px')
    .attr('dy', heightSlope - marginSlope.bottom + 5)
    .attr('class', 'lower-scale-label')

  function updateLegend(scale, marginLegend) {
    let legend = svg.selectAll('.legend')
      .data(scale)

    legend.attr('transform', function (d, i) {
      return 'translate(' + marginLegend.x + ',' + (i * 20 + marginLegend.y) + ')'
    })

    legend.select('rect')
      .style('fill', d => d.color)

    legend.select('text')
      .text(d => d.text)

    let legendGroups = legend.enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        return 'translate(' + marginLegend.x + ',' + (i * 20 + marginLegend.y) + ')'
      })

    legendGroups.append('rect')
      .attr('x', -20)
      .attr('y', -9)
      .style('fill', d => d.color)
      .style('stroke', 'black')
      .style('stroke-width', '0.5px')
      .attr('width', '10px')
      .attr('height', '10px')

    legendGroups.append('text')
      .style('font-size', '12px')
      .text(d => d.text)

    legend.exit().remove()
  }

  let total = svg.append('g')
    .attr('class', 'total')
    .attr('transform', function (d, i) {
      return 'translate(' + -marginSlope.left + ',' + totalLabelSlopeY + ')'
    })

  total.append('text')
    .text('Total Rabid:')
    .attr('class', 'total-key')
    .style('font-size', '12px')

  total.append('text')
    .attr('y', 20)
    .text('624')
    .attr('class', 'total-value')
    .style('font-size', '15px')

  updateLegend(color, { x: legendSlopeX, y: legendMargin })

  // streamgraph
  let stack = d3.stack().keys(data.columns.slice(1))
    .order(d3.stackOrderAscending)
    .offset(d3.stackOffsetWiggle)

  let layers = stack(data)

  let initialArea = d3.area()
    .x(function (d, i) { return xStream(d.data.Year) })
    .y0(heightStream)
    .y1(heightStream)

  let area = d3.area()
    .x(function (d, i) { return xStream(d.data.Year) })
    .y0(function (d) { return yStream(d[0]) })
    .y1(function (d) { return yStream(d[1]) })

  let streamGroup = svg.append('g').attr('transform', `translate(0,0)`)

  // enter exit update aaaaay
  function updateStreamGraph(data, area, color) {
    let totalRabid = 0

    data[0].forEach(d => {
      if (d.data.Rabid) {
        totalRabid = totalRabid + parseFloat(d.data.Rabid)
      } else if (d.data.Bat) {
        totalRabid = 624 // this is hardcoded because the data contains percentages, not number of animals
      }
    })

    d3.select('.total-value').text(totalRabid.toString())

    let selection = streamGroup.selectAll('.streamgraph-group')
      .data(data)

    selection.select('path').transition()
      .attr('d', area)
      .style('fill', function (d) {
        let index = color.findIndex(function (c) {
          return c.text == d.key
        })
        return color[index].color
      })
      .attr('class', d => d.key + ' streamgraph-path')

    selection.enter().append('g')
      .attr('class', 'streamgraph-group')
      .append('path')
      .attr('d', area)
      .style('fill', function (d) {
        let index = color.findIndex(function (c) {
          return c.text == d.key
        })
        return color[index].color
      })
      .attr('class', d => d.key + ' streamgraph-path')
      .style('opacity', 0)

    selection.exit().remove()
  }

  updateStreamGraph(layers, area, color)

  streamGroup.append('g')
    .attr('class', 'streamgraph-x-axis')
    .call(xAxisStream)
    .style('opacity', 0)

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
    .onStepExit(handleStepExit)

  function handleStepExit(node) {
    if (node.index === 0) {
       d3.selectAll('.slope-group')
         .transition()
         .style('opacity', 1)
    }
  }

  function handleStepEnter(node) {
    if (node.index === 0) highlightRaccoon()
    if (node.index === 1) highlightBat()
    if (node.index === 2) transitionToStreamGraph()
    if (node.index === 3) highlightStreams()
    if (node.index === 4) updateStreams()
    if (node.index === 5) streamDog()
    if (node.index === 7) streamCat()
    if (node.index === 8) streamBat()
  }

  function highlightRaccoon() {
    d3.selectAll('.slope-group')
      .transition()
      .style('opacity', d => {
        if (d.key != 'Raccoon') {
          return 0.1
        } else {
          return 1.0
        }
      })
  }

  function highlightBat() {
    d3.selectAll('.slope-group')
      .transition()
      .style('opacity', d => {
        if (d.key != 'Bat') {
          return 0.1
        } else {
          return 1.0
        }
      })

    svg.attr('viewBox', -marginSlope.left + ' ' + -marginSlope.top + ' ' + (widthSlope + marginSlope.left + marginSlope.right) + ' ' + heightSlope)

    d3.selectAll('.border-lines,.scale-labels')
      .transition()
      .style('opacity', 1)

    streamGroup.selectAll('.streamgraph-path')
      .transition() // might take out this transition
      .attr('d', initialArea)
      .style('opacity', 0)

    streamGroup.select('.streamgraph-x-axis')
      .style('opacity', 0)

    updateLegend(color, {
      x: legendSlopeX,
      y: legendMargin
    })

    d3.selectAll('.total')
      .attr('transform', function (d, i) {
        return 'translate(' + -marginSlope.left + ',' + totalLabelSlopeY + ')'
      })
  }

  function transitionToStreamGraph() {
    // remove unneeded labels
    d3.selectAll('.border-lines,.scale-labels,.slope-group')
      .style('opacity', 0)

    streamGroup.selectAll('.streamgraph-path')
      .style('opacity', 1)
      .transition() // might take out this transition
      .attr('d', area)

    streamGroup.select('.streamgraph-x-axis')
      .style('opacity', 1)

    updateLegend(color, { x: 20, y: 35 })

    d3.selectAll('.total')
      .attr('transform', function (d, i) {
        return 'translate(' + 0 + ',' + totalLabelStreamY + ')'
      })

    svg.attr('viewBox', '0 0 ' + widthStream + ' ' + heightStream)
  }

  function highlightStreams() {
    streamGroup.selectAll('.streamgraph-path')
      .transition()
      .style('opacity', d => {
        if (d.key != 'Raccoon' && d.key != 'Skunk' && d.key != 'Bat') {
          return 0.1
        } else {
          return 1.0
        }
      })
  }

  function updateStreams() {
    d3.select('.chart-title')
      .text('So which animals are rabid?')

    d3.select('.chart-description')
      .text('Percentage of each animal in the pool of 624 rabid animals, 2013 - 2017')
      .style('font-style', 'italic')

    updateStreamGraph(layers, area, color)

    d3.selectAll('.streamgraph-group').select('path').style('opacity', 1)

    updateLegend(color, { x: 20, y: 35 })

    d3.selectAll('.total')
      .attr('transform', function (d, i) {
        return 'translate(' + 0 + ',' + totalLabelStreamY + ')'
      })
  }

  function streamDog() {
    d3.selectAll('.total')
      .attr('transform', function (d, i) {
        return 'translate(' + 0 + ',' + 85 + ')'
      })

    updateLegend(colorReportedRabid, {
      x: 20,
      y: 35
    })

    d3.select('.chart-title')
      .text('Many dogs reported, but none are found rabid')

    d3.select('.chart-description')
      .text('Number of dogs reported versus dogs found rabid, 2013-2017')

    transitionToReportedVSRabid('Dog')
  }

  function streamCat() {
    d3.select('.chart-title')
      .text('More cats reported, but few are found rabid')

    d3.select('.chart-description')
      .text('Number of cats reported versus cats found rabid, 2013-2017')

    transitionToReportedVSRabid('Cat')
  }

  function streamBat() {
    d3.select('.chart-title')
      .text('Bats are the most reported animal')

    d3.select('.chart-description')
      .text('Number of bats reported versus bats found rabid, 2013-2017')

    transitionToReportedVSRabid('Bat')
  }

  function transitionToReportedVSRabid(animal) {
    d3.csv('data/reported_vs_rabid_allyears.csv').then(dataReportedRabid => {

      let dataFormatted = dataReportedRabid.map(d => {
        return {
          'Reported': d[animal + 's ' + 'Reported'],
          'Rabid': d[animal + 's ' + 'Rabid'],
          'Year': new Date(d.Year)
        }
      })

      let stackAnimal = d3.stack().keys(['Reported', 'Rabid'])
        .order(d3.stackOrderAscending)
        .offset(d3.stackOffsetWiggle)

      let layersAnimal = stackAnimal(dataFormatted)

      let xAnimal = d3.scaleTime()
        .domain(d3.extent(dataFormatted, d => d.Year))
        .range([marginStream.left, widthStream - marginStream.right])

      let yAnimal = d3.scaleLinear()
        .domain([0, 1500])
        .range([300 - marginStream.bottom, marginStream.top])

      let areaAnimal = d3.area()
        .x(function (d) { return xAnimal(d.data.Year) })
        .y0(function (d) { return yAnimal(d[0]) })
        .y1(function (d) { return yAnimal(d[1]) })

      updateStreamGraph(layersAnimal, areaAnimal, colorReportedRabid)
    })
  }

  function flatten(array) {
    return array.reduce((acc, val) => acc.concat(val), [])
  }
})