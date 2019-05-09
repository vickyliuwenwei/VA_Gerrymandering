
var created = false;
var svg;

function hist(csvdata, col, var_svg_id, x_lab) {
  console.log(created);

  var formatCount = d3.format(",.0f");
  var margin = {top: 10, right: 30, bottom: 50, left: 90};
  var width = 450 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;

  var maxbin = Math.ceil(d3.max(csvdata, function(d) { return d[col]; }));
  var minbin = Math.floor(d3.min(csvdata, function(d) { return d[col]; }));

  var xScale = d3.scaleLinear()
  .domain([minbin, maxbin])
  .rangeRound([0, width]);

  var yScale = d3.scaleLinear()
  .range([height, 0]);

  var histogram = d3.histogram()
  .value(function(d) { return d[col]; })
  .domain(xScale.domain())
  .thresholds(xScale.ticks(20)); // split into 20 bins

  if (created == false) {
    console.log("vis");
    svg = d3.select(var_svg_id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    created = true;
  }

  var bins = histogram(csvdata)

  yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);

  // set up the bars
  var bar = svg.selectAll(".bar")
  .data(bins)
  .enter()  
  .append("g")
  .attr("class", "bar")
  .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; });
   
  var rects = bar.append("rect")
  .attr("x", 1)// move 1px to right
  .attr("width", xScale(bins[0].x1) - xScale(bins[0].x0) - 1)
  .attr("height", function(d) { return height - yScale(d.length); }); 

  // add the x axis and x-label
  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

  svg.append("text")
  .attr("class", "xlabel")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .text(x_lab);

  // add the y axis and y-label
  svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(0,0)")
  .call(d3.axisLeft(yScale));

  svg.append("text")
  .attr("class", "ylabel")
  .attr("y", 0 - margin.left) // x and y switched due to rotation!!
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .text("Count");
}