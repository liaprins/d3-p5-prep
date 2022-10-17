var w = 1000;
var h = 700;

var svg = d3.select('#vis')
  .append('svg')
    .attr('width', w)
    .attr('height', h)
    // .style('background', '#eeeeee');

var projection = d3.geoAlbersUsa()
  .translate([w/2, h/2])
  .scale([1200]);

var path = d3.geoPath()
  .projection(projection);

// load JSON of county outlines
d3.json('../data_counties-20m.json', function(json) {

  svg.selectAll('path')
    .data(json.features)
    .enter()
    .append('path')
      .attr('d', path)
      .attr('class', 'county-outline')
      // .style('fill', '#ffffff')
      .style('fill', 'none')
      .style('stroke', '#eeeeee')
      .style('stroke-width', 0.5);

  // load CSV of county etymology data
  d3.csv('data_county-etymologies_3.csv', function(data) {

    // establish county centroids
    svg.selectAll('circle')
      .data(json.features)
      .enter()
      .append('circle')
        .attr('class', 'county-centroid')
        .attr('cx', function(d) {
          return path.centroid(d)[0];
        })
        .attr('cy', function(d) {
          return path.centroid(d)[1];
        })
        .attr('r', 2);

  }); // close CSV function

  console.log('test oooo! :)')

}); // close JSON function
