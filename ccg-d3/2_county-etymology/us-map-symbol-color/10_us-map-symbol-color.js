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

// using temporarily for nicer colors before determine final design
var color = d3.scaleOrdinal(d3.schemeCategory20);

// establish function to convert CSV categories to words in UI
var categoryConverter = function(v) {
  if (v == 'Man') {
    return {
      categoryLabel: 'Man!',
      categoryColor: color(1) };
  } else if (v == 'Woman') {
    return {
      categoryLabel: 'Woman!',
      categoryColor: color(2) };
  } else if (v == 'Group of people') {
    return {
      categoryLabel: 'Group of people!',
      categoryColor: color(3) };
  } else if (v == 'Flora, fauna') {
    return {
      categoryLabel: 'Flora, fauna!',
      categoryColor: color(4) };
  } else if (v == 'Geologic feature') {
    return {
      categoryLabel: 'Geologic feature!',
      categoryColor: color(5) };
  } else if (v == 'Natural resource, crop') {
    return {
      categoryLabel: 'Natural resource, crop!',
      categoryColor: color(6) };
  } else if (v == 'Pre-existing place') {
    return {
      categoryLabel: 'Pre-existing place!',
      categoryColor: color(7) };
  } else if (v == 'Battle') {
    return {
      categoryLabel: 'Battle!',
      categoryColor: color(8)};
  } else if (v == 'Man-made object') {
    return {
      categoryLabel: 'Man-made object!',
      categoryColor: color(9) };
  } else if (v == 'Abstract concept') {
    return {
      categoryLabel: 'Abstract concept!',
      categoryColor: color(10) };
  } else if (v == 'Aspect of county’s creation') {
    return {
      categoryLabel: 'Aspect of county’s creation!',
      categoryColor: color(11) };
  } else if (v == 'Combination of reasons') {
    return {
      categoryLabel: 'Combination of reasons!',
      categoryColor: color(12) };
  } else {
    return {
      categoryLabel: 'Unknown reason!',
      categoryColor: color(13) };
  }
};

// convert language
var lineHalfLength = 2;

var languageConverter = function(w) {
  if (w.properties.language == 'European') {
    return {
      languageLabel: 'European!',
      languageX1: Math.round(path.centroid(w)[0]) - lineHalfLength,
      languageY1: Math.round(path.centroid(w)[1]),
      languageX2: Math.round(path.centroid(w)[0]) + lineHalfLength,
      languageY2: Math.round(path.centroid(w)[1]) };
  } else { // Native American
    return {
      languageLabel: 'Native American!',
      languageX1: Math.round(path.centroid(w)[0]),
      languageY1: Math.round(path.centroid(w)[1] - lineHalfLength),
      languageX2: Math.round(path.centroid(w)[0]),
      languageY2: Math.round(path.centroid(w)[1] + lineHalfLength) };
  }
};

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

    // draw county outlines
    var pathContainer = svg.append('g') // group to hold county outlines
      .attr('id', 'path-container');

    pathContainer.selectAll('.county-outline')
      .data(json.features)
      .enter()
      .append('path')
        .attr('d', path)
        .attr('class', 'county-outline')
      .append('title') // add <title> tooltip for now
        .text(function(d) {
          return d.properties.LSAD + ' name: ' + d.properties.NAME + // LSAD = 'County' or equivalent label
          ' // State: ' + d.properties.csvstate +
          ' // Named for: ' + d.properties.etymology +
          ' // Language family: ' + d.properties.language +
          ' // Category: ' + categoryConverter(d.properties.category).categoryLabel; // use categoryConverter to translate CSV category to human-friendly words
        });

    // establish county centroids
    var centroidContainer = svg.append('g') // group to hold centroid symbols
      .attr('id', 'centroid-container');

    centroidContainer.selectAll('.centroid-symbol')
      .data(json.features)
      .enter()
      .append('line')
        .attr('class', 'centroid-symbol')
        .attr('x1', function(d) {
          return languageConverter(d).languageX1;
        })
        .attr('y1', function(d) {
          return languageConverter(d).languageY1;
        })
        .attr('x2', function(d) {
          return languageConverter(d).languageX2;
        })
        .attr('y2', function(d) {
          return languageConverter(d).languageY2;
        })
        .style('stroke', function(d) {
          return categoryConverter(d.properties.category).categoryColor;
        });

  }); // close JSON function

}); // close CSV function



// filters
var selectedStrokeWidth = 5;
var unselectedStrokeWidth = 2;

// language filter
var allLanguageFilters = d3.selectAll('.filter-language');

