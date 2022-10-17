var w = 1000;
var h = 700;

var hexSvg = d3.select('#hex-vis')
  .append('svg')
    .attr('width', w)
    .attr('height', h)
    .style('background', '#eeeeee');
var hexContainer = hexSvg.append('g') // group to hold centroid symbols
  .attr('id', 'hex-container')
  .attr('transform', 'translate(25, 25)');

// load CSV of county etymology data
d3.csv('data_counties-hex.csv')
  .then(function(data) {

    // establish county centroids
    hexContainer.selectAll('.hex')
      .data(data)
      .enter()
      .append('circle')
        .attr('class', 'hex')
        .attr('cx', function(d) {
          return (d.x) * 11;
        })
        .attr('cy', function(d) {
          return (d.y) * 9.5;
        })
        .attr('r', 5); // beware, all ye people afeared of constellations of small holes

}); // close CSV function
