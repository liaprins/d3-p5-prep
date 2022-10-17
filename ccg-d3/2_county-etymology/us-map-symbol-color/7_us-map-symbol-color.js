var w = 1000;
var h = 580;

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
      var csvCountyState = data[i].state; // get state name per county

      for (var j = 0; j < json.features.length; j++) { // find the corresponding county id within the GeoJSON

        var pathCountyId = json.features[j].properties.STATE + json.features[j].properties.COUNTY;

        if (csvCountyId == pathCountyId) {
          json.features[j].properties.language = csvCountyLanguage; // copy the language into the JSON per county
          json.features[j].properties.category = csvCountyCategory; // copy the category into the JSON per county
          json.features[j].properties.etymology = csvCountyEtymology; // copy the etymology into the JSON per county
          json.features[j].properties.csvstate = csvCountyState; // copy the state name into the JSON per county
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
        .style('stroke-width', 0.5)
      .append('title')
        .text(function(d) {
          return d.properties.LSAD + ' name: ' + d.properties.NAME + ' // State: ' + d.properties.csvstate + ' // Named for: ' + d.properties.etymology + ' // Language family: ' + d.properties.language + ' // Category: ' + d.properties.category;
        });


    // establish county centroids
    var lineHalfLength = 2;

    var color = d3.scaleOrdinal(d3.schemeCategory20); // using temporarily for nicer colors before determine final design

    svg.selectAll('line')
      .data(json.features)
      .enter()
      .append('line')
        // .attr('class', 'centroid-symbol')
        .attr('class', function(d) { // using whether or not language is applied as a way to only apply class to US-proper counties (not Guam, etc)
          var language = d.properties.language; // get language of current county
          if (language) {
            return 'centroid-symbol';
          }
        })
        .attr('x1', function(d) {
          var language = d.properties.language; // get language of current county
          if (language) {
            if (language == 'European') {
              return Math.round(path.centroid(d)[0]) - lineHalfLength;
            } else {
              return Math.round(path.centroid(d)[0]);
            }
          }
        })
        .attr('x2', function(d) {
          var language = d.properties.language; // get language of current county
          if (language) {
            if (language == 'European') {
              return Math.round(path.centroid(d)[0]) + lineHalfLength;
            } else {
              return Math.round(path.centroid(d)[0]);
            }
          }
        })
        .attr('y1', function(d) {
          var language = d.properties.language; // get language of current county
          if (language) {
            if (language == 'European') {
              return Math.round(path.centroid(d)[1]);
            } else {
              return Math.round(path.centroid(d)[1] - lineHalfLength);
            }
          }
        })
        .attr('y2', function(d) {
          var language = d.properties.language; // get language of current county
          if (language) {
            if (language == 'European') {
              return Math.round(path.centroid(d)[1]);
            } else {
              return Math.round(path.centroid(d)[1] + lineHalfLength);
            }
          }
        })
        .style('stroke', function(d) {
          var category = d.properties.category; // get category of current county
          if (category) { // set county's color according to category
            if (category == 'Man') {
              return color(1)
            } else if (category == 'Woman') {
              return color(2);
            } else if (category == 'Group of people') {
              return color(3);
            } else if (category == 'Flora, fauna') {
              return color(4);
            } else if (category == 'Geologic feature') {
              return color(5);
            } else if (category == 'Natural resource, crop') {
              return color(6);
            } else if (category == 'Pre-existing place') {
              return color(7);
            } else if (category == 'Battle') {
              return color(8);
            } else if (category == 'Man-made object') {
              return color(9);
            } else if (category == 'Abstract concept') {
              return color(10);
            } else if (category == 'Aspect of county’s creation') {
              return color(11);
            } else if (category == 'Combination of reasons') {
              return color(12);
            } else if (category == 'Unknown reason') {
              return color(13);
            }
          }
        })
        .style('stroke-width', 2)
        .style('stroke-linecap', 'round')
        .style('pointer-events', 'none');

    // establish filter functionality
    var filter = function() {
      d3.selectAll('centroid-symbol')
        .filter(function(d) {
          return d.properties.language == 'Native American';
        })
        .style('stroke', 'red');
    };

  }); // close JSON function

}); // close CSV function



// filters
d3.selectAll('.filter-language')
  .on('click', function() {

    filterButton = d3.select(this);
    var selected = filterButton.classed('selected'); // Is the button selected right now?
    var clickedFilterLanguage = filterButton.attr('data-language');

    if (selected) { // If selected prior to click

      d3.selectAll('.centroid-symbol')
        .filter(function(d) {
          return d.properties.language == clickedFilterLanguage;
        })
        .style('stroke-width', 2);

      filterButton.classed('selected', false)
        .style('border', '2px solid rgba(0, 0, 0, 0)');

    } else { // If NOT selected prior to click

      d3.selectAll('.centroid-symbol')
        .filter(function(d) {
          return d.properties.language == clickedFilterLanguage;
        })
        .style('stroke-width', 5);

      filterButton.classed('selected', true)
        .style('border', '2px solid black');

    }
  });

d3.selectAll('.filter-etymology')
  .on('click', function() {

    filterButton = d3.select(this);
    var selected = filterButton.classed('selected'); // Is the button selected right now?
    var clickedFilterEtymology = filterButton.attr('data-etymology');

    if (selected) { // If selected prior to click

      d3.selectAll('.centroid-symbol')
        .filter(function(d) {
          return d.properties.category == clickedFilterEtymology;
        })
        .style('stroke-width', 2);

      filterButton.classed('selected', false)
        .style('border', '2px solid rgba(0, 0, 0, 0)');

    } else { // If NOT selected prior to click

      d3.selectAll('.centroid-symbol')
        .filter(function(d) {
          return d.properties.category == clickedFilterEtymology;
        })
        .style('stroke-width', 5);

      filterButton.classed('selected', true)
        .style('border', '2px solid black');

    }
  });

/*
d3.selectAll('.filter-etymology')
  .on('click', function() {
    var clickedFilterEtymology = this.getAttribute('data-etymology');
    d3.selectAll('.centroid-symbol')
      .filter(function(d) {
        return d.properties.category == clickedFilterEtymology;
      })
      .style('stroke-width', 5);
  });
  */
