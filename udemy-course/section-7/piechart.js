async function draw() {
  // Data
  const dataset = await d3.csv('piechart.csv')

  // Dimensions
  let dimensions = {
    width: 600,
    height: 600,
    margins: 10,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2
  var myRadius = dimensions.ctrWidth / 2;

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

  // Scales
  var popPie = d3.pie()    //
    .value((d) => d.population)
    .sort(null);

  var slices = popPie(dataset)

  var myArc = d3.arc()
    .outerRadius(myRadius)
    // .innerRadius(0);
    .innerRadius(0);

  var labelArc = d3.arc()
    .outerRadius(myRadius)
    // .innerRadius(0);
    .innerRadius(myRadius / 1.75);

  // var colors = d3.quantize((t) => d3.interpolateSpectral(), dataset.length);
  var colors = d3.quantize(d3.interpolateSpectral, dataset.length);

  var colorScale = d3.scaleOrdinal()
    .domain(dataset.map(el => el.name))
    .range(colors);

  // draw shape
  var arcGroup = ctr.append('g')
    .attr(
      'transform',
      'translate(' + dimensions.ctrHeight / 2 + ',' + dimensions.ctrHeight / 2 + ')'
    );

  arcGroup.selectAll('path')
    .data(slices)
    .join('path')
    .attr('d', myArc)
    .attr('fill', d => colorScale(d.data.name));

  var labelsGroup = ctr.append('g')
    .attr(
      'transform',
      'translate(' + dimensions.ctrHeight / 2 + ',' + dimensions.ctrHeight / 2 + ')'
    )
    .classed('labels', true);

  labelsGroup.selectAll('text')
    .data(slices)
    .join('text')
    // .attr('transform', d => + 'translate(' + myArc.centroid(d) + ')')
    .attr('transform', d => `translate(${labelArc.centroid(d)})`)
    .call(
      text => text.append('tspan')
        .style('font-weight', 'bold')
        .attr('y', -4)
        .text(d => d.data.name)
    )
    .call(
      text => text.filter((d) => (d.endAngle - d.startAngle) > 0.25)
        .append('tspan')
        .attr('y', 9)
        .attr('x', 0)
        .text(d => d.data.population)
    )
}

draw()
