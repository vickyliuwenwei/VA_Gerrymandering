
// kernel https://www.d3-graph-gallery.com/graph/density_double.html

var col_to_filter;
var first_load;

var check_selection_nb_cuts;
var check_selection_egs;
var check_selection_mms;
var check_selection_hmss;
var check_selection_p_votes;

var graph;
// variables for histogram set up
var margin, width, height, formatCount,
 old_maxbin, old_minbin, maxbin, minbin, 
 histogram, bins,
 maxbin_egs, minbin_egs;

var margin = {top: 50, right: 30, bottom: 50, left: 100};
var width = 450 - margin.left - margin.right;
var height = 250 - margin.top - margin.bottom;
// Histogram bucket width
var HISTOGRAM_BUCKET_SIZE = 5;
var numBuckets = 200 / HISTOGRAM_BUCKET_SIZE;
var tx_max = width;
var tx_min = 0;
var topY = height;

var n_median_seats = 5;


Range=function(_parentElement, _data, _filterData){
    this.parentElement  = _parentElement;
    this.data = _data;
    this.filterData = _filterData;

    margin = {top: 50, right: 30, bottom: 50, left: 100};
    width = 450 - margin.left - margin.right;
    height = 250 - margin.top - margin.bottom;
    // Histogram bucket width
    tx_max = width;
    tx_min = 0;
    topY = height;

    check_selection_nb_cuts = document.getElementById("check_selection_nb_cuts").checked;
    check_selection_egs = document.getElementById("check_selection_egs").checked;
    check_selection_mms = document.getElementById("check_selection_mms").checked;
    check_selection_hmss = document.getElementById("check_selection_hmss").checked;
    check_selection_p_votes = document.getElementById("check_selection_p_votes").checked;
    
    if (check_selection_nb_cuts) {
        col_to_filter = "nb_cuts";}
    if (check_selection_egs) {
        col_to_filter = "egs";}
    if (check_selection_mms) {
        col_to_filter = "mms";}
    if (check_selection_hmss) {
        col_to_filter = "hmss";}
    if (check_selection_p_votes) {
        col_to_filter = "most_democratic_district_vote_share";}

    this.default_var_min = d3.min(this.data, function(d) { return +d[col_to_filter]; } );
    this.default_var_max = d3.max(this.data, function(d) { return +d[col_to_filter]; } );
    this.filter_var_min = d3.min(this.filterData, function(d) { return +d[col_to_filter]; } );
    this.filter_var_max = d3.max(this.filterData, function(d) { return +d[col_to_filter]; } );
    var filterData = this.filterData;
    var data = this.data;
    
    if (graph) {
        // if the histogram exists then update its data
        updateHist_egs(filterData, "egs", "#egs");
        updateHist_cuts(filterData, "nb_cuts", "#nb_cuts");
        updateHist_mms(filterData, "mms", "#mms");
        updateHist_hmss(filterData, "hmss", "#hmss");
        updateHist_votes(filterData, "most_democratic_district_vote_share", "#p_votes");

      } else {

        if (path == "data/VA_data/plan_metrics_ATG17.csv"){
            // create histograms for Part ii
            makeHist_egs2(data, "egs", "#egs2", "Efficiency Gap");
            makeHist_cuts2(data, "nb_cuts", "#cuts2" , "Number of Cuts");
            makeHist_mms2(data, "mms", "#mms2", "Mean - Median");
            makeHist_hmss2(data, "hmss", "#hmss2", 
                    "Number of seats won by democrats");
            makeHist_votes2(data, "most_democratic_district_vote_share", "#p_votes2", 
                "Percentage Democratic Votes in the most Democratic district");

            barCut = svg_nb_cuts2.append("rect");
            barVotes = svg_p_votes2.append("rect");
            barMms = svg_mms2.append("rect");
            barHmss = svg_hmss2.append("rect");
            barEgs = svg_egs2.append("rect");


            labelCut = svg_nb_cuts2.append("text");
            labelVote = svg_p_votes2.append("text");
            labelMms = svg_mms2.append("text");
            labelHmss = svg_hmss2.append("text");
            labelEgs = svg_egs2.append("text");
        }




        if (first_load ){
            svg_egs.selectAll("*").remove();
            svg_nb_cuts.selectAll("*").remove();
            svg_mms.selectAll("*").remove();
            svg_hmss.selectAll("*").remove();
            svg_p_votes.selectAll("*").remove();

            cutoff_max.selectAll("*").remove();
            cutoff_min.selectAll("*").remove();
        } else { first_load = true ; }



        // otherwise create the histogram
        makeHist_egs(data, "egs", "#egs", "Efficiency Gap");
        makeHist_cuts(data, "nb_cuts", "#nb_cuts" , "Number of Cuts");
        makeHist_mms(data, "mms", "#mms", "Mean - Median");
        makeHist_hmss(data, "hmss", "#hmss", 
                "Number of seats won by democrats");
        makeHist_votes(data, "most_democratic_district_vote_share", "#p_votes", 
            "Percentage Democratic Votes in the most Democratic district");

        if (check_selection_nb_cuts) {
            col_to_filter = "nb_cuts";
            cutoff_max = svg_nb_cuts.append('rect');
            cutoff_min = svg_nb_cuts.append('rect');

            var tmax_tmp = xScale_nb_cuts.invert(tx_max);
            var tmin_tmp = xScale_nb_cuts.invert(0);
            tmin_tmp = tmin_tmp.toPrecision(3);
            tmax_tmp = tmax_tmp.toPrecision(3);
            thresholdLabel_max = svg_nb_cuts.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_nb_cuts.append('text')
                .text('Min: ' + tmin_tmp);
        }
        if (check_selection_egs) {
            col_to_filter = "egs";
            cutoff_max = svg_egs.append('rect');
            cutoff_min = svg_egs.append('rect');

            var tmax_tmp = xScale_egs.invert(tx_max);
            var tmin_tmp = xScale_egs.invert(0);
            // tmin_tmp = (tmin_tmp*100).toPrecision(3);
            // tmax_tmp = (tmax_tmp*100).toPrecision(3);
            tmin_tmp = tmin_tmp.toPrecision(3);
            tmax_tmp = tmax_tmp.toPrecision(3);
            thresholdLabel_max = svg_egs.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_egs.append('text')
                .text('Min: ' + tmin_tmp);
        }
        if (check_selection_mms) {
            col_to_filter = "mms";
            cutoff_max = svg_mms.append('rect');
            cutoff_min = svg_mms.append('rect');

            var tmax_tmp = xScale_mms.invert(tx_max);
            var tmin_tmp = xScale_mms.invert(0);
            tmin_tmp = tmin_tmp.toPrecision(2);
            tmax_tmp = tmax_tmp.toPrecision(2);
            thresholdLabel_max = svg_mms.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_mms.append('text')
                .text('Min: ' + tmin_tmp);
        }
        if (check_selection_hmss) {
            col_to_filter = "hmss";
            cutoff_max = svg_hmss.append('rect');
            cutoff_min = svg_hmss.append('rect');

            var tmax_tmp = xScale_hmss.invert(tx_max);
            var tmin_tmp = xScale_hmss.invert(0);
            tmin_tmp = tmin_tmp.toPrecision(1);
            tmax_tmp = tmax_tmp.toPrecision(1);
            thresholdLabel_max = svg_hmss.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_hmss.append('text')
                .text('Min: ' + tmin_tmp);
        }
        if (check_selection_p_votes) {
            col_to_filter = "most_democratic_district_vote_share";
            cutoff_max = svg_p_votes.append('rect');
            cutoff_min = svg_p_votes.append('rect');

            var tmax_tmp = xScale_p_votes.invert(tx_max);
            var tmin_tmp = xScale_p_votes.invert(0);
            // tmin_tmp = (tmin_tmp*100).toPrecision(3);
            // tmax_tmp = (tmax_tmp*100).toPrecision(3);
            tmin_tmp = tmin_tmp.toPrecision(3);
            tmax_tmp = tmax_tmp.toPrecision(3);
            thresholdLabel_max = svg_p_votes.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_p_votes.append('text')
                .text('Min: ' + tmin_tmp);
        }
        
        // threshold bar for MAX
        cutoff_max.attr('x', tx_max)
                            .attr('y', -20)//-height
                            .attr('width', 7)
                            .attr('height', height + 20)
                            .attr("class", "cutoff_max_rect");
        

        thresholdLabel_max.attr('x', tx_max - 10)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline','baseline')
            .attr('class', 'thresholdLabel_max');

        // threshold bar for MIN
        cutoff_min.attr('x', 0)
                            .attr('y', -10)//-height
                            .attr('width', 7)
                            .attr('height', height + 10)
                            .attr("class", "cutoff_min_rect");

        thresholdLabel_min.attr('x', 0)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'hanging')
            .attr('class', 'thresholdLabel_min');

        graph = true;
      };


    this.update_range();
};



