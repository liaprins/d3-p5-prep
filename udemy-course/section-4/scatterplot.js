async function draw() {

  // data
  var dataset = await d3.json('data.json')

  var xAccessor = (d) => d.currently.humidity;
  var yAccessor = (d) => d.currently.apparentTemperature;

  // dimensions
  let dimensions = {
    width: 800,
    height: 800,
    margin: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    }
  };

  dimensions.containerHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
  dimensions.containerWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;

  // draw chart
  var svg = d3.select('#chart')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  var container = svg.append('g')
    .attr(
      'transform',
      'translate(' + dimensions.margin.left + ',' + dimensions.margin.right + ')'
    );

  // scales
  var xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .rangeRound([0, dimensions.containerWidth])
    .clamp(true);

  var yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .rangeRound([dimensions.containerHeight, 0])
    .nice()
    .clamp(true);

  // draw circles
  container.selectAll('circle')
    .data(dataset)
    .join('circle')
    .attr('cx', d => xScale(xAccessor(d)))
    .attr('cy', d => yScale(yAccessor(d)))
    .attr('r', 5)
    .attr('opacity', '0.5')
    .attr('data-temp', yAccessor);

  // axes
  var xAxis = d3.axisBottom(xScale)
    .ticks(5)
    .tickFormat((d) => d * 100 + '%');
    // .tickValues([0.4, 0.5, 0.8]);

  var xAxisGroup = container.append('g')
    .call(xAxis)
    .attr(
      'transform',
      'translate(0,' + dimensions.containerHeight + ')'
    )
    .classed('axis', true);

  xAxisGroup.append('text')
    .attr('x', dimensions.containerWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .attr('fill', 'black')
    .text('Humidity');

  var yAxis = d3.axisLeft(yScale);

  var yAxisGroup = container.append('g')
    .call(yAxis)
    // .attr(
      // 'transform',
      // 'translate(' + dimensions.margin.left + ',0)'
    // )
    .classed('axis', true);

  yAxisGroup.append('text')
    .attr('x', -dimensions.containerHeight / 2)
    .attr('y', -dimensions.margin.left + 15)
    .attr('fill', 'black')
    .html('Apparent Temperature &deg; F')
    .style('transform', 'rotate(270deg)')
    .style('text-anchor', 'middle');

}

draw();
