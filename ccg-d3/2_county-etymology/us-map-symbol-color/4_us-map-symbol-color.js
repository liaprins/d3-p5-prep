var w = 1000;
var h = 700;

var svg = d3.select('#vis')
  .append('svg')
    .attr('width', w)
    .attr('height', h)
    .style('background', '#eeeeee');

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

      var csvCountyId = data[i].id; // get county id from etymology CSV
      var csvCountyLanguage = data[i].language; // get language per county
      var csvCountyCategory = data[i].category; // get language per county
      var csvCountyEtymology = data[i].etymology; // get etymology per county

      for (var j = 0; j < json.features.length; j++) { // find the corresponding county id within the GeoJSON

        var pathCountyId = json.features[j].properties.STATE + json.features[j].properties.COUNTY;

        if (csvCountyId == pathCountyId) {
          // console.log(csvCountyId + ' // ' + pathCountyId + ' // ' + csvCountyLanguage + ' // ' + csvCountyCategory + ' // ' + csvCountyEtymology);
          json.features[j].properties.language = csvCountyLanguage; // copy the language into the JSON per county
          json.features[j].properties.category = csvCountyCategory; // copy the category into the JSON per county
          json.features[j].properties.etymology = csvCountyEtymology; // copy the etymology into the JSON per county
          break; // stop looking through the JSON
        } // close if
      } // close j for-loop
    } // close i for-loop

    // drawing county paths
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
        .attr('d', path)
        .attr('class', 'county-outline')
        .style('fill', '#ffffff')
        .style('stroke', '#eeeeee')
        .style('stroke-width', 0.5);


    // establish county centroids
    svg.selectAll('circle')
      .data(json.features)
      .enter()
      .append('circle')
      /*.append(function(d) {
        console.log(parseInt(d.properties.STATE))
        if (parseInt(d.properties.STATE) < 57) {
          return 'circle';
        }
      })*/
        // .attr('class', 'county-centroid')
        /*.classed('remove', function(d) {
          console.log(parseInt(d.properties.STATE))
          if (parseInt(d.properties.STATE) > 56) {
            return true;
          } else {
            return false;
          }
        })
        */
        .classed('truecounty', function(d) {
          console.log(parseInt(d.properties.STATE))
          if (parseInt(d.properties.STATE) > 56) {
            return false;
          } else {
            return true;
          }
        })
        /*
        .attr('cx', function(d) {
          return path.centroid(d)[0];
        })
        .attr('cy', function(d) {
          return path.centroid(d)[1];
        })
        .attr('r', 2)
        .style('fill', function(d) {
          var category = d.properties.category; // get category of current county
          if (category) { // set county's color according to category
            if (category == 'Man') {
              return 'red';
            } else if (category == 'Woman') {
              return 'orange';
            } else if (category == 'Group of people') {
              return 'yellow';
            } else if (category == 'Flora, fauna') {
              return 'chartreuse';
            } else if (category == 'Geologic feature') {
              return 'lime';
            } else if (category == 'Natural resource, crop') {
              return 'green';
            } else if (category == 'Pre-existing place') {
              return 'olive';
            } else if (category == 'Battle') {
              return 'teal';
            } else if (category == 'Man-made object') {
              return 'aqua';
            } else if (category == 'Abstract concept') {
              return 'blue';
            } else if (category == 'Aspect of county’s creation') {
              return 'khaki';
            } else if (category == 'Combination of reasons') {
              return 'lavender';
            } else if (category == 'Unknown reason') {
              return 'fuchsia';
            } else {
              return 'orange';
            }
          } else { // no category assigned
            return 'black'; // hiding centroid circles for areas outside of US-proper (Guam, etc)
          }
        });
        */

        centroidSymbols = d3.selectAll('.truecounty')
          .attr('cx', function(d) {
            return path.centroid(d)[0];
          })
          .attr('cy', function(d) {
            return path.centroid(d)[1];
          })
          .attr('r', 2)
          .style('fill', function(d) {
            var category = d.properties.category; // get category of current county
            if (category) { // set county's color according to category
              if (category == 'Man') {
                return 'red';
              } else if (category == 'Woman') {
                return 'orange';
              } else if (category == 'Group of people') {
                return 'yellow';
              } else if (category == 'Flora, fauna') {
                return 'chartreuse';
              } else if (category == 'Geologic feature') {
                return 'lime';
              } else if (category == 'Natural resource, crop') {
                return 'green';
              } else if (category == 'Pre-existing place') {
                return 'olive';
              } else if (category == 'Battle') {
                return 'teal';
              } else if (category == 'Man-made object') {
                return 'aqua';
              } else if (category == 'Abstract concept') {
                return 'blue';
              } else if (category == 'Aspect of county’s creation') {
                return 'khaki';
              } else if (category == 'Combination of reasons') {
                return 'lavender';
              } else if (category == 'Unknown reason') {
                return 'fuchsia';
              } else {
                return 'orange';
              }
            } else { // no category assigned
              return 'black'; // hiding centroid circles for areas outside of US-proper (Guam, etc)
            }
          })
          .append('title')
            .text(function(d) {
              return d.properties.NAME + ' // ' + d.properties.STATE + d.properties.COUNTY;
            });

        // print county centroids for those without languages assigned
        svg.selectAll('text')
          .data(json.features)
          .enter()
          .append('text')
            .attr('x', 30)
            .attr('y', 30)
            .text(function(d) {
              var language = d.properties.language; // get category of current county
              if (language) { // set county's color according to category
                if (language == 'European') {
                  return '';
                } else if (language == 'Native American') {
                  return '';
                }
              } else { // no category assigned
                return d.properties.STATE + d.properties.COUNTY;
              }
            });

        // remove centroid circles for those with state codes >56 (areas outside of US-proper (Guam, etc))
        // d3.selectAll('.remove')
          // .remove();

  }); // close JSON function

}); // close CSV function



/*
// printing all the county IDs so I can match them to the ones I have in CSV
d3.select('body')
  .selectAll('text')
  .data(json.features)
  .enter()
  .append('text')
  .html(function(d) {
    var comboId = d.properties.STATE + d.properties.COUNTY;
    var sortableId = parseInt(comboId);
    return '<p>' + sortableId + '</p>';
  })
  .on('click', function() {
    sortIds();
  });

// sorting by number
var sortIds = function() {
  d3.select('body')
    .selectAll('text')
    .sort(function(a, b) {
      return d3.ascending(a, b);
    })
      .attr('y', function(d, i) {
        return i * 25;
      })
  }
*/