Range.prototype.update_range = function(){
    filterData = this.filterData;


    data = this.data;
    filter_var_min = this.filter_var_min;
    filter_var_max = this.filter_var_max;

    default_var_min = this.default_var_min;
    default_var_max = this.default_var_max;  

    check_selection_nb_cuts = document.getElementById("check_selection_nb_cuts").checked;
    check_selection_egs = document.getElementById("check_selection_egs").checked;
    check_selection_mms = document.getElementById("check_selection_mms").checked;
    check_selection_hmss = document.getElementById("check_selection_hmss").checked;
    check_selection_p_votes = document.getElementById("check_selection_p_votes").checked;

    if (check_selection_nb_cuts) {
        col_to_filter = "nb_cuts";
        filter_var_max = xScale_nb_cuts.invert(tx_max);
        filter_var_min = xScale_nb_cuts.invert(tx_min);
    }
    if (check_selection_egs) {
        col_to_filter = "egs";
        filter_var_max = xScale_egs.invert(tx_max);
        filter_var_min = xScale_egs.invert(tx_min);
    }
    if (check_selection_mms) {
        col_to_filter = "mms";
        filter_var_max = xScale_mms.invert(tx_max);
        filter_var_min = xScale_mms.invert(tx_min);
    }
    if (check_selection_hmss) {
        col_to_filter = "hmss";
        filter_var_max = xScale_hmss.invert(tx_max);
        filter_var_min = xScale_hmss.invert(tx_min);
    }
    if (check_selection_p_votes) {
        col_to_filter = "most_democratic_district_vote_share";
        filter_var_max = xScale_p_votes.invert(tx_max);
        filter_var_min = xScale_p_votes.invert(tx_min);
    }



      ///////////////////////////////////////////////
    // Sliding threshold bar.
    

    filterData = filterData.filter(function(d) { 
        return ((+d[col_to_filter] <= filter_var_max) && (+d[col_to_filter] >= filter_var_min) );});
///////////////////////////////////////////////


    
    if (graph) { // if the histogram exists then update its data
        updateHist_egs(filterData, "egs", "#egs");
        updateHist_cuts(filterData, "nb_cuts", "#nb_cuts");
        updateHist_mms(filterData, "mms", "#mms");
        updateHist_hmss(filterData, "hmss", "#hmss");
        updateHist_votes(filterData, "most_democratic_district_vote_share", "#p_votes");

        cutoff_max.call(drag_max);
        thresholdLabel_max.call(drag_max);

        cutoff_min.call(drag_min);
        thresholdLabel_min.call(drag_min);

      } else {// otherwise create the histogram        
        makeHist_egs(data, "egs", "#egs" , "Efficiency Gap");
        makeHist_cuts(data, "nb_cuts", "#nb_cuts" , "Number of Cuts");
        makeHist_mms(data, "mms", "#mms", "Mean - Median");
        makeHist_hmss(data, "hmss", "#hmss", "Number of seats won by democrats");
        makeHist_votes(data, "most_democratic_district_vote_share", "#p_votes", "Percentage Democratic Votes");

        graph = true;
      }

};




