async function getData() {
var data = await d3.csv('data.csv');
  console.log(data);
};

getData();
