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
        .attr('r', 4.5) // beware, all ye people afeared of constellations of small holes
        .style('fill', function(d, i) {
          var spread = 0.002;
          var numGranLangs = 13;
          var normalized = 0.0 + ((i / numGranLangs) * spread); // get a value between 0.0 and 1.0 for colors
          return d3.interpolateCool(normalized); // get that color from the spectrum
        })

}); // close CSV function
