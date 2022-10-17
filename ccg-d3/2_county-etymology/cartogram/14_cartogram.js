var w = 900;
var h = 650;

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
      .append('rect')
        .attr('id', function(d) {
          return d.fullname;
        })
        .attr('class', function(d) {
          return 'hex hex-' + d.granularlanguage;
        })
        .attr('x', function(d) {
          return (Math.round(d.x)) * 10;
        })
        .attr('y', function(d) {
          return (d.y) * 10;
        })
        .attr('width', 10) // make width smaller to have white padding between counties
        .attr('height', 10) // make width smaller to have white padding between counties
        .style('fill', function(d, i) {

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
        .on('mouseover', function(d) {
          var currentHoverLang = d3.select(this).attr('class');
          hexContainer.selectAll('.hex')
            .each(function(d) {
              if (d3.select(this).attr('class') == currentHoverLang) {
                /* do nothing */
              } else {
                d3.select(this)
                  .style('opacity', 0.2);
              }
            })
        })
        .on('mouseout', function(d) {
          hexContainer.selectAll('.hex')
            .each(function(d) {
              d3.select(this)
                .style('opacity', 1);
              })
        })
        .append('title')
        .text(function(d) {
          return d.fullname + ' // ' + d.granularlanguage;
        });

}); // close CSV function
