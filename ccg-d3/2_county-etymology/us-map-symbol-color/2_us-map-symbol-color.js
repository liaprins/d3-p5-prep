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

// load CSV of county etymology data
d3.csv('data_county-etymologies_3.csv', function(data) {

  // load JSON of county outlines
  d3.json('../data_counties-20m.json', function(json) {

    for (var i = 0; i < data.length; i++) {

      var etyCountyId = data[i].id; // get county id from etymology CSV
      var etyCountyLanguage = data[i].language; // get language per county

      for (var j = 0; j < json.features.length; j++) { // find the corresponding county id within the GeoJSON

        var pathCountyId = json.features[j].properties.STATE + json.features[j].properties.COUNTY;

        if (etyCountyId == pathCountyId) {
          console.log(etyCountyId + ' // ' + pathCountyId);
          json.features[j].properties.language = etyCountyLanguage; // copy the language into the JSON per county
          break; // stop looking through the JSON
        }
      }
    }

    // drawing county paths
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
        .attr('d', path)
        .attr('class', 'county-outline')
        // .style('fill', '#ffffff')
        .filter(function (d) {
          return (d.properties.language == 'European') || (d.properties.language == 'Native American');
        })
        .style('fill', 'red')
        .filter(function (d) {
          return (d.properties.language == 'European');
        })
        .style('fill', 'orange')
        .style('stroke', '#eeeeee')
        .style('stroke-width', 0.5);

  }); // close JSON function

}); // close CSV function
