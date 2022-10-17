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
  if (v == 'man') {
    return {
      categoryLabel: 'Man!!',
      categoryColor: color(1) };
  } else if (v == 'woman') {
    return {
      categoryLabel: 'Woman!!',
      categoryColor: color(2) };
  } else if (v == 'group') {
    return {
      categoryLabel: 'Group of people!!',
      categoryColor: color(3) };
  } else if (v == 'flora') {
    return {
      categoryLabel: 'Flora, fauna!!',
      categoryColor: color(4) };
  } else if (v == 'geology') {
    return {
      categoryLabel: 'Geologic feature!!',
      categoryColor: color(5) };
  } else if (v == 'resource') {
    return {
      categoryLabel: 'Natural resource, crop!!',
      categoryColor: color(6) };
  } else if (v == 'place') {
    return {
      categoryLabel: 'Pre-existing place!!',
      categoryColor: color(7) };
  } else if (v == 'battle') {
    return {
      categoryLabel: 'Battle!!',
      categoryColor: color(8)};
  } else if (v == 'object') {
    return {
      categoryLabel: 'Man-made object!!',
      categoryColor: color(9) };
  } else if (v == 'concept') {
    return {
      categoryLabel: 'Abstract concept!!',
      categoryColor: color(10) };
  } else if (v == 'creation') {
    return {
      categoryLabel: 'Aspect of county’s creation!!',
      categoryColor: color(11) };
  } else if (v == 'combination') {
    return {
      categoryLabel: 'Combination of reasons!!',
      categoryColor: color(12) };
  } else {
    return {
      categoryLabel: 'Unknown reason!!',
      categoryColor: color(13) };
  }
};

// convert language
var lineHalfLength = 2;

var languageConverter = function(w) {
  if (w.properties.language == 'euro') {
    return {
      languageLabel: 'European!!',
      languageX1: Math.round(path.centroid(w)[0]) - lineHalfLength,
      languageY1: Math.round(path.centroid(w)[1]),
      languageX2: Math.round(path.centroid(w)[0]) + lineHalfLength,
      languageY2: Math.round(path.centroid(w)[1]) };
  } else { // Native American
    return {
      languageLabel: 'Native American!!',
      languageX1: Math.round(path.centroid(w)[0]),
      languageY1: Math.round(path.centroid(w)[1] - lineHalfLength),
      languageX2: Math.round(path.centroid(w)[0]),
      languageY2: Math.round(path.centroid(w)[1] + lineHalfLength) };
  }
};

