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
        var initial_state = {0: 1, 1: 0, 2: 0};
        var transition_model = {0: {0: .5, 1: 0.5}, 1: {0: 1/8, 1: 1/2, 2:  3/8}, 2: {1: 1/4, 2:  3/4}};
        var observation_model = {0: {red: 0, white: 1}, 1: {red: 1/2, white: 1/2}, 2:  {red: 1,white: 0}};
        var current_state = {0: 1, 1: 0, 2: 0};
        //var previous_state = {0: 1, 1: 0, 2: 0};
        function set_initial_state(array){
            var sum = 0;
            $.each(array,function() {
                sum += this;
            });
            if (sum != 1){throw new Error("the sum should be 1.");} //throw an error if the sum isn't 1.
            else {
                for (var i = 0; i < array.length; i++){
                initial_state[i] = array[i];
                }
            }
            console.log(initial_state);
        }
        function set_num_states(num_states){
            //change initial_state
            for (var i in initial_state){
                delete initial_state[i];
            }
            for (var i = 0; i < num_states; i++){
                initial_state[i] = 1/num_states;    //each state set to be equally likely
            }
            console.log('intial state', initial_state);

            //change transition_model
            for (var i in transition_model){
                delete transition_model[i];
            }
            //special cases: state 0 and n-1
            transition_model[0] = {0: 0.5, 1: 0.5};
            console.log('trans for',0,"=",transition_model[0]); 
                       
            transition_model[num_states-1] = {};
            transition_model[num_states-1][num_states-2] = 0.5;
            transition_model[num_states-1][num_states-1]= 0.5;

            for (var i = 1; i < num_states-1; i++){
                var assocArray = {};
                assocArray[i-1] = i/(num_states-1)*0.5;
                assocArray[i] = 0.5;
                assocArray[i+1] = 0.5-i/(num_states-1)*0.5;
                transition_model[i] = assocArray;
                console.log('trans for',i,'=', assocArray);
            }
            console.log('trans for',num_states-1,"=",transition_model[num_states-1]);

        }
       
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
        
<<<<<<< HEAD
        return {transition: transition, observe: observe,
            set_num_states: set_num_states, set_initial_state: set_initial_state};
=======
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
>>>>>>> 671f479db7d58294ee1fac2618a316af2c1468b7
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
            chart.selectAll(".diagRight").remove();
            chart.selectAll(".diagLeft").remove();
            
            var points = model.get_current_state_array();
            
            chart.selectAll(".arrow").data(points).enter().append("line")
                .attr("class", "arrow")
                .attr("x1", function(d,i){return chart_width*(i/points.length)})
                .attr("y1", chart_height/5)
                .attr("x2", function(d,i){return chart_width*(i/points.length)})
                .attr("y2", (4/5)*chart_height)
                .style("stroke","black");
            
            chart.selectAll(".diagRight").data(points).enter().append("line")
                .attr("class", "diagRight")
                .attr("x1", function(d,i){return chart_width*(i/points.length)})
                .attr("y1", chart_height/5)
                .attr("x2", function(d,i){if(i!=points.length-1){return chart_width*((i+1)/points.length)}
                                          else{return chart_width*(i/points.length)}})
                .attr("y2", function(d,i){if(i!=points.length-1){ return (4/5)*chart_height}
                                          else{ return chart_height/5}})
                .style("stroke","blue");
            
            chart.selectAll(".diaLeft").data(points).enter().append("line")
                .attr("class", "diagLeft")
                .attr("x1", function(d,i){return chart_width*(i/points.length)})
                .attr("y1", chart_height/5)
                .attr("x2", function(d,i){if(i!=0){return chart_width*((i-1)/points.length)}
                                          else{return chart_width*(i/points.length)}})
                .attr("y2", function(d,i){if(i!=0){ return (4/5)*chart_height}
                                          else{ return chart_height/5}})
                .style("stroke","orange");
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