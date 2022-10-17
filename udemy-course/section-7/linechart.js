async function draw() {
  // Data
  const dataset = await d3.csv('linechart.csv')

  var parseDate = d3.timeParse('%Y-%m-%d');
  const xAccessor = d => parseDate(d.date);
  const yAccessor = d => parseInt(d.close);

  // Dimensions
  let dimensions = {
    width: 1000,
    height: 500,
    margins: 50,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  var tooltip = d3.select('#tooltip')

  var tooltipDot = ctr.append('circle')
    .attr('r', 5)
    .attr('fill', '#fc8681')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .style('opacity', 0)
    .style('pointer-events', 'none');

  // Scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.ctrHeight, 0])
    .nice()

  var xScale = d3.scaleUtc()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.ctrWidth]);

  // console.log(xScale(xAccessor(dataset[0])), dataset[0])

  var lineGenerator = d3.line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  // console.log(lineGenerator(dataset))

  ctr.append('path')
    .datum(dataset)
    .attr('d', lineGenerator)
    .attr('fill', 'none')
    .attr('stroke', '#30475e')
    .attr('stroke-width', 2);

  // draw axes
  var xAxis = d3.axisBottom(xScale)
    .ticks(5);

  var xAxisGroup = ctr.append('g')
    .call(xAxis)
    .attr(
      'transform',
      'translate(0,' + dimensions.ctrHeight + ')'
    );

  xAxisGroup.append('text')
    .attr('x', dimensions.ctrWidth / 2)
    .attr('y', dimensions.margins / 1.25)
    .attr('fill', 'black')
    .text('Date');

  var yAxis = d3.axisLeft(yScale)
    .tickFormat((d) => '$' + d);

  var yAxisGroup = ctr.append('g')
    .call(yAxis);

  yAxisGroup.append('text')
    .attr('x', -dimensions.ctrHeight / 2)
    .attr('y', -dimensions.margins / 1.25)
    .attr('fill', 'black')
    .html('Closing price')
    .style('transform', 'rotate(270deg)')
    .style('text-anchor', 'middle');

  // tooltip
  ctr.append('rect')
    .attr('width', dimensions.ctrWidth)
    .attr('height', dimensions.ctrHeight)
    .style('opacity', 0)
    .on('touchmouse mousemove', function(event) {
      var mousePos = d3.pointer(event, this)
      var getDate = xScale.invert(mousePos[0])

      // custom bisector: left, center, right
      var myBisector = d3.bisector(xAccessor).left;
      var getIndex = myBisector(dataset, getDate);
      var stock = dataset[getIndex - 1];
      // console.log(stock);

      // update chart
      tooltipDot.style('opacity', 0.8)
        .attr('cx', xScale(xAccessor(stock)))
        .attr('cy', yScale(yAccessor(stock)))
        .raise();

      tooltip.style('display', 'block')
        .style('top', yScale(yAccessor(stock)) - 20 + 'px')
        .style('left', xScale(xAccessor(stock)) + 'px')
        .style('opacity', 0.8);

      tooltip.select('.price')
        .text('$' + yAccessor(stock));

      var dateFormatter = d3.timeFormat('%B %-d, %Y');

      tooltip.select('.date')
        .text(dateFormatter(xAccessor(stock)));
    })
    .on('mouseleave', function(event) {
      tooltipDot.style('opacity', 0);
      tooltip.style('display', 'none');
    });

}

draw()
