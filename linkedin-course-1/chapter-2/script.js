var barData = [20, 30, 45, 15];
var width = 600,
    height = 400,
    barWidth = 50,
    barOffset = 5;

d3.select('#vis')
  .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#c9d7d6')
  .selectAll('rect')
    .data(barData)
    .enter()
    .append('rect')
      .style('fill', '#c61c6f')
      .attr('width', barWidth)
      .attr('height', function(d) {
        return d;
      })
      .attr('x', function(d, i) {
        return i * (barWidth + barOffset);
      })
      .attr('y', function(d){
        return height - d;
      })



/*
d3.select('#vis')
  .append('svg')
    .attr('width', 600)
    .attr('height', 400)
    .style('background', '#93a1a1')
  .append('rect')
    .attr('x', 200)
    .attr('y', 100)
    .attr('width', 200)
    .attr('height', 200)
    .style('fill', '#cb4b19');

d3.select('#vis').select('svg')
  .append('circle')
    .attr('cx', 300)
    .attr('cy', 200)
    .attr('r', 50)
    .style('fill', '#840043');
*/
