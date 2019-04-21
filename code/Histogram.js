function parser(d) {
    d.psplt = + d.nb_splits;
    d.pdratio = +d.perc_dem_vote;
    return d;
}
function hist1(csvdata) {
  var maxbin = Math.ceil(d3.max(csvdata, function(d) { return d.nb_splits; }));
  console.log(maxbin);
  var minbin = Math.floor(d3.min(csvdata, function(d) { return d.nb_splits; }));
  console.log(minbin);
  var numbins = 20;
  var binsize = Math.ceil((maxbin - minbin)/numbins);
  console.log(binsize);
  // var minbin = 36;
  // var maxbin = 60;
  // var binsize = 2;
  // var numbins = (maxbin - minbin) / binsize;
  var binmargin = .2; 
  var margin = {top: 10, right: 30, bottom: 50, left: 90};
  var width = 450 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;

  // Set the limits of the x axis
  var xmin = minbin - 1
  var xmax = maxbin + 1

  histdata = new Array(numbins);
  for (var i = 0; i < numbins; i++) {
    if (i < histdata.length) {
      histdata[i] = { numfill: 0, meta: "" };
    }
  }

  csvdata.forEach(function(d) {
  var bin = Math.floor((d.psplt - minbin) / binsize);
  if ((bin.toString() != "NaN") && (bin < histdata.length)) {
      histdata[bin].numfill += 1;
    }
  });

  // This scale is for determining the widths of the histogram bars
  // Must start at 0 or else x(binsize a.k.a dx) will be negative
  var x = d3.scale.linear()
  .domain([0, (xmax - xmin)])
  .range([0, width]);

  // Scale for the placement of the bars
  var x2 = d3.scale.linear()
  .domain([xmin, xmax])
  .range([0, width]);

  // Make an array
  var values = [];
  csvdata.forEach(function(d) { values.push(d.nb_splits); });

  var y = d3.scale.linear()
  .domain([0, d3.max(histdata, function(d) { return d.numfill; })])
  .range([height, 0]);

  var xAxis = d3.svg.axis()
  .scale(x2)
  .orient("bottom");
  var yAxis = d3.svg.axis()
  .scale(y)
  .ticks(8)
  .orient("left");

  // put the graph in the "varg" div
  var svg = d3.select("#nb_sp").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // svg.call(tip);

  // set up the bars
  var bar = svg.selectAll(".bar")
  .data(histdata)
  .enter().append("g")
  .attr("class", "bar")
  .attr("transform", function(d, i) { 
    return "translate(" + x2(i * binsize + minbin) + "," + y(d.numfill) + ")"; 
  });

    // add rectangles of correct size at correct location
  bar.append("rect")
  .attr("x", x(binmargin))
  .attr("width", x(binsize - 2*binmargin))
  .attr("height", function(d) { return height - y(d.numfill); });

    // add the x axis and x-label
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);
  svg.append("text")
  .attr("class", "xlabel")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .text("Number of Splits");

    // add the y axis and y-label
  svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(0,0)")
  .call(yAxis);
  svg.append("text")
  .attr("class", "ylabel")
  .attr("y", 0 - margin.left) // x and y switched due to rotation!!
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .text("CNT");
}

function hist2(csvdata) {
  var maxbin = Math.ceil(d3.max(csvdata, function(d) { return d.perc_dem_vote; }));
  console.log(maxbin);
  var minbin = Math.floor(d3.min(csvdata, function(d) { return d.perc_dem_vote; }));
  console.log(minbin);
  var numbins = 20;
  var binsize = Math.ceil((maxbin - minbin)*100/numbins)/100;
  console.log(binsize);
  // var minbin = 36;
  // var maxbin = 60;
  // var binsize = 2;
  // var numbins = (maxbin - minbin) / binsize;
  var binmargin = .2; 
  var margin = {top: 10, right: 30, bottom: 50, left: 90};
  var width = 450 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;

  // Set the limits of the x axis
  var xmin = minbin - 1
  var xmax = maxbin + 1

  histdata = new Array(numbins);
  for (var i = 0; i < numbins; i++) {
    if (i < histdata.length) {
      histdata[i] = { numfill: 0, meta: "" };
    }
  }

  csvdata.forEach(function(d) {
  var bin = Math.floor((d.pdratio - minbin) / binsize);
  if ((bin.toString() != "NaN") && (bin < histdata.length)) {
      histdata[bin].numfill += 1;
    }
  });

  // This scale is for determining the widths of the histogram bars
  // Must start at 0 or else x(binsize a.k.a dx) will be negative
  var x = d3.scale.linear()
  .domain([0, (xmax - xmin)])
  .range([0, width]);

  // Scale for the placement of the bars
  var x2 = d3.scale.linear()
  .domain([xmin, xmax])
  .range([0, width]);

  // Make an array
  var values = [];
  csvdata.forEach(function(d) { values.push(d.perc_dem_vote ); });

  var y = d3.scale.linear()
  .domain([0, d3.max(histdata, function(d) { return d.numfill; })])
  .range([height, 0]);

  var xAxis = d3.svg.axis()
  .scale(x2)
  .orient("bottom");
  var yAxis = d3.svg.axis()
  .scale(y)
  .ticks(8)
  .orient("left");

  // put the graph in the "varg" div
  var svg = d3.select("#dtp").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // svg.call(tip);

  // set up the bars
  var bar = svg.selectAll(".bar")
  .data(histdata)
  .enter().append("g")
  .attr("class", "bar")
  .attr("transform", function(d, i) { 
    return "translate(" + x2(i * binsize + minbin) + "," + y(d.numfill) + ")"; 
  });

    // add rectangles of correct size at correct location
  bar.append("rect")
  .attr("x", x(binmargin))
  .attr("width", x(binsize - 2*binmargin))
  .attr("height", function(d) { return height - y(d.numfill); });

    // add the x axis and x-label
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);
  svg.append("text")
  .attr("class", "xlabel")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .text("Number of Splits");

    // add the y axis and y-label
  svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(0,0)")
  .call(yAxis);
  svg.append("text")
  .attr("class", "ylabel")
  .attr("y", 0 - margin.left) // x and y switched due to rotation!!
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .text("CNT");
}

// Read in .csv data and make graphs