// for threshold bars
function setThreshold(t, eventFromUser, max_true) {
    t = Math.min(t, default_var_max);
    t = Math.max(t, default_var_min);
    if (eventFromUser) {
        
        if (check_selection_hmss){
            t = t.toPrecision(1);
        }
        if (check_selection_nb_cuts){
            t = t.toPrecision(3);
        }
        if (check_selection_egs || check_selection_p_votes){
            // t = t*100;
            t = t.toPrecision(3);

        }
        if (check_selection_mms){
            t = t.toPrecision(2);
        }  
    } 

    if (max_true){
        filter_var_max = t;
        tx_max = Math.max(0, Math.min(width - 4, tx_max));
        if (tx_max < tx_min){
            tx_max = tx_min;
        }
        cutoff_max.enter()
                    .merge(cutoff_max)
                    .transition()
                    .duration(1)
                    .attr('x', tx_max);
        cutoff_max.exit()
                .remove();
        
        thresholdLabel_max.enter()
                    .merge(thresholdLabel_max)
                    .transition()
                    .duration(1)
                    .attr('x', tx_max)
                    .text('Max: ' + filter_var_max)
        thresholdLabel_max.exit()
                .remove();
    }
    else {
        filter_var_min = t;
        tx_min = Math.max(0, Math.min(width - 4, tx_min));
        if (tx_min > tx_max){ tx_min = tx_max; }
        cutoff_min.enter()
                    .merge(cutoff_min)
                    .transition()
                    .duration(1)
                    .attr('x', tx_min);
        cutoff_min.exit()
                .remove();
        
        thresholdLabel_min.enter()
                    .merge(thresholdLabel_min)
                    .transition()
                    .duration(1)
                    .attr('x', tx_min)
                    .text('Min: ' + filter_var_min)
        thresholdLabel_min.exit()
                .remove();
    }
};

