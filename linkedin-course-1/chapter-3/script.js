// var barData = [20, 19, 5, 40, 41, 30, 45, 15];

var barData = [];
  for (var i = 0; i < 30; i++) {
    barData.push(Math.random() * 30);
  }

var width = 600,
    height = 400,
    barWidth = 50,
    barOffset = 5

var tempColor;

var yScale = d3.scaleLinear()
  .domain([0, d3.max(barData)])
  .range([0, height]);

var xScale = d3.scaleBand()
  .domain(barData)
  .range([0, width])
  .paddingInner(0.2)
  .paddingOuter(0.4);

var colorScale = d3.scaleLinear()
  .domain([0,
           barData.length * 0.33,
           barData.length * 0.67,
           d3.max(barData)])
  .range(['#b58929', '#c61c6f', '#268bd2', '#ffb832']);

var tooltip = d3.select('body')
  .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background-color', 'white')
    .style('opacity', 0);

var myChart =
d3.select('#vis')
  .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#c9d7d6')
  .selectAll('rect')
    .data(barData)
    .enter()
    .append('rect')
      .style('fill', function(d) {
        return colorScale(d);
      })
      .attr('width', function(d) {
        return xScale.bandwidth();
      })
      /* .attr('height', function(d) {
        return yScale(d);
      }) */
      .attr('height', 0)
      .attr('x', function(d) {
        return xScale(d)
      })
      /* .attr('y', function(d){
        return height - yScale(d);
      }) */
      .attr('y', height)
      .on('mouseover', function(d) {
        tempColor = this.style.fill; // only defining the tempColor within mouseover, that way on mouseout it goes back to having no value
        d3.select(this)
          .transition()
          .style('fill', 'yellow');
      })
      .on('mouseout', function(d) {

        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9)

        tooltip.html(d)
          .style('left', (d3.event.pageX -35) + 'px')
          .style('left', (d3.event.pageY -30) + 'px')

        tempColor
        d3.select(this)
        .transition()
        .style('fill', tempColor);
      });

  myChart.transition()
    .attr('height', function(d) {
      return yScale(d);
    })
    .attr('y', function(d){
      return height - yScale(d);
    })
    .delay(function(d, i) {
      return i * 20
    })
    .ease(d3.easeBounceOut);
