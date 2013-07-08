var markovChain = (function() {
    
    var exports = {};
    
////////////////////////////////// global variables 
    
    //d3 chart components
    
////////////////////////////////// helper functions    
    
    //rounds a number (number) to the specified amount of decimal points (decimals)
    function round_number(number,decimals){
        return Math.round(number*Math.pow(10,decimals))/Math.pow(10,decimals)
    }
    
    //creates a range of values from start to stop in step sized increments
    function range(start, stop, step){
    if (typeof stop=='undefined'){
        // one param defined
        stop = start;
        start = 0;
    };
    if (typeof step=='undefined'){
        step = 1;
    };
    if ((step>0 && start>=stop) || (step<0 && start<=stop)){
        return [];
    };
    var result = [];
    for (var i=start; step>0 ? i<stop : i>stop; i+=step){
        result.push(i);
    };
    return result;
};
    
//    function setAllValsZero( assocArray ){
//        for(var i in assocArray){
//            assocArray[i] = 0;
//        }
//        return assocArray;
//    }
/////////////////////////////////// set up div functions
    
    function Model(){
        var initial_state = {a: 1, b: 0, c:0};
        var transition_model = {a: {a:.5, b:0.5}, b:{a:1/8, b: 1/2, c: 3/8}, c:{b: 1/4, c: 3/4}};
        var observation_model = {a: {red:0, white:1}, b: {red:1/2, white:1/2}, c: {red:1,white:0}};
        var current_state = {a: 1, b: 0, c:0};
        //var previous_state = {a: 1, b: 0, c:0};
        
        function transition(){
            var next_state = {};
            
            for(var i in current_state){
                next_state[i] = 0;
            }
            
            for(var i in current_state){
                for(var j in transition_model[i]){
                    next_state[i] += current_state[j]*transition_model[j][i]
                }
                
            }
            //console.log(next_state);
            current_state = next_state;
        }
        
        function observe(obs){
            var next_state = {};
            
            for(var i in current_state){
                next_state[i] = 0;
            }
            
            var total = 0;
            for(var i in current_state){
                next_state[i] += current_state[i]*observation_model[i][obs]
                total += current_state[i]*observation_model[i][obs];
            }
            
            for(var i in next_state){
                next_state[i] = next_state[i]/total;
            }
            
            console.log(next_state);
            current_state = next_state;
            
        }
        
        function get_current_state(){
            return current_state;
        }
        function get_current_state_array(){
            var pointData = [];
            for(var i in current_state){
                pointData.push(current_state[i]);
            }
            
            return pointData;
        }
        
        return {transition: transition, observe: observe, get_current_state: get_current_state, get_current_state_array: get_current_state_array};
    }
    
    function Controller(model){
        
        return {};
    }
    
    function View(div, model, controller){
                
        div.append("<div class = 'container-fluid'><div class = 'row-fluid'><div class = 'span10'><div class = 'chart-container'></div></div><div class = 'span2'><div class = 'controls'></div></div></div></div>");
        
        var chart;
        
        var outer_height = parseInt($("body").css("height"))*0.9;
        var outer_width = parseInt($(".span10").css("width"));
    
        var margin = { top: 30, right: 20, bottom: 20, left: 20 }
        var chart_width = outer_width - margin.left - margin.right;
        var chart_height = outer_height -margin.top - margin.bottom;
        
        setupGraph();
        updateBubbles();
        updateArrows();
        
        function updateBubbles(){
            chart.selectAll(".bubble").remove();
            
            var points = model.get_current_state_array();
            
            chart.selectAll(".bubble").data(points).enter().append("circle")
                .attr("class", "bubble")
                .attr("cx", function(d,i){return chart_width*(i/points.length)})
                .attr("cy", 0)
                .attr("r", function(d){return d*10+4})
                .style("fill","blue")
                .style("stroke","black")
                .style("fill-opacity",function(d){return d;});
        }
        
        function updateArrows(){
            chart.selectAll(".arrow").remove();
            
            var points = model.get_current_state_array();
            
            chart.selectAll(".arrow").data(points).enter().append("line")
                .attr("class", "arrow")
                .attr("x1", function(d,i){return chart_width*(i/points.length)})
                .attr("y1", chart_height/5)
                .attr("x2", function(d,i){return chart_width*(i/points.length)})
                .attr("y2", (4/5)*chart_height)
                .style("stroke","black");
        }
        
        //set up svg with axes and labels
        function setupGraph(){
            
            $(".chart-container").empty();
            chart = d3.select(".chart-container").append("svg").attr("class","chart").attr("height", outer_height).attr("width",outer_width).append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
        }
        
        return {updateBubbles: updateBubbles, updateArrows: updateArrows, setupGraph: setupGraph};
    }
    
    
    //setup main structure of app
    function setup(div) {

        var model = Model();
        var controller = Controller(model);
        var view = View(div, model, controller);
        
    }; 
    
    exports.setup = setup;
    exports.model = Model;
    exports.view = View;
    exports.controller = Controller;

    return exports;
}());

$(document).ready(function() {
    markovChain.setup($('.markov'));
});