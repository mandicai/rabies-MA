let width = 650,
  height = 400,
  margin = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 75
  }

let svgSlope = d3.select('#slopegraph-rabies').append('svg')
  .attr('viewBox', -margin.left + ' ' + -margin.top + ' ' + (width + margin.left + margin.right)  + ' ' + height)

let svg = d3.select('#streamgraph-rabies').append('svg')
  .attr('viewBox', '0 0 ' + width + ' ' + height)

d3.csv('data/rabies.csv').then(data => {
  let color = ['#D57500', '#8F3B1B', '#DBCA69', '#404F24', '#668D3C', '#B99C6B', '#BDD09F', '#4E6172', '#493829', '#816C5B']

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
    .range([margin.left, width])

  let y = d3.scaleLinear()
    .domain([0, 0.5])
    .range([height - margin.bottom, margin.top])

  let formatTime = d3.timeFormat('%Y')

  // created nested structure for sleopgraph
  let nestedByAnimal = d3.nest()
    .key(function (d) {
      return d.animal
    })
    .entries(flatten(dataEntries)) // pass in flattened data entries

  let borderLines = svgSlope.append('g')
    .attr('class', 'border-lines')

  // 5 border lines, one for each year
  for (let i = 0; i < data.length; i++) {
     borderLines.append('line')
       .attr('x1', i * (width / 4))
       .attr('y1', margin.top)
       .attr('x2', i * (width / 4))
       .attr('y2', height - margin.bottom)

    borderLines.append('text')
      .text(formatTime(data[i].Year))
      .attr('dx', i * (width / 4))
      .attr('text-anchor', 'middle')
      .attr('dy', 10)
  }

  // 10 slope groups, one for each animal
  let slopeGroups = svgSlope.append('g')
    .selectAll('g')
    .data(nestedByAnimal)
    .enter().append('g')
    .attr('class', 'slope-group')
    .attr('stroke', (d,i) => color[i])

  // data.length - 1 because we want intervals
  for (let i = 0; i < data.length - 1; i ++) {
    slopeGroups.append('line')
      .attr('x1', i * (width / 4))
      .attr('y1', function (d) {
        return y(d.values[i].percentage)
      })
      .attr('x2', (i + 1) * (width / 4))
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
      .attr('cx', i * (width / 4))
      .attr('cy', d => y(d.values[i].percentage))
  }

  slopeGroups.append('text')
    .text(d => d.key)
    .attr('dy', function (d) {
      return y(d.values[0].percentage) + 3
    })
    .attr('dx', -margin.left)
    .attr('stroke', 'none')
    .attr('font-size', '10px')

  let slopeScaleLabels = svgSlope.append('g')
    .attr('class', 'slope-scale-labels')

  slopeScaleLabels.append('text')
    .text('50%')
    .attr('font-size', '10px')
    .attr('dx', width + 10)
    .attr('dy', 30)

  slopeScaleLabels.append('text')
    .text('0%')
    .attr('font-size', '10px')
    .attr('dx', width + 10)
    .attr('dy', height - margin.bottom + 5)

  let stack = d3.stack().keys(data.columns.slice(1))
    .order(d3.stackOrderAscending)
    .offset(d3.stackOffsetWiggle)

  let layers = stack(data)

  let area = d3.area()
    .x(function (d, i) { return x(d.data.Year) })
    .y0(function (d) { return y(d[0]) })
    .y1(function (d) { return y(d[1]) + 3 })

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

  function flatten(array) {
    return array.reduce((acc, val) => acc.concat(val), [])
  }
})