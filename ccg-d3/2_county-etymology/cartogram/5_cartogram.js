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

// using temporarily for nicer colors before determine final design
var color = d3.scaleOrdinal(d3.schemePaired);

// establish function to convert CSV categories to words in UI
var colorConverter = function(v) {
  if (v == 'man') {
    return {
      granularLanguageColor: color(1) };
  } else if (v == 'woman') {
    return {
      granularLanguageColor: color(2) };
  } else if (v == 'group') {
    return {
      granularLanguageColor: color(3) };
  } else if (v == 'flora') {
    return {
      granularLanguageColor: color(4) };
  } else if (v == 'geology') {
    return {
      granularLanguageColor: color(5) };
  } else if (v == 'resource') {
    return {
      granularLanguageColor: color(6) };
  } else if (v == 'place') {
    return {
      granularLanguageColor: color(7) };
  } else if (v == 'battle') {
    return {
      granularLanguageColor: color(8)};
  } else if (v == 'object') {
    return {
      granularLanguageColor: color(9) };
  } else if (v == 'concept') {
    return {
      granularLanguageColor: color(10) };
  } else if (v == 'creation') {
    return {
      granularLanguageColor: color(11) };
  } else if (v == 'combination') {
    return {
      granularLanguageColor: color(12) };
  } else {
    return {
      categoryLabel: 'Unknown reason!!',
      granularLanguageColor: color(13) };
  }
};

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
          return (d.y) * 11;
        })
        .attr('r', 4) // beware, all ye people afeared of constellations of small holes
        .style('fill', function(d) {
          return colorConverter(d.granularlanguage).granularLanguageColor;
        })

}); // close CSV function
