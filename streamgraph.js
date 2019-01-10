let width = 650,
  height = 400,
  margin = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 120
  }

let svgSlope = d3.select('#slopegraph-rabies').append('svg')
  .attr('viewBox', -margin.left + ' ' + -margin.top + ' ' + (width + margin.left + margin.right)  + ' ' + height)

let svg = d3.select('#streamgraph-rabies').append('svg')
  .attr('viewBox', '0 0 ' + width + ' ' + height)

d3.csv('data/rabies.csv').then(data => {
  let color = [
    {
      text: 'Raccoon',
      color: '#D57500'
    },
    {
      text: 'Skunk',
      color: '#8F3B1B'
    },
    {
      text: 'Bat',
      color: '#DBCA69'
    },
    {
      text: 'Fox',
      color: '#404F24'
    },
    {
      text: 'Woodchuck',
      color: '#668D3C'
    },
    {
      text: 'Cat',
      color: '#B99C6B'
    },
    {
      text: 'Other*',
      color: '#BDD09F'
    },
    {
      text: 'Coyote',
      color: '#4E6172'
    },
    {
      text: 'Dog',
      color: '#493829'
    },
    {
      text: 'Cow',
      color: '#816C5B'
    }
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
    .range([margin.left, width])

  let xStream = d3.scaleTime()
    .domain(d3.extent(data, d => d.Year))
    .range([30, width - margin.right])

  let y = d3.scaleLinear()
    .domain([0, 0.5])
    .range([height - margin.bottom, margin.top])

  let yStream = d3.scaleLinear()
    .range([height - margin.bottom - 20, margin.top])

  let formatTime = d3.timeFormat('%Y')

  // created nested structure for slopegraph
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
    .attr('class', d => 'slope-group ' + d.key)
    .attr('stroke', (d,i) => {
      let index = color.findIndex(function(c) {
        return c.text == d.key
      })
      return color[index].color
    })

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

  // slopeGroups.append('text')
  //   .text(d => d.key)
  //   .attr('dy', function (d) {
  //     return y(d.values[0].percentage) + 3
  //   })
  //   .attr('dx', -margin.left)
  //   .attr('stroke', 'none')
  //   .attr('font-size', '10px')
  //   .attr('class', 'slope-group-text')

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

  let legend = svgSlope.selectAll('.legend')
    .data(color)
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      return 'translate(' + -90 + ',' + (i * 20) + ')'
    })

  legend.append('rect')
    .attr('x', -20)
    .attr('y', -9)
    .style('fill', d => d.color)
    .style('stroke', 'black')
    .style('stroke-width', '0.5px')
    .attr('width', '10px')
    .attr('height', '10px')

  legend.append('text')
    .style('font-size', '12px')
    .text(d => d.text)

  // streamgraph
  let stack = d3.stack().keys(data.columns.slice(1))
    .order(d3.stackOrderAscending)
    .offset(d3.stackOffsetWiggle)

  let layers = stack(data)

  let initialArea = d3.area()
    .x(function (d, i) { return xStream(d.data.Year) })
    .y0(height)
    .y1(height)

  let area = d3.area()
    .x(function (d, i) { return xStream(d.data.Year) })
    .y0(function (d) { return yStream(d[0]) })
    .y1(function (d) { return yStream(d[1]) + 5 })

  let yAxis = g => g
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat(d3.format('.0%')))
    .call(g => g.select('.tick:last-of-type text').clone()
      .attr('x', 4)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold'))
    .attr('class', 'y-axis')

  let xAxis = g => g
    .attr('transform', `translate(0,${height - margin.bottom + margin.top})`)
    .call(d3.axisBottom(x))

  let xAxisStream = g => g
    .attr('transform', `translate(0,${height - margin.bottom - 20 + margin.top})`)
    .call(d3.axisBottom(xStream))

  let streamGroup = svgSlope.append('g').attr('transform', `translate(0,0)`)

  streamGroup.selectAll('path')
    .data(layers)
    .enter().append('g')
    .attr('class', 'streamgraph-group')
    .append('path')
    .attr('d', initialArea)
    .style('fill', function (d) {
      let index = color.findIndex(function (c) {
        return c.text == d.key
      })
      return color[index].color
    })
    .attr('class', d => d.key + ' streamgraph-path')
    .style('opacity', 0)

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
    // .onContainerEnter(handleContainerEnter)
    // .onContainerExit(handleContainerExit)

  function handleStepEnter(node) {
    if (node.index === 0) {
      d3.selectAll('.slope-group')
        .transition()
        .style('opacity', d => {
          if (d.key != 'Raccoon') {
            return 0.1
          } else {
            return 1.0
          }
        })
    } else if (node.index === 1) {
      d3.selectAll('.slope-group')
        .transition()
        .style('opacity', d => {
          if (d.key != 'Bat') {
            return 0.1
          } else {
            return 1.0
          }
        })

      svgSlope.attr('viewBox', -margin.left + ' ' + -margin.top + ' ' + (width + margin.left + margin.right) + ' ' + height)

      d3.selectAll('.border-lines,.slope-scale-labels')
        .transition()
        .style('opacity', 1)

      streamGroup.selectAll('.streamgraph-path')
        .transition().duration(1000) // might take out this transition
        .attr('d', initialArea)
        .style('opacity', 0)

      streamGroup.select('.streamgraph-x-axis')
        .style('opacity', 0)

    } else if (node.index === 2) {
      transitionToStreamGraph()

      streamGroup.selectAll('.streamgraph-path')
        .style('opacity', 1)

    } else if (node.index === 3) {
      streamGroup.selectAll('.streamgraph-path')
        .transition()
        .duration(750)
        .style('opacity', d => {
          if (d.key != 'Raccoon' && d.key != 'Skunk' && d.key != 'Bat') {
            return 0.1
          } else {
            return 1.0
          }
        })
    }
  }

  function transitionToStreamGraph() {
    // remove unneeded labels
    d3.selectAll('.border-lines,.slope-scale-labels,.slope-group')
      .style('opacity', 0)

    streamGroup.selectAll('.streamgraph-path')
      .style('opacity', 1)
      .transition().duration(1000) // might take out this transition
      .attr('d', area)

    streamGroup.select('.streamgraph-x-axis')
      .style('opacity', 1)

    svgSlope.attr('viewBox', '0 0 ' + width + ' ' + height)

    // // create axes
    // // let yAxisGroup = streamGroup.append('g')
    // //   .call(yAxis)

    // streamGroup.append('text')
    //   .attr('transform', 'rotate(-90)')
    //   .attr('y', -2)
    //   .attr('x', -80)
    //   .attr('dy', '1em')
    //   .attr('font-size', '10px')
    //   .style('text-anchor', 'middle')
    //   .text('% of Total Rabid Animals')

    // transition the lines to the same coordinates as the paths here
    // console.log(layers)

    // streamGroup.append('line')
    //   .attr('x1', 0)
    //   .attr('y1', y(0.321))
    //   .attr('x2', 0)
    //   .attr('y2', y(0.65))
    //   .attr('stroke', 'black')

    // let area = d3.area()
    //   .x(function (d, i) {
    //     return x(d.data.Year)
    //   })
    //   .y0(function (d) {
    //     return y(d[0])
    //   })
    //   .y1(function (d) {
    //     return y(d[1]) + 3
    //   })
  }

  function handleStepExit(node) {
    if (node.index === 0) {
      d3.selectAll('.slope-group')
        .transition()
        .style('opacity', 1)
    }
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