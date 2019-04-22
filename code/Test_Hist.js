function parser(d) {
    d.pnbs = + d.nb_splits;
    d.pdratio = +d.perc_dem_vote;
    d.pnbc = + d.nb_cuts;
    return d;
}

function hist(csvdata) {

  var data = d3.range(1000).map(d3.randomBates(10));

  var formatCount = d3.format(",.0f");
  var margin = {top: 10, right: 30, bottom: 50, left: 90};
  var width = 450 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;

  var svg = d3.select("#nb_sp").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3.scaleLinear()
  .rangeRound([0, width]);

  var bins = d3.histogram()
  .domain(xScale.domain()) 
  .thresholds(xScale.ticks(20)) // split into 20 bins
  (data);

  var yScale = d3.scaleLinear()
  .domain([0, d3.max(bins, function(d) { return d.length; })])
  .range([height, 0]);

  // put the graph in the "varg" div

  console.log(bins)

  // set up the bars
  var bar = svg.selectAll(".bar")
  .data(bins)
  .enter()  
  .append("g")
  .attr("class", "bar")
  .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; });

    // add rectangles of correct size at correct location
  var rects = bar.append("rect")
  .attr("x", 1)
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
  .text("Number of Splits");

  // add the y axis and y-label
  // svg.append("g")
  // .attr("class", "y axis")
  // .attr("transform", "translate(0,0)")
  // .call(yAxis);

  svg.append("text")
  .attr("class", "ylabel")
  .attr("y", 0 - margin.left) // x and y switched due to rotation!!
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .text("Count");

  bar.append("text")
  .attr("y", 6) 
  .attr("x", (xScale(bins[0].x1) - xScale(bins[0].x0)) / 2)
  .attr("text-anchor", "middle")
  .text(function(d) { return formatCount(d.length); })
  .attr("dy", ".75em");
}