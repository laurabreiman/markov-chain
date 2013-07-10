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
        var states_array = [];
        //var initial_state = {0: 1, 1: 0, 2: 0};
        var transition_model = {0: {0: .5, 1: 0.5}, 1: {0: 1/8, 1: 1/2, 2:  3/8}, 2: {1: 1/4, 2:  3/4}};
        var observation_model = {0: {red: 0, white: 1}, 1: {red: 1/2, white: 1/2}, 2:  {red: 1,white: 0}};
        var current_state = {0: 1, 1: 0, 2: 0};
        //var previous_state = {0: 1, 1: 0, 2: 0};

        // /*
        // function that takes in the number of red blocks, and changes the initial
        // probability distribution accordingly.
        // */
        // function set_num_red(num_red){
        //     var n = Object.getOwnPropertyNames(current_state).length;
        //     if (num_red > n-1){throw new Error("num_red exceeds number of lego blocks");}
        //     initial_state = {};
        //     for (var i = 0; i < n; i++){
        //          initial_state[i] = 0;
        //     }
        //     initial_state[num_red] = 1;
        //     current_state = initial_state;
        //     console.log(initial_state);
        // }

        /*
        function that takes in an array of [number of red blocks, number of white blocks]
        and changes the initial probability, transition and observation models accordingly.
        */
        function set_num_blocks(array) {
            var total_blocks = parseInt(array[0])+parseInt(array[1]);

            //change initial_state
            current_state = {};
            for (var i = 0; i <= total_blocks; i++){
                current_state[i] = 0;    //each state set to be equally likely
            }
            current_state[array[0]] = 1;
            //console.log('intial state', initial_state);

            //change transition_model
            // for (var i in transition_model){
            //     delete transition_model[i];//delete all
            // }
            transition_model={};
            //special cases: state 0 and n-1
            transition_model[0] = {0: 0.5, 1: 0.5};
            console.log('trans for',0,"=",transition_model[0]); 
                       
            transition_model[total_blocks] = {};
            transition_model[total_blocks][total_blocks] = 0.5;
            transition_model[total_blocks][total_blocks-1]= 0.5;

            for (var i = 1; i < total_blocks; i++){
                var assocArray = {};
                assocArray[i-1] = i/(total_blocks)*0.5;
                assocArray[i] = 0.5;
                assocArray[i+1] = 0.5-i/(total_blocks)*0.5;
                transition_model[i] = assocArray;
                console.log('trans for',i,'=', assocArray);
            }
            console.log('trans for',total_blocks,"=",transition_model[total_blocks]);

            //change observation_model
            // for (var i in observation_model){
            //     delete observation_model[i];
            // }
            observation_model = {};
            for (var i = 0; i <= total_blocks; i++){
                observation_model[i] = {red: i/(total_blocks), white: 1-i/(total_blocks)};
                //console.log('obs for',i,'=', observation_model[i]);
            }
        }




        // function set_initial_state(array){
        //     var sum = 0;
        //     $.each(array,function() {
        //         sum += this;
        //     });
        //     if (sum != 1){throw new Error("the sum should be 1.");} //throw an error if the sum isn't 1.
        //     else {
        //         //set_num_states(array.length);
        //         for (var i = 0; i < array.length; i++){
        //         initial_state[i] = array[i];
        //         }
        //     }
        //     current_state = initial_state;
        //     console.log(initial_state);
        // }

        // /*
        // function that takes in the number of states(=number of blocks +1)
        // and changes the initial probability, transition and observation models accordingly.
        // */
        // function set_num_states(num_states){
        //     //change initial_state
        //     initial_state = {};
        //     for (var i = 0; i < num_states; i++){
        //         initial_state[i] = 1/num_states;    //each state set to be equally likely
        //     }
        //     console.log('intial state', initial_state);
        //     current_state = initial_state;

        //     //change transition_model
        //     for (var i in transition_model){
        //         delete transition_model[i];
        //     }
        //     //special cases: state 0 and n-1
        //     transition_model[0] = {0: 0.5, 1: 0.5};
        //     console.log('trans for',0,"=",transition_model[0]); 
                       
        //     transition_model[num_states-1] = {};
        //     transition_model[num_states-1][num_states-2] = 0.5;
        //     transition_model[num_states-1][num_states-1]= 0.5;

        //     for (var i = 1; i < num_states-1; i++){
        //         var assocArray = {};
        //         assocArray[i-1] = i/(num_states-1)*0.5;
        //         assocArray[i] = 0.5;
        //         assocArray[i+1] = 0.5-i/(num_states-1)*0.5;
        //         transition_model[i] = assocArray;
        //         console.log('trans for',i,'=', assocArray);
        //     }
        //     console.log('trans for',num_states-1,"=",transition_model[num_states-1]);

        //     //change observation_model
        //     for (var i in observation_model){
        //         delete observation_model[i];
        //     }
        //     for (var i = 0; i < num_states; i++){
        //         observation_model[i] = {red: i/(num_states-1), white: 1-i/(num_states-1)};
        //         //console.log('obs for',i,'=', observation_model[i]);
        //     }

        // }

        /*
        function that returns "red" or "white" depending on the current prob distribution.
        */
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

        /*
        function that returns probability of Obs=o given State=s as an assoc array of assoc arrays.
        prob_OgS()[o][s] will return the desired probability.
        */
        function prob_OgS(){
            var n = Object.getOwnPropertyNames(current_state).length;
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

        /*Returns probability of Obs=o & State=s as an assoc array of assoc arrays.
        prob_OnS()[o][s] will return the desired probability.
        */
        function prob_OnS(){
            var n = Object.getOwnPropertyNames(current_state).length
            var assocArray = {};
            var r = {}; var w = {};
            for (var i = 0; i < n; i++){
                r[i] = transition(false)[i]*prob_OgS()["red"][i];
            }
            for (var i = 0; i < n; i++){
                w[i] = transition(false)[i]*prob_OgS()["white"][i];
            }
            assocArray["red"] = r; assocArray["white"] = w;
            return assocArray;
        }
        
        /*
        function that transitions the current prob dist.
        if updateCurrent is true, then updates the current state,
        if false, then just return the next state while keeping the current state the same.
        */
        function transition(updateCurrent){
            var next_state = {};
            
            for(var i in current_state){
                next_state[i] = 0;
            }
            
            for(var i in current_state){
                for(var j in transition_model[i]){
                    next_state[i] += current_state[j]*transition_model[j][i]
                    //console.log(i,j,'=',current_state[j],'*',transition_model[j][i]);
                }
            }

            if (updateCurrent){current_state = next_state;}
            else {return next_state;}
        }

        /*
        function that makes an observation.
        if updateCurrent is true, then updates the current state,
        if false, then just return the next prob dist depending on the obs while keeping the current state the same.
        */
        function observe(obs, updateCurrent){            
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
            
            if (updateCurrent){current_state = next_state;}
            else {return next_state;}           
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
        
        function get_transition_model(){
            return transition_model;
        }
        
        return {transition: transition, observe: observe, 
            get_current_state: get_current_state, get_current_state_array: get_current_state_array, get_transition_model: get_transition_model,
            set_num_blocks: set_num_blocks, 
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
            var correctAns = model.transition(false);
            console.log(model.transition(false));
            var result = [];
            var allCorrect = 1;
            for (var i = 0; i < answers.length; i++){
                if (round_number(answers[i],3) == round_number(correctAns[i],3)){
                    result[i] = "right";                 
                }
                else {result[i] = "wrong"; allCorrect = 0;}
            }
            result[answers.length] = allCorrect;
            return result;
        }
        /*
        function that takes in an array of probabilites and an observation("red" or "white")
        returns an array like ["right","wrong","wrong"...0] based on the probability of Obs=obs | state=s 
        with the last entry a flag of whether it was all right (1) or not (0)
        */
        function checkOgS(answers, obs){
            var result = [];
            var correctAns = model.prob_OgS()[obs];
            var allCorrect = 1;
            for (var i = 0; i < answers.length; i++){
                if (round_number(answers[i],3) == round_number(correctAns[i],3)){
                    result[i] = "right";                 
                }
                else {result[i] = "wrong"; allCorrect = 0;}
            }
            result[answers.length] = allCorrect;
            return result;
        }

        /*
        function that takes in an array of probabilites and an observation string
        returns an array like ["right","wrong","wrong"...0] based on the probability of Obs=obs & state=s
        with the last entry a flag of whether it was all right (1) or not (0)
        */
        function checkOnS(answers, obs){
            var result = [];
            var correctAns = model.prob_OnS()[obs];
            var allCorrect = 1;
            for (var i = 0; i < answers.length; i++){
                if (answers[i].toFixed(3) == correctAns[i].toFixed(3)){
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
        
        div.append("<div class = 'hero-unit'><h2><small>Illustration of Markov Chain:</small> Lego Game</h2>"
            +"<p>Two <span class='muted'>white</span> lego bricks are put into a bag. A transition and an observation happens every round."
            +"<br>1. A random brick is removed from the bag, and a replacement brick that is equally likely to be"
            +" <span class='text-error'>red</span> or <span class='muted'>white</span> is added to the bag."
            +" <br>2. Then you pull one brick from the bag, observe color, and replace.</p>"
            +"<p class='text-info'><small>Fill in the blank with appropriate probabilities."
            +" You may change number of blocks on the right column and start over.</small></p></div>"
            +"<div class = 'container-fluid well'><div class = 'row-fluid'><div class ='span2'><div class='side-labels'></div></div><div class = 'span8'><div class = 'chart-container'></div></div><div class = 'span2'><div class = 'controls'></div></div></div></div>");
    
        $(".controls").append("<div class = 'container-fluid'><div class ='row-fluid'><button class='btn btn-small transition'>Transition</button></div><div class ='row-fluid'><input class='num-states num-whites' placeholder = '# of whites'><input class='num-states num-reds' placeholder = '# of reds'><button class='btn btn-small new-chain'>New</button></div></div>");
        $(".span8").append("<div class = 'row-fluid'><div class = 'input-row'></div></div>");
        
        $(".transition").on("click",transition);
        $(".new-chain").on("click",newChain);
        
        var chart;
        
        var outer_height = 400;
        var outer_width = parseInt($(".span8").css("width"));
    
        var margin = { top: 30, right: 20, bottom: 20, left: 20 }
        var chart_width = outer_width - margin.left - margin.right;
        var chart_height = outer_height -margin.top - margin.bottom;
        
        setupGraph();
        updateDisplay();
        setupSideLabels();

        function transition(){
            model.transition(true);
            transitionTop();
            //transitionBottom();
        }

        function newChain(){

            if(isNaN($(".num-whites").val()) || $(".num-whites").val() < 0 || isNaN($(".num-reds").val()) || $(".num-reds").val() < 0){
                alert("Please enter a valid number");
            }
            
            else{
                var states = [parseInt($(".num-reds").val()),parseInt($(".num-whites").val())];
                model.set_num_blocks(states);
                updateDisplay();
            }
        }
        
        function setupSideLabels(){
            $('.side-labels').append("<div class='num-label'># of reds in bag</div>");
            $('.side-labels').append("<div class='first-prob'>P(S<sub>1</sub>=s)</div>");
            $('.side-labels').append("<div class='num2-label'># of reds in bag</div>");
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
            updateBottomBubbles();
            updateFirstInputRow();
        }
        
        function updateTopBubbles(){
            chart.selectAll(".top_bubble").remove();
            
            var points = model.get_current_state_array();
            
            var bubbles = chart.selectAll(".top_bubble").data(points).enter().append("circle")
                .attr("class", "top_bubble")
                .attr("cx", function(d,i){return (chart_width)*(i/(points.length-1))})
                .attr("cy", 0)
                .attr("r", function(d){return d*(chart_height/20)+4})
                .style("fill","blue")
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
        
        function transitionBottom(state){
            var points = state;
            
            chart.selectAll(".bottom_bubble").data(points).transition().duration(500)
                .attr("r", function(d){return d*(chart_height/16)+4})
                .style("fill-opacity",function(d){return d;});
            
            updateBottomLabels();
        }
        
        function updateBottomBubbles(){
            chart.selectAll(".bottom_bubble").remove();
            var pointlength = model.get_current_state_array().length;
            var points = [];
            
            for(var i = 0; i<pointlength; i++){
                points.push(1/pointlength);
            }

            chart.selectAll(".bottom_bubble").data(points).enter().append("circle")
                .attr("class", "bottom_bubble")
                .attr("cx", function(d,i){return chart_width*(i/(points.length-1))})
                .attr("cy", chart_height)
                .attr("r", function(d){return d*(chart_height/16)+4})
                .style("fill","blue")
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
            
            for(var i = 0; i < num_entries; i++){
                $('.input-row').append("<input class='obs-entry' id='"+i+"' placeholder='P("+i+")'>");
                $('.input-row #'+i+'').offset({left: $(".input-row").offset().left + i*(chart_width)/(num_entries-1)});
                $('.obs-entry').css("width",""+(10-num_entries/3)+"%")
            }
            
            $('.input-row').append("<div class='row-fluid check-row'><button class='btn btn-small check'>Check</button></div>");
            
            $('.check').on('click',function(){
                var answers = [];
                
                for(var i=0; i<num_entries; i++){
                    answers.push(parseFloat($('.input-row #'+i+'').val()));
                }

                transitionBottom(answers);
                
                var results = controller.checkAnswers(answers);
                
                $('.icon').remove();
                
                for(var i = 0; i<results.length-1 ; i++){
                    if(results[i] == "right"){
                        $('.input-row #'+i+'').after('<i class="icon icon-ok" id="icon'+i+'"></i>');
                        $("#icon"+i).offset({left: $('.input-row #'+i+'').offset().left + parseInt($('.input-row #'+i+'').css("width"))});
                    }
                    else{
                        $('.input-row #'+i+'').after('<i class="icon icon-remove" id="icon'+i+'"></i>');
                        $("#icon"+i).offset({left: $('.input-row #'+i+'').offset().left + parseInt($('.input-row #'+i+'').css("width"))});
                    }
                }
                
    
                if(results[results.length-1] == 1){
                    $(this).remove();
                    displayNextInputRow();
                }
            });
        }
        
        function displayNextInputRow(){
            $(".span8").append("<div class='row-fluid'><div class ='input-obs-given-row'></div></div>");

            var num_entries = model.get_current_state_array().length;
            
            for(var i = 0; i < num_entries; i++){
                $('.input-row').append("<input class='obs-entry' id='"+i+"' placeholder='P("+i+")'>");
                $('.input-row #'+i+'').offset({left: $(".input-row").offset().left + i*(chart_width)/(num_entries-1)});
                $('.obs-entry').css("width",""+(10-num_entries/3)+"%")
            }
            
            $('.input-row').append("<div class='row-fluid check-row'><button class='btn btn-small check'>Check</button></div>");
            
        }
        
        function updateArrows(){
            chart.selectAll(".arrow").remove();
            chart.selectAll(".diagRight").remove();
            chart.selectAll(".diagLeft").remove();
            
            var points = model.get_current_state_array();
            var numpoints = points.length;
            var transmodel = model.get_transition_model();
            
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

            chart.selectAll(".trans-label").data(transmodel).enter().append("text").attr("class", "trans-label")
                .attr("x", function(d,i){return i*(chart_width/numpoints)})
                .attr("y", chart_height/2)
                .text(function(d) { console.log(d); return d; });
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