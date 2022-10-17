async function draw() {
  // Data
  const dataset = await d3.csv('stackedbars.csv', (d, index, columns) => {
    // d['<10'] => parseInt(d['<10'])
    d3.autoType(d)

    d.total = d3.sum(columns, (c) => d[c])

    return d
  })

  dataset.sort((a, b) => b.total - a.total);

  // Dimensions
  let dimensions = {
    width: 1000,
    height: 600,
    margins: 20,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g")
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  // Scales
  var stackGenerator = d3.stack()
    .keys(dataset.columns.slice(1));

  var stackData = stackGenerator(dataset)
    .map((ageGroup) => {
      ageGroup.forEach((state) => {
        state.key = ageGroup.key
      })
      return ageGroup;
    });

  var yScale = d3.scaleLinear()
    .domain([
      0,
      d3.max(stackData, (ag) => {
        return d3.max(ag, state => state[1])
      })
    ])
    .rangeRound([dimensions.ctrHeight, dimensions.margins]);

  var xScale = d3.scaleBand()
    .domain(dataset.map(state => state.name))
    .range([dimensions.margins, dimensions.ctrWidth])
    // .paddingInner(0.1)
    // .paddingOuter(0.1);
    .padding(0.1);

  var colorScale = d3.scaleOrdinal()
    .domain(stackData.map(d => d.key))
    .range(d3.schemeSpectral[stackData.length])
    .unknown('#CCCCCC');

  // draw bars
  var ageGroups = ctr.append('g')
    .classed('age-groups', true)
    .selectAll('g')
    .data(stackData)
    .join('g')
    .attr('fill', d => colorScale(d.key));

  ageGroups.selectAll('rect')
    .data(d => d)
    .join('rect')
    .attr('x', d => xScale(d.data.name))
    .attr('y', d => yScale(d[1]))
    .attr('width', xScale.bandwidth())
    .attr('height', d => yScale(d[0]) - yScale(d[1]));

  // draw axes
  var xAxis = d3.axisBottom(xScale)
    .tickSizeOuter(0);

  var xAxisGroup = ctr.append('g')
    .style('transform', 'translateY(' + dimensions.ctrHeight + 'px)')
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale)
    .ticks(null, 's');

  var yAxisGroup = ctr.append('g')
    .style('transform', 'translateX(' + dimensions.margins + 'px)')
    .call(yAxis);
}

draw()