// listening to drag events
var drag_max = d3.drag()
.on('drag', function() {
    tx_max += d3.event.dx;  
    
    if (check_selection_nb_cuts) { var t_max = xScale_nb_cuts.invert(tx_max)}
    if (check_selection_egs) { var t_max = xScale_egs.invert(tx_max)}
    if (check_selection_mms) { var t_max = xScale_mms.invert(tx_max)}
    if (check_selection_hmss) { var t_max = xScale_hmss.invert(tx_max)}
    if (check_selection_p_votes) { var t_max = xScale_p_votes.invert(tx_max)}
    setThreshold(t_max, true, true);
    update();
});

// listening to drag events
var drag_min = d3.drag()
.on('drag', function() {
    tx_min += d3.event.dx;
    
    if (check_selection_nb_cuts) { var t_min = xScale_nb_cuts.invert(tx_min);}
    if (check_selection_egs) { var t_min = xScale_egs.invert(tx_min);}
    if (check_selection_mms) { var t_min = xScale_mms.invert(tx_min);}
    if (check_selection_hmss) { var t_min = xScale_hmss.invert(tx_min);}
    if (check_selection_p_votes) { var t_min = xScale_p_votes.invert(tx_min);}
    setThreshold(t_min, true, false);
    update();
});



function changeDataPath(){
    var selectionVal = d3.select('#chooseData').property('value');
    if (selectionVal == 0){
        path = "data/VA_data/plan_metrics_ATG17.csv";
        HISTOGRAM_BUCKET_SIZE = 4;
        numBuckets = 200 / HISTOGRAM_BUCKET_SIZE;
        n_median_seats = 5;
    } else {
        path = "data/PA_data/plan_metrics_PA_PRES16.csv";
        HISTOGRAM_BUCKET_SIZE = 5;
        numBuckets = Math.round( 200 / HISTOGRAM_BUCKET_SIZE);
        n_median_seats = 10;
    }
    startHere(path);
};

function disp_text() {
    if (document.getElementById("description").value == "1"){
        document.getElementById("message").innerHTML = "If we split the maps into tiny squares, the number of cut edges between the districts in a particular plan."+"\n"+"High number implies unconstitutional gerrymandering";
    } else if (document.getElementById("description").value == "2"){
        document.getElementById("message").innerHTML = "How democratic is the most democratic congressional district in the state?"+"\n"+"A high percentage implies partisan imbalance.";
    } else if (document.getElementById("description").value == "3"){
        document.getElementById("message").innerHTML = "The difference between the average vote share of either party across all districts from the median vote share of the same party across all districts."+"\n"+"A negative mean-median difference indicates that the examined party has an advantage; a positive difference indicates that the examined party is disadvantaged.";
    } else if (document.getElementById("description").value == "4"){
        document.getElementById("message").innerHTML = "Number of seats won by Democrats out of the total number of electoral seats."+"\n"+"This simply indicates the voting outcome distribution from the global universe of possibilities across 100,000 simulated district plans; does not explicitly indicate if gerrymandering has taken place.";
    } else if(document.getElementById("description").value == "5"){
        document.getElementById("message").innerHTML = "The difference between the parties' respective wasted votes, divided by the total number of votes cast in the election"+"\n"+"It has been proposed that 8% in state legislative maps should be used as minimum thresholds for determining gerrymandering has taken place.";
    } else{
        document.getElementById("message").innerHTML = "";
    }        
};



