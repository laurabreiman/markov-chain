var markovChain = (function() {
    
    var exports = {};
    
////////////////////////////////// global variables 
    
    //d3 chart components
    var chart;
    
    var xMin = -10;
    var xMax = 10;
    var yMin = -10;
    var yMax = 10;
    
    var outer_height = 300;
    var outer_width = 300;

    var margin = { top: 20, right: 20, bottom: 20, left: 20 }
    var chart_width = outer_width - margin.left - margin.right;
    var chart_height = outer_height -margin.top - margin.bottom;
    
    var x_scale = d3.scale.linear().domain([xMin,xMax]).range([0,chart_width]);
    var y_scale = d3.scale.linear().domain([yMin,yMax]).range([chart_height,0]);
    
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
        
        return {transition: transition, observe: observe};
    }
    
    function Controller(){
        
        return {};
    }
    
    function View(){
        
        return {};
    }
    
    //set up svg with axes and labels
    function setupGraph(){
        
        $(".chart-container").empty();
        chart = d3.select(".chart-container").append("svg").attr("class","chart").attr("height", outer_height).attr("width",outer_width).append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");
        
        chart.selectAll(".y-line")

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