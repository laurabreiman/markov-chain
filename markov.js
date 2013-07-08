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
        
        return {transition: transition, observe: observe,
            set_num_states: set_num_states, set_initial_state: set_initial_state};
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