// load CSV of county etymology data
d3.csv('../data_county-etymologies.csv', function(data) {

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
        .attr('class', function(d) {
          return 'centroid-symbol language-' + d.properties.language + ' category-' + d.properties.category;
        })
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

var allFilters = d3.selectAll('.filter');
var filterContainer = d3.select('#filter-container');

allFilters
  .on('click', function() {

    var clickedButton = d3.select(this);
    var clickedButtonDataGroup = clickedButton.attr('data-group');
    var clickedButtonDataField = clickedButton.attr('data-field');
    var clickedButtonCentroidClass = clickedButtonDataGroup + '-' + clickedButtonDataField;

    if (clickedButtonDataGroup == 'language') {
      var opposingGroup = 'category';
    } else {
      var opposingGroup = 'language';
    }
    console.log('opposing group: ' + opposingGroup);

    // if (the filter is being turned ON (therefore OFF prior to click))
    if (!clickedButton.classed('on')) {

      // if (NO other filter buttons are on)
      if ((clickedButton.attr('data-existinggroup-language') == '') && (clickedButton.attr('data-existinggroup-category') == '')) {
        console.log('another button is NOT on')

        // apply selected-style to centroids belonging to clicked-on filter
        svg.selectAll('.centroid-symbol.' + clickedButtonCentroidClass)
          .classed('centroid-on', true);

        // apply selected-style to clicked-on button
        // ^^^ THIS IS COVERED BY .on CLASS; DON'T THINK I NEED TO DO ANYTHING HERE AFTERALL!

      // else if (same group as clicked-on filter has a filter on)
      } else if (clickedButton.attr('data-existinggroup-' + clickedButtonDataGroup) != '') {

        // if (no cross-filtering happening prior to click; filter in same group as clicked button was the ONLY other filter on)
        if (clickedButton.attr('data-existinggroup-' + opposingGroup) == '') {
          console.log('another filter in SAME group is on but another filter in DIFFERENT group is NOT on');

          // turn off all centroids of other filter from same group
          svg.selectAll('.centroid-symbol.' + clickedButtonDataGroup + '-' + clickedButton.attr('data-existinggroup-' + clickedButtonDataGroup))
            .classed('centroid-on', false);

          // turn on all centroids belonging to clicked-on button
          svg.selectAll('.centroid-symbol.' + clickedButtonCentroidClass)
            .classed('centroid-on', true);

          // turn off style of other filter button from same group
          filterContainer.select('#filter-' + clickedButtonDataGroup + '-' + clickedButton.attr('data-existinggroup-' + clickedButtonDataGroup))
            .classed('on', false);

        // else // cross-filtering IS happening prior to click; filter in different group from clicked button AND filter in same group as clicked button BOTH on prior to click
        } else {
          console.log('another filter in SAME group is on AND another filter in DIFFERENT group is on');

          // turn off all centroids of other filter from same group
          svg.selectAll('.centroid-symbol.' + clickedButtonDataGroup + '-' + clickedButton.attr('data-existinggroup-' + clickedButtonDataGroup))
            .classed('centroid-on', false);

          // turn on centroids only at the intersection of both clicked-on button and already-on filter from other group
          svg.selectAll('.centroid-symbol.' + clickedButtonCentroidClass + '.' + opposingGroup + '-' + clickedButton.attr('data-existinggroup-' + opposingGroup))
            .classed('centroid-on', true);

          // turn off style of other filter button from same group
          filterContainer.select('#filter-' + clickedButtonDataGroup + '-' + clickedButton.attr('data-existinggroup-' + clickedButtonDataGroup))
            .classed('on', false);

        } // close if-statement about cross-filtering happening prior to click

        // apply selected-style to clicked-on button
        // ^^^ THIS IS COVERED BY .on CLASS; DON'T THINK I NEED TO DO ANYTHING HERE AFTERALL!

      } else { // other filter is in different group from clicked-on filter
        console.log('no other filter in SAME group is on, but another filter in DIFFERENT group IS on');

        // since there are only two options for the filter group (language and category) in this case, I can binarily discern which group is existing within this portion of the overall if-statement, based on which group thie clicked-on button is in
        // this would not work for filters with more than two groups, but could be solved by flagging all buttons with classes of 'ongroup-[insert group currently on]' for each group with a filter on, then running an if-statement that manually looks for each
        // actually running a for-loop on all the 'ongroup-[insert groups with a filter on]' classes applied to clicked-on button would work, and apply styles via same for-loop simultaneously...


        // turn off selected-style of centroids NOT in the intersection of both clicked-on filter && other selected filter
        svg.selectAll('.centroid-symbol.' + opposingGroup + '-' + clickedButton.attr('data-existinggroup-' + opposingGroup) + ':not(.centroid-symbol.' + clickedButtonCentroidClass + ')')
          .classed('centroid-on', false);

        // apply selected-style to clicked-on button
        // ^^^ THIS IS COVERED BY .on CLASS; DON'T THINK I NEED TO DO ANYTHING HERE AFTERALL!

      } // close if-statement for whether another filter button is on

      // apply class 'on' to clicked-on button to flag that this filter has been selected
      clickedButton.classed('on', true);

      allFilters.each(function() { // set flag of currently selected button to all other buttons for future awareness
        d3.select(this)
          .attr('data-existinggroup-' + clickedButtonDataGroup, clickedButtonDataField);
        // console.log('INSIDE each(), id: ' + d3.select(this).attr('id') + ' // existing filter field: ' + d3.select(this).attr('data-existinggroup-' + clickedButtonDataGroup));
      });

      // console.log('OUTSIDE + AFTER each(), id: ' + d3.select(this).attr('id') + ' // existing filter field: ' + d3.select(this).attr('data-existinggroup-' + clickedButtonDataGroup));

    } else { // the filter is being turned OFF (therefore ON prior to click)

      // if (another filter button is on (by definition must be from other filter group))
      if (clickedButton.attr('data-existinggroup-' + opposingGroup) != '') {
      console.log('filter from other group is still on');

        // turn off selected-style of centroids belonging only to clicked-on button, but not to centroids belonging to both it and other filter
        // svg.selectAll('.centroid-symbol.' + clickedButtonCentroidClass + ':not(.centroid-symbol.' +  opposingGroup + '-' + clickedButton.attr('data-existinggroup-' + opposingGroup) + ')')
          // .classed('centroid-on', false);

        // apply selected-style to centroids belonging to other filter
        svg.selectAll('.centroid-symbol.' + opposingGroup + '-' + clickedButton.attr('data-existinggroup-' + opposingGroup))
          .classed('centroid-on', true);
        console.log('TURNING ON: .centroid-symbol.' + opposingGroup + '-' + clickedButton.attr('data-existinggroup-' + opposingGroup))

        // turn off selected-style for clicked-on button
        // ^^^ THIS IS COVERED BY .on CLASS; DON'T THINK I NEED TO DO ANYTHING HERE AFTERALL!

      } else { // another filter button is NOT on
      console.log('turning off the last button, no other buttons are on now // turning off: ' + clickedButtonCentroidClass);

        // turn off selected-style of centroids for clicked-on filter
        svg.selectAll('.centroid-symbol.' + clickedButtonCentroidClass)
          .classed('centroid-on', false);

        // turn off selected-style of clicked-on button
        // ^^^ THIS IS COVERED BY .on CLASS; DON'T THINK I NEED TO DO ANYTHING HERE AFTERALL!

      } // close if-statement for whether another filter button is on

      // remove class 'on' to clicked-on button to flag that this filter has been turned off
      clickedButton.classed('on', false);

      allFilters.each(function() { // set flag of currently selected button to all other buttons for future awareness
        d3.select(this)
          .attr('data-existinggroup-' + clickedButtonDataGroup, '');
      });

    } // close if-statement for whether filter is being turned ON or OFF

  });
