var w = 1000;
var h = 630;

var hexSvg = d3.select('#hex-vis')
  .append('svg')
    .attr('width', w)
    .attr('height', h);
var hexContainer = hexSvg.append('g') // group to hold centroid symbols
  .attr('id', 'hex-container')
  .attr('transform', 'translate(25, 25)');

// load CSV of county etymology data
d3.csv('data_counties-hex-years.csv')
  .then(function(data) {

    // establish county centroids
    hexContainer.selectAll('.hex')
      .data(data)
      .enter()
      .append('line')
        .attr('id', function(d) {
          return d.fullname;
        })
        .attr('class', function(d) {
          return 'hex hex-' + d.granularlanguage;
        })
        .attr('x1', function(d) {
          return (d.x) * 11;
        })
        .attr('y1', function(d) {
          var ageLength = (2021 - parseFloat(d.year)) * 0.055;
          return ((d.y) * 9.5) + ageLength;
        })
        .attr('x2', function(d) {
          return (d.x) * 11;
        })
        .attr('y2', function(d) {
          var ageLength = (2021 - parseFloat(d.year)) * 0.055;
          return ((d.y) * 9.5) - ageLength;
        })
        .style('stroke-width', 5.5)
        .style('stroke', function(d, i) {

          if (d.parentlanguage == 'euro') {
            var j = d3.interpolateRgb("rgb(255, 255, 0)", "rgb(175, 175, 0)");

            if (d.granularlanguage == 'battle') {
              return j(0.0);
            } else if (d.granularlanguage == 'combination') {
              return j(0.1);
            } else if (d.granularlanguage == 'concept') {
              return j(0.2);
            } else if (d.granularlanguage == 'creation') {
              return j(0.3);
            } else if (d.granularlanguage == 'flora') {
              return j(0.4);
            } else if (d.granularlanguage == 'geology') {
              return j(0.5);
            } else if (d.granularlanguage == 'man') {
              return j(0.6);
            } else {
              return j(0.7);
            }
          } else { // parent language is Nat Am
            var k = d3.interpolateRgb("rgb(0, 255, 255)", "rgb(0, 175, 175)");

            if (d.granularlanguage == 'object') {
              return k(0.1);
            } else if (d.granularlanguage == 'place') {
              return k(0.2);
            } else if (d.granularlanguage == 'resource') {
              return k(0.3);
            } else if (d.granularlanguage == 'woman') {
              return k(0.4);
            } else if (d.granularlanguage == 'unknown') {
              return k(0.5);
            }
          }
        })
        .append('title')
        .text(function(d) {
          return d.fullname + ' // ' + d.granularlanguage;
        });

}); // close CSV function
