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
d3.csv('data_counties-hex.csv')
  .then(function(data) {

    // establish county centroids
    hexContainer.selectAll('.hex')
      .data(data)
      .enter()
      .append('circle')
        .attr('class', function(d) {
          return 'hex hex-' + d.granularlanguage;
        })
        .attr('cx', function(d) {
          return (d.x) * 11;
        })
        .attr('cy', function(d) {
          return (d.y) * 9.5;
        })
        .attr('r', 5) // beware, all ye people afeared of constellations of small holes
        .style('stroke-width', 2.5)
        .style('stroke', 'white')
        .style('fill', function(d, i) {
          var parentLang = d.parentlanguage;
          var thisGranLang;
          if (d.granularlanguage == 'battle') {
            thisGranLang = 1;
          } else if (d.granularlanguage == 'combination') {
            thisGranLang = 2;
          } else if (d.granularlanguage == 'concept') {
            thisGranLang = 3;
          } else if (d.granularlanguage == 'creation') {
            thisGranLang = 4;
          } else if (d.granularlanguage == 'flora') {
            thisGranLang = 5;
          } else if (d.granularlanguage == 'geology') {
            thisGranLang = 6;
          } else if (d.granularlanguage == 'man') {
            thisGranLang = 7;
          } else if (d.granularlanguage == 'object') {
            thisGranLang = 8;
          } else if (d.granularlanguage == 'place') {
            thisGranLang = 9;
          } else if (d.granularlanguage == 'resource') {
            thisGranLang = 10;
          } else if (d.granularlanguage == 'woman') {
            thisGranLang = 11;
          } else if (d.granularlanguage == 'group') {
            thisGranLang = 12;
          } else{
            thisGranLang = 13;
          }
          var spread = 0.4;
          var numGranLangs = 13;
          if (parentLang == 'euro') {
            var startingPoint = 0.0;
            var normalized = startingPoint + ((thisGranLang / numGranLangs) * spread); // get a value between 0.0 and 1.0 for colors
            return d3.interpolateWarm(normalized); // get that color from the spectrum
          } else {
            var startingPoint = 0.5;
            var normalized = startingPoint + ((thisGranLang / numGranLangs) * spread); // get a value between 0.0 and 1.0 for colors
            return d3.interpolateCool(normalized); // get that color from the spectrum
          }
        })
        .on('mouseover', function(d) {

          var currentHoverLang = d3.select(this).attr('class');

          hexContainer.selectAll('.hex')
            .each(function(d) {
              if (d3.select(this).attr('class') == currentHoverLang) {
                d3.select(this)
                  .style('stroke', 'black');
              }
            })
          console.log(d3.select(this).attr('class'));
        })
        .on('mouseout', function(d) {

          hexContainer.selectAll('.hex')
            .each(function(d) {
              d3.select(this)
                .style('stroke', 'white');
            })
          console.log(d3.select(this).attr('class'));
        });

}); // close CSV function