var cuts_map1 = 590;
var cuts_map2 = 571;
var cuts_map3 = 584;

var votes_map1 = 0.712889894;
var votes_map2 = 0.735565752;
var votes_map3 = 0.744697064;

var mms_map1 = -0.007489715;
var mms_map2 = -0.0395846;
var mms_map3 = 0.000752651;

var hmss_map1 = 7;
var hmss_map2 = 6;
var hmss_map3 = 7;

var egs_map1 = -0.076422874;
var egs_map2 = 0.009557028 ;
var egs_map3 = -0.084787178;

var labelCut;
var labelVote;
var labelMms;
var labelHmss;
var labelEgs;

function map_highlight(number){
    console.log("click map to trigger function");
    var cutToShow;
    var voteToShow;
    var mmsToShow;
    var hmssToShow;
    var egsToShow;

    var labelText;


    if (number == 1){
        cutToShow = cuts_map1;
        voteToShow = votes_map1;
        mmsToShow = mms_map1;
        hmssToShow = hmss_map1;
        egsToShow = egs_map1;
        labelText = "Map 1";
    }
    else if (number == 2){
        cutToShow = cuts_map2;
        voteToShow = votes_map2;
        mmsToShow = mms_map2;
        hmssToShow = hmss_map2;
        egsToShow = egs_map2;
        labelText = "Map 2";
    } else {
        cutToShow = cuts_map3;
        voteToShow = votes_map3;
        mmsToShow = mms_map3;
        hmssToShow = hmss_map3;
        egsToShow = egs_map3;
        labelText = "Map 3";
    }
    barCut.enter()
            .merge(barCut)
            .transition()
            .duration(1)
            .attr('x', xScale_nb_cuts2(cutToShow))
            .attr('y', -20)//-height
                        .attr('width', 7)
                        .attr('height', height + 20)
                        .attr("class", "barcut2");
    barCut.exit()
            .remove();
    barVotes.enter()
            .merge(barVotes)
            .transition()
            .duration(1)
            .attr('x', xScale_p_votes2(voteToShow))
            .attr('y', -20)//-height
                        .attr('width', 7)
                        .attr('height', height + 20)
                        .attr("class", "barvotes2");
    barVotes.exit()
            .remove();



    barMms.enter()
            .merge(barMms)
            .transition()
            .duration(1)
            .attr('x', xScale_mms2(mmsToShow))
            .attr('y', -20)
                        .attr('width', 7)
                        .attr('height', height + 20)
                        .attr("class", "barmms2");

    barMms.exit()
            .remove();
    barHmss.enter()
            .merge(barHmss)
            .transition()
            .duration(1)
            .attr('x', xScale_hmss2(hmssToShow))
            .attr('y', -20)
                        .attr('width', 7)
                        .attr('height', height + 20)
                        .attr("class", "barhmss2");
    barHmss.exit()
            .remove();

    barEgs.enter()
            .merge(barEgs)
            .transition()
            .duration(1)
            .attr('x', xScale_egs2(egsToShow))
            .attr('y', -20)
                        .attr('width', 7)
                        .attr('height', height + 20)
                        .attr("class", "baregs2");
    barEgs.exit()
            .remove();


    labelCut.enter()
            .merge(labelCut)
            .transition()
            .duration(1)
            .attr('x', xScale_nb_cuts2(cutToShow))
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .text(labelText);
    labelCut.exit()
    .remove()
    labelVote.enter()
            .merge(labelVote)
            .transition()
            .duration(1)
            .attr('x', xScale_p_votes2(voteToShow))
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .text(labelText);
    labelVote.exit()
    .remove()
    labelMms.enter()
            .merge(labelMms)
            .transition()
            .duration(1)
            .attr('x', xScale_mms2(mmsToShow))
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .text(labelText);
    labelMms.exit()
    .remove()
    labelHmss.enter()
            .merge(labelHmss)
            .transition()
            .duration(1)
            .attr('x', xScale_hmss2(hmssToShow))
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .text(labelText);
    labelHmss.exit()
    .remove()
    labelEgs.enter()
            .merge(labelEgs)
            .transition()
            .duration(1)
            .attr('x', xScale_egs2(egsToShow))
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .text(labelText);
    labelEgs.exit()
    .remove()
};

    