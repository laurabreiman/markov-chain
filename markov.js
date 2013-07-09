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
                //set_num_states(array.length);
                for (var i = 0; i < array.length; i++){
                initial_state[i] = array[i];
                }
            }
            current_state = initial_state;
            console.log(initial_state);
        }
        function set_num_states(num_states){
            //change initial_state
            initial_state = {};
            for (var i = 0; i < num_states; i++){
                initial_state[i] = 1/num_states;    //each state set to be equally likely
            }
            console.log('intial state', initial_state);
            current_state = initial_state;

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

            //change observation_model
            for (var i in observation_model){
                delete observation_model[i];
            }
            for (var i = 0; i < num_states; i++){
                observation_model[i] = {red: i/(num_states-1), white: 1-i/(num_states-1)};
                //console.log('obs for',i,'=', observation_model[i]);
            }

        }

        //returns red or white depending on the current prob distribution.
        function make_obs(){
            var n = Object.getOwnPropertyNames(current_state).length;
            var prob_red = 0;
            for (var i in current_state){
                prob_red += current_state[i]*i/(n-1);
            }
            var r = Math.random();
            console.log(r);
            console.log(prob_red);
            if (r < prob_red){return "red";}
            else {return "white";}
        }

        //Returns probability of Obs=o given State=s as an assoc array of assoc arrays.
        //prob_OgS()[o][s] will return the desired probability.
        function prob_OgS(){
            var n = Object.getOwnPropertyNames(initial_state).length;
            var assocArray = {};
            var r = {}; var w = {};
            for (var i = 0; i < n; i++){
                r[i] = i/(n-1);
            }
            for (var i = 0; i < n; i++){
                w[i] = 1-i/(n-1);
            }
            assocArray["red"] = r; assocArray["white"] = w;
            return assocArray;
        }

        //Returns probability of Obs=o & State=s as an assoc array of assoc arrays.
        //prob_OnS()[o][s] will return the desired probability.
        function prob_OnS(){
            var n = Object.getOwnPropertyNames(initial_state).length
            var assocArray = {};
            var r = {}; var w = {};
            for (var i = 0; i < n; i++){
                r[i] = current_state[i]*prob_OgS()["red"][i];
            }
            for (var i = 0; i < n; i++){
                w[i] = current_state[i]*prob_OgS()["white"][i];
            }
            assocArray["red"] = r; assocArray["white"] = w;
            return assocArray;
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
        
        return {transition: transition, observe: observe, 
            get_current_state: get_current_state, get_current_state_array: get_current_state_array, 
            set_num_states: set_num_states, set_initial_state: set_initial_state, 
            prob_OnS: prob_OnS, prob_OgS: prob_OgS, make_obs: make_obs};
    }
    
    function Controller(model){
        /*
        function that takes in an array of probabilites
        returns an array like ["right","wrong","wrong"...0] based on the current
        probability states with the last entry a flag of 
        whether it was all right (1) or not (0)
        */
        function checkAnswers(answers){
            var current_state = model.get_current_state(); //check this!!!!!
            var result = [];
            var allCorrect = 1;
            for (var i = 0; i < answers.length; i++){
                console.log(answers[i].toFixed(3), current_state[i].toFixed(3));
                if (answers[i].toFixed(3) == current_state[i].toFixed(3)){
                    console.log("here");
                    result[i] = "right";                 
                }
                else {result[i] = "wrong"; allCorrect = 0;}
            }
            result[answers.length] = allCorrect;
            return result;
        }
        /*
        function that takes in an array of probabilites
        returns an array like ["right","wrong","wrong"...0] based on the probability of 
        with the last entry a flag of whether it was all right (1) or not (0)
        */
        function checkOgS(answers, obs){
            var result = [];
            var correct = model.prob_OgS()[obs];
            var allCorrect = 1;
            for (var i = 0; i < answers.length; i++){
                if (answers[i].toFixed(3) == correct[i].toFixed(3)){
                    result[i] = "right";                 
                }
                else {result[i] = "wrong"; allCorrect = 0;}
            }
            result[answers.length] = allCorrect;
            return result;
        }

        function checkOnS(answers, obs){
            var result = [];
            var correct = model.prob_OnS()[obs];
            var allCorrect = 1;
            for (var i = 0; i < answers.length; i++){
                if (answers[i].toFixed(3) == correct[i].toFixed(3)){
                    result[i] = "right";                 
                }
                else {result[i] = "wrong"; allCorrect = 0;}
            }
            result[answers.length] = allCorrect;
            return result;
        }
        
        return {checkAnswers: checkAnswers, checkOgS: checkOgS, checkOnS: checkOnS};
    }
    
    function View(div, model, controller){
                
        div.append("<div class = 'container-fluid well'><div class = 'row-fluid'><div class ='span1'><div class='side-labels'></div></div><div class = 'span9'><div class = 'chart-container'></div></div><div class = 'span2'><div class = 'controls'></div></div></div></div>");
        $(".controls").append("<div class = 'container-fluid'><div class ='row-fluid'><button class='btn btn-small transition'>Transition</button></div><div class ='row-fluid'><input class='num-states' placeholder = '# of blocks'><button class='btn btn-small new-chain'>New</button></div></div>");
        $(".span9").append("<div class = 'row-fluid'><div class = 'input-row'></div></div>");
        
        $(".transition").on("click",transition);
        $(".new-chain").on("click",newChain);
        
        var chart;
        
        var outer_height = 400;
        var outer_width = parseInt($(".span9").css("width"));
    
        var margin = { top: 30, right: 20, bottom: 20, left: 20 }
        var chart_width = outer_width - margin.left - margin.right;
        var chart_height = outer_height -margin.top - margin.bottom;
        
        setupGraph();
        updateDisplay();
        setupSideLabels();

        function transition(){
            transitionTop();
            transitionBottom();
        }

        function newChain(){
            console.log('hello')

            if(isNaN($(".num-states").val()) || $(".num-states").val() < 0){
                alert("Please enter a valid number");
            }
            
            else{
                var numStates = $(".num-states").val();

                console.log(numStates)

                model.set_num_states(numStates);
                updateDisplay();
            }
        }
        
        function setupSideLabels(){
            $('.side-labels').append("<div class='num-label'># of whites</div>");
            $('.side-labels').append("<div class='first-prob'>P(S<sub>1</sub>=s)</div>");
            $('.side-labels').append("<div class='num2-label'># of whites</div>");
            $('.side-labels').append("<div class='second-prob'>P(S<sub>2</sub>=s)</div>");
            $('.num-label').offset({top: $(".bubble-name").offset().top});
            $('.first-prob').offset({top: $(".bubble-label").offset().top});
            $('.num2-label').offset({top: $(".bottom-bubble-name").offset().top});       
            $('.second-prob').offset({top: $(".input-row").offset().top});
            //$('.input-row #'+i+'').offset({left: $(".input-row").offset().left + i*(chart_width)/(num_entries-1)});
        }
        
        function updateDisplay(){
            updateTopBubbles();
            updateArrows();
            model.transition();
            updateBottomBubbles();
            updateFirstInputRow();
        }
        
        function updateTopBubbles(){
            chart.selectAll(".top_bubble").remove();
            
            var points = model.get_current_state_array();
            
            chart.selectAll(".top_bubble").data(points).enter().append("circle")
                .attr("class", "top_bubble")
                .attr("cx", function(d,i){return (chart_width)*(i/(points.length-1))})
                .attr("cy", 0)
                .attr("r", function(d){return d*(chart_height/20)+4})
                .style("fill","red")
                .style("stroke","black")
                .style("fill-opacity",function(d){return d;});
            
            updateTopLabels();
        }
        
        function transitionTop(){
            var points = model.get_current_state_array();
            
            chart.selectAll(".top_bubble").data(points).transition().duration(500)
                .attr("r", function(d){return d*(chart_height/20)+4})
                .style("fill-opacity",function(d){return d;});
            
            updateTopLabels();
        }
        
        function transitionBottom(){
            model.transition();
            var points = model.get_current_state_array();
            
            chart.selectAll(".bottom_bubble").data(points).transition().duration(500)
                .attr("r", function(d){return d*(chart_height/16)+4})
                .style("fill-opacity",function(d){return d;});
            
            updateBottomLabels();
        }
        
        function updateBottomBubbles(){
            chart.selectAll(".bottom_bubble").remove();
            
            var points = model.get_current_state_array();

            chart.selectAll(".bottom_bubble").data(points).enter().append("circle")
                .attr("class", "bottom_bubble")
                .attr("cx", function(d,i){return chart_width*(i/(points.length-1))})
                .attr("cy", chart_height)
                .attr("r", function(d){return d*(chart_height/16)+4})
                .style("fill","red")
                .style("stroke","black")
                .style("fill-opacity",function(d){return d;});
            
            updateBottomLabels();
        }
        
        function updateTopLabels(){
            
            var points = model.get_current_state_array();
            var names = Object.keys(model.get_current_state());
            
            chart.selectAll(".bubble-name").remove();
            chart.selectAll(".bubble-label").remove();
            
            chart.selectAll(".bubble-name").data(names).enter().append("text").attr("class", "bubble-name")
                .attr("x",function(d,i){return chart_width*(i/(points.length-1))})
                .attr('y',chart_height/8)
                .attr("dx",-4)
                .text(function(d) { return d; });
            
            chart.selectAll(".bubble-label").data(points).enter().append("text").attr("class", "bubble-label")
                .attr("x",function(d,i){return chart_width*(i/(points.length-1))})
                .attr('y',chart_height/6+5)
                .attr("dx",-4)
                .text(function(d) { return round_number(d,4); });
        }
        
        function updateBottomLabels(){
            
            var points = model.get_current_state_array();
            var names = Object.keys(model.get_current_state());
            
            chart.selectAll(".bottom-bubble-name").remove();
            chart.selectAll(".bottom-bubble-label").remove();
            
            chart.selectAll(".bottom-bubble-name").data(names).enter().append("text").attr("class", "bottom-bubble-name")
                .attr("x",function(d,i){return chart_width*(i/(points.length-1))})
                .attr('y',(7/8)*chart_height)
                .attr("dx",-4)
                .text(function(d) { return d; });
//            
//            chart.selectAll(".bottom-bubble-label").data(points).enter().append("text").attr("class", "bottom-bubble-label")
//                .attr("x",function(d,i){return chart_width*(i/(points.length-1))})
//                .attr('y',(6/7)*chart_height)
//                .attr("dx",-4)
//                .text(function(d) { return round_number(d,4); });
        }
        
        function updateFirstInputRow(){
            $('.input-row').empty();
            var num_entries = model.get_current_state_array().length;
            console.log($(".input-row").css("width"));
            for(var i = 0; i < num_entries; i++){
                $('.input-row').append("<input class='obs-entry' id='"+i+"' placeholder='P("+i+")'>");
                $('.input-row #'+i+'').offset({left: $(".input-row").offset().left + i*(chart_width)/(num_entries-1)});
                $('.obs-entry').css("width",""+(10-num_entries/3)+"%")
            }
            
            $('.input-row').append("<div class='row-fluid check-row'><button class='btn btn-small check'>Check</button></div>");
            
            $('.check').on('click',function(){
                var answers = [];
                for(var i=0; i<num_entries; i++){
                    answers.push($('.input-row #'+i+'').val());
                }
                var results = controller.checkAnswers(answers);
                if(results[-1] == 1){
                    displayNextInputRow();
                }
            });
        }
        
        function displayNextInputRow(){
        
        }
        
        function updateArrows(){
            chart.selectAll(".arrow").remove();
            chart.selectAll(".diagRight").remove();
            chart.selectAll(".diagLeft").remove();
            
            var points = model.get_current_state_array();
            
            chart.append("defs").append("marker")
                .attr("id", "arrowhead")
                .attr("refX", 6) /*must be smarter way to calculate shift*/
                .attr("refY", 2)
                .attr("markerWidth", 10)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                    .attr("d", "M 0,0 V 4 L6,2 Z");
            
            chart.selectAll(".arrow").data(points).enter().append("line")
                .attr("class", "arrow")
                .attr("x1", function(d,i){return chart_width*(i/(points.length-1))})
                .attr("y1", chart_height/5)
                .attr("x2", function(d,i){return chart_width*(i/(points.length-1))})
                .attr("y2", (5/6)*chart_height)
                .style("stroke","black")
                .attr("marker-end", "url(#arrowhead)");
            
            chart.selectAll(".diagRight").data(points).enter().append("line")
                .attr("class", "diagRight")
                .attr("x1", function(d,i){return chart_width*(i/(points.length-1))})
                .attr("y1", chart_height/5)
                .attr("x2", function(d,i){if(i!=points.length-1){return chart_width*((i+1)/(points.length-1))}
                                          else{return chart_width*(i/(points.length-1))}})
                .attr("y2", function(d,i){if(i!=points.length-1){ return (5/6)*chart_height}
                                          else{ return chart_height/5}})
                .attr("marker-end", function(d,i){if(i!=points.length-1){ return "url(#arrowhead)"}
                                          else{ return ""}})
                .style("stroke","blue");
            
            chart.selectAll(".diagLeft").data(points).enter().append("line")
                .attr("class", "diagLeft")
                .attr("x1", function(d,i){return chart_width*(i/(points.length-1))})
                .attr("y1", chart_height/5)
                .attr("x2", function(d,i){if(i!=0){return chart_width*((i-1)/(points.length-1))}
                                          else{return chart_width*(i/(points.length-1))}})
                .attr("y2", function(d,i){if(i!=0){ return (5/6)*chart_height}
                                          else{ return chart_height/5}})
                .attr("marker-end", function(d,i){if(i!=0){ return "url(#arrowhead)"}
                                            else{ return ""}})
                .style("stroke","orange");
            
            
        }
        
        function updateArrowLabels(){
            
        }
        
        //set up svg with axes and labels
        function setupGraph(){
            
            $(".chart-container").empty();
            chart = d3.select(".chart-container").append("svg").attr("class","chart").attr("height", outer_height).attr("width",outer_width).append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
        }
        
        return {updateTopBubbles: updateTopBubbles, updateArrows: updateArrows, setupGraph: setupGraph};
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