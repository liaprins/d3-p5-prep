var dataset = [
  { date: "04/01/2017", low: 55, high: 78 },
  { date: "04/02/2017", low: 65, high: 83 },
  { date: "04/03/2017", low: 77, high: 90 },
  { date: "04/04/2017", low: 58, high: 78 },
  { date: "04/05/2017", low: 67, high: 92 }
]

d3.select('tbody').selectAll('tr')
  .data(dataset)
  .enter()
  .append('tr')
  .html(function(d) {
    return '<th scope="row">' + d.date + '</th><td>' + d.low + '</td><td>' + d.high + '</td>'
  })

/*
d3.selectAll("tr:nth-child(even) .day-high .temp")
  .html('<strong class="item">HOT</strong>') // adds after the CSS selector(s) targeted!
  // .append('span')
  // .text(' today!')
  .insert('span', 'strong') // adds before the CSS selector(s) targeted!
  .text('today! ');

d3.selectAll('tr:nth-child(3)')
  .remove();

d3.selectAll('tr:nth-child(1) .day-high')
  .append('span')
  .html('hot')
  .style('background', 'red')
  .style('padding', '3px')
  .style('margin-left', '3px')
  .style('border-radius', '3px')
  .style('color', 'white');

d3.select('h2 span')
  .classed('small', false);

d3.selectAll('tr')
  .insert('td', ':first-child')
  .append('input')
  .attr('type', 'checkbox')
  .property('checked', true);
  */