allLanguageFilters
  .style('border', '2px solid rgba(0, 0, 0, 0)') // prevents div border from widening box on click
  .on('click', function() {

    var filterButton = d3.select(this);
    var selected = filterButton.classed('selected'); // Is the button selected right now?
    var clickedFilterLanguage = filterButton.attr('data-language');
    /*
    allLanguageFilters
      .classed('selected', function() {
      if (!filterButton) {
          return true;
        }
      })
      .style('border', '2px solid rgba(0, 0, 0, 0)');
      */
    if (selected) { // If selected prior to click (now turning it off)

      d3.selectAll('.language-selected:not(.category-selected)') // affect the centroid symbols
        .style('stroke-width', unselectedStrokeWidth)
        .classed('language-selected', false);

      d3.selectAll('.category-selected') // affect the centroid symbols
        .style('stroke-width', selectedStrokeWidth)
        .classed('language-selected', false);

      filterButton.classed('selected', false) // affect the filter button
        .style('border', '2px solid rgba(0, 0, 0, 0)');

    } else { // If NOT selected prior to click (now turning it on)

      d3.selectAll('.centroid-symbol') // affect the centroid symbols
        .classed('language-selected', false)
        .filter(function(d) {
          return d.properties.language == clickedFilterLanguage;
        })
        .classed('language-selected', true);

      var centroidBoth = document.getElementsByClassName('language-selected category-selected');
      console.log('language: ' + centroidBoth.length);
      if (centroidBoth.length > 0) {
        d3.selectAll('.language-selected:not(.category-selected)') // affect the centroid symbols
          .style('stroke-width', unselectedStrokeWidth);
        d3.selectAll('.category-selected:not(.language-selected)') // affect the centroid symbols
          .style('stroke-width', unselectedStrokeWidth);
        d3.selectAll('.centroid-symbol:not(.language-selected)') // affect the centroid symbols
          .style('stroke-width', unselectedStrokeWidth);
        d3.selectAll('.language-selected .category-selected') // affect the centroid symbols
          .style('stroke-width', selectedStrokeWidth);
      } else if (centroidBoth.length == 0) {
        d3.selectAll('.language-selected') // affect the centroid symbols
          .style('stroke-width', selectedStrokeWidth);
        d3.selectAll('.centroid-symbol:not(.language-selected)') // affect the centroid symbols
          .style('stroke-width', unselectedStrokeWidth);
      }

      allLanguageFilters
        .classed('selected', function() {
          if (!filterButton) {
            return false;
          }
      })
      .style('border', '2px solid rgba(0, 0, 0, 0)');

      filterButton.classed('selected', true) // affect the filter button
        .style('border', '2px solid black');

    }
  });

// category filter
var allCategoryFilters = d3.selectAll('.filter-category');

allCategoryFilters
  .style('border', '2px solid rgba(0, 0, 0, 0)') // prevents div border from widening box on click
  .on('click', function() {

    var filterButton = d3.select(this);
    var selected = filterButton.classed('selected'); // Is the button selected right now?
    var clickedFilterCategory = filterButton.attr('data-category');
    /*
    allCategoryFilters
      .classed('selected', function() {
        if (!filterButton) {
          return true;
        }
      })
      .style('border', '2px solid rgba(0, 0, 0, 0)');
      */
    if (selected) { // If selected prior to click (now turning it off)

      d3.selectAll('.category-selected:not(.language-selected)') // affect the centroid symbols
        .style('stroke-width', unselectedStrokeWidth)
        .classed('category-selected', false);

      d3.selectAll('.language-selected') // affect the centroid symbols
        .style('stroke-width', selectedStrokeWidth)
        .classed('category-selected', false);

      filterButton.classed('selected', false) // affect the filter button
        .style('border', '2px solid rgba(0, 0, 0, 0)');

    } else { // If NOT selected prior to click (now turning it on)

      d3.selectAll('.centroid-symbol') // affect the centroid symbols
        .classed('category-selected', false)
        .filter(function(d) {
          return d.properties.category == clickedFilterCategory;
        })
        .classed('category-selected', true);

      var centroidBoth = document.getElementsByClassName('language-selected category-selected');
      console.log('category: ' + centroidBoth.length);
      if (centroidBoth.length > 0) {
        d3.selectAll('.category-selected:not(.language-selected)') // affect the centroid symbols
          .style('stroke-width', unselectedStrokeWidth);
        d3.selectAll('.language-selected:not(.category-selected)') // affect the centroid symbols
          .style('stroke-width', unselectedStrokeWidth);
        d3.selectAll('.centroid-symbol:not(.category-selected)') // affect the centroid symbols
          .style('stroke-width', unselectedStrokeWidth);
        d3.selectAll('.language-selected .category-selected') // affect the centroid symbols
          .style('stroke-width', selectedStrokeWidth);
      } else if (centroidBoth.length == 0) {
        d3.selectAll('.category-selected') // affect the centroid symbols
          .style('stroke-width', selectedStrokeWidth);
        d3.selectAll('.centroid-symbol:not(.category-selected)') // affect the centroid symbols
          .style('stroke-width', unselectedStrokeWidth);
      }


      allCategoryFilters
        .classed('selected', function() {
          if (!filterButton) {
            return false;
          }
      })
      .style('border', '2px solid rgba(0, 0, 0, 0)');


      filterButton.classed('selected', true) // affect the filter button
        .style('border', '2px solid black');

    }
  });
