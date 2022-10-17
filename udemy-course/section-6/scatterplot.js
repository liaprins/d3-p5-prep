async function draw() {

  // data
  var dataset = await d3.json('scatterplot.json')

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

  var tooltip = d3.select("#tooltip");

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
    .attr('data-temp', yAccessor)
    /*
    .on('mouseenter', function(event, datum) {
      d3.select(this)
        .attr('fill', '#120078')
        .attr('r', 8);
      tooltip.style('display', 'block')
        .style('top', yScale(yAccessor(datum)) - 25 + 'px')
        .style('left', xScale(xAccessor(datum)) + 'px');

      var formatter = d3.format('.2f');
      var dateFormatter = d3.timeFormat('%B %-d, %Y')

      tooltip.select('.metric-humidity span')
        .text(formatter(xAccessor(datum)));
      tooltip.select('.metric-temp span')
        .text(formatter(yAccessor(datum)));
      tooltip.select('.metric-date')
        .text(dateFormatter(datum.currently.time * 1000));
    })
    .on('mouseleave', function(event) {
      d3.select(this)
        .attr('fill', 'black')
        .attr('r', 5);
      tooltip.style('display', 'none');
    });
    */

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

  // voronoi diagram
  var delaunay = d3.Delaunay.from(
    dataset,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
  );

  var voronoi = delaunay.voronoi()
    voronoi.xmax = dimensions.containerWidth;
    voronoi.ymax = dimensions.containerHeight;

  container.append('g')
    .selectAll('path')
    .data(dataset)
    .join('path')
    // .attr('stroke', 'black')
    .attr('fill', 'transparent')
    .attr('d', (d, i) => voronoi.renderCell(i))
    .on('mouseenter', function(event, datum) {
      container.append('circle')
        .classed('dot-hovered', true)
        .attr('fill', '#120078')
        .attr('r', 8)
        .attr('cx', d => xScale(xAccessor(datum)))
        .attr('cy', d => yScale(yAccessor(datum)))
        .style('pointer-events', 'none');
      tooltip.style('display', 'block')
        .style('top', yScale(yAccessor(datum)) - 25 + 'px')
        .style('left', xScale(xAccessor(datum)) + 'px');

      var formatter = d3.format('.2f');
      var dateFormatter = d3.timeFormat('%B %-d, %Y')

      tooltip.select('.metric-humidity span')
        .text(formatter(xAccessor(datum)));
      tooltip.select('.metric-temp span')
        .text(formatter(yAccessor(datum)));
      tooltip.select('.metric-date')
        .text(dateFormatter(datum.currently.time * 1000));
    })
    .on('mouseleave', function(event) {
      container.select('.dot-hovered').remove();
      tooltip.style('display', 'none');
    });

}

draw();
