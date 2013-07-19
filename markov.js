var markovChain = (function() {
    
    var exports = {};
    
////////////////////////////////// global variables 
    
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
        var states_array = [{0: 1, 1: 0, 2: 0}];
        //var initial_state = {0: 1, 1: 0, 2: 0};
        var transition_model = {0: {0: .5, 1: 0.5}, 1: {0: 1/4, 1: 1/2, 2:  1/4}, 2: {1: 1/2, 2: 1/2}};
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
            states_array = []; states_array.push(current_state);

            //change transition_model
            // for (var i in transition_model){
            //     delete transition_model[i];//delete all
            // }
            transition_model={};
            //special cases: state 0 and n-1
            transition_model[0] = {0: 0.5, 1: 0.5};
                       
            transition_model[total_blocks] = {};
            transition_model[total_blocks][total_blocks] = 0.5;
            transition_model[total_blocks][total_blocks-1]= 0.5;

            for (var i = 1; i < total_blocks; i++){
                var assocArray = {};
                assocArray[i-1] = i/(total_blocks)*0.5;
                assocArray[i] = 0.5;
                assocArray[i+1] = 0.5-i/(total_blocks)*0.5;
                transition_model[i] = assocArray;
            }

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
            for (var i in transition(false)){
                prob_red += transition(false)[i]*i/(n-1);
            }
            var r = Math.random();
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
            var n = Object.getOwnPropertyNames(transition(false)).length
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

            if (updateCurrent){
                current_state = next_state;
                states_array.push(current_state);}
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
            for(var i in transition(false)){
                next_state[i] += transition(false)[i]*observation_model[i][obs]
                total += transition(false)[i]*observation_model[i][obs];
                //console.log(i,current_state[i],observation_model[i][obs]);
            }
            //console.log(total);
            
            for(var i in next_state){
                next_state[i] = next_state[i]/total;
            }
            
            if (updateCurrent){
                current_state = next_state;
                states_array.push(current_state);
            }
            else {return next_state;}           
        }

        function get_states_array(){
            return states_array;
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
            set_num_blocks: set_num_blocks, get_states_array: get_states_array,
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
            var result = []; var sum = 0;
            var allCorrect = 1;
            var error = {errorName:"none",badInputs:[]};//[error name, position that error was found]
            
            for (var i = 0; i < answers.length; i++){
                sum += answers[i];
                if(isNaN(answers[i])){
                    error.errorName = "nonnumber_error";
                    error.badInputs.push(i);
                }
                else if(answers[i] <0){
                    error.errorName = "negative_error";
                    error.badInputs.push(i);
                }
                if (round_number(answers[i],3) == round_number(correctAns[i],3)){
                    result[i] = "right";      
                }
                else {result[i] = "wrong"; allCorrect = 0;}
            }
            result[answers.length] = allCorrect;
            if (sum != 1 && error.errorName=="none"){ error.errorName = "sum_error"; error.badInputs =[]}
//            else {result[answers.length+1] = "sum_correct";}
            
            result[answers.length+1] = error;
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
            var error = ["none",-1];

            for (var i = 0; i < answers.length; i++){
                if(answers[i] <0){
                    error = ["negative_error",i];
                }
                if(answers[i] >1){
                    error = ["greater_error",i];
                }
                if (round_number(answers[i],3) == round_number(correctAns[i],3)){
                    result[i] = "right";                 
                }
                else {result[i] = "wrong"; allCorrect = 0;}
            }
            result[answers.length] = allCorrect;
            result[answers.length+1] = error;
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
            var error = ["",-1];
            
            for (var i = 0; i < answers.length; i++){
                if(answers[i]<0){
                    error = ["negative_error",i];
                }
                else if(answers[i]>1){
                    error = ["greater_error",i];
                }
                if (answers[i].toFixed(3) == correctAns[i].toFixed(3)){
                    result[i] = "right";                 
                }
                else {result[i] = "wrong"; allCorrect = 0;}
            }
            result[answers.length] = allCorrect;
            result[answers.length+1] = error;
           return result;
        }
        
        /*
        function that takes in an array of probabilites and an observation string
        returns an array like ["right","wrong","wrong"...0] based on the probability of Obs=obs & state=s
        with the last entry a flag of whether it was all right (1) or not (0)
        */
        function checkObs(answers, obs){
            var result = []; var sum = 0;
            var correctAns = model.observe(obs,false);
            var allCorrect = 1;
            var error = ["",-1];
            
            for (var i = 0; i < answers.length; i++){
                sum += answers[i];
                if(answers[i] < 0){
                    error = ["negative_error",i];
                }
                if (answers[i].toFixed(3) == correctAns[i].toFixed(3)){
                    result[i] = "right";                 
                }
                else {result[i] = "wrong"; allCorrect = 0;}
            }
            result[answers.length] = allCorrect;
            if (sum != 1){error[0] = "sum_error";}
            result[answers.length+1] = error;
            return result;
        }
        
        return {checkAnswers: checkAnswers, checkOgS: checkOgS, checkOnS: checkOnS, checkObs: checkObs};

    }
    
    function View(div, model, controller){
        
        div.append("<div class = 'container-fluid well'>"
            +   "<div class = 'row-fluid'>"
            +       "<div class ='span2'>"
            +           "<div class='side-labels'></div>"
            +       "</div>"
            +       "<div class = 'span7'>"
            +           "<div class = 'chart-container chart0'></div>"
            +      "<div class = 'row-fluid continue-row'><button class='btn btn-large arrow-transition'>See The Transition Model</button></div>"
            +       "</div>"
            +       "<div class = 'span3 bs-docs-sidebar'>"
            +           "<div class ='nav bs-docs-sidenav affix'>"
            +               "<div class = 'container-fluid'>"
            +               "<div class = 'row-fluid'>"
            +                   "<div class = 'controls'></div>"
            +               "</div>"    
            +               "<div class = 'row-fluid controls2'></div>"
            +               "<div align='center' class = 'image-container'><img src='bag.png'></div>"
            +               "<div class = 'row-fluid start-row'>"
            +               "</div>"           
            +               "<div class = 'graph-container'></div>"
            +               "</div>"
            +           "</div>"
            +       "</div>"
            +   "</div>"
            // +   "<div class ='row-fluid'>"
            // +       "<div class = 'graph-container'></div>"
            // +   "</div>"
            +"</div>");

        $(".controls").append("# of Whites: <input class='num-states num-whites' value='2'># of Reds: <input class='num-states num-reds' value='0'><button class='btn btn-small new-chain'>New</button></div></div>");
        $(".controls2").append("<div class='container-fluid'><div class = 'btn-group'><a href='#bottom'><button class='btn btn-small next-state'>Next State</button></a><button class='btn btn-small previous-state'>Previous State</button></div></div>")
        
        $(".new-chain").on("click",newChain);
        
        $('.next-state').attr("disabled", true);
        $('.previous-state').attr("disabled", true);
        
        var chart = [];

        var outer_height = 300;
        var outer_width = parseInt($(".span7").css("width"));
    
        var margin = { top: 30, right: 20, bottom: 20, left: 20 }
        var chart_width = outer_width - margin.left - margin.right;
        var chart_height = outer_height -margin.top - margin.bottom;

        var graph_container_width = parseInt($(".span3").css("width"))        
        var graph_container_height = 160;

        var graph_margin = { top: 30, right: 20, bottom: 35, left: 20 }
        var graph_width = graph_container_width - graph_margin.left - graph_margin.right;
        var graph_height = graph_container_height - graph_margin.top - graph_margin.bottom;

        var x_scale = d3.scale.linear().domain([0,10]).range([0,graph_width]);
        var y_scale = d3.scale.linear().domain([0,1]).range([graph_height,0]);
        var color_scale = d3.scale.category10();

        var graph;
        var state = 0;
        
        startDisplay([2,0]);

        function transition(){
            model.transition(true);
            transitionTop();
            $(".graph-container").css("visibility","visible");
            updateGraph();
            state++;
            updateArrows();
            updateArrowTextbox();
            setupUnknownBlocks();
            animateTransitionBlocks();
            if($(".first-transition").length >0 || $(".input-obs-given-row").length>0){
                $('.input-row').remove();
                updateFirstInputRow();
                updateBottomBubbles();
            }
            setupSideLabels();
        }

        function newChain(){

            if(isNaN($(".num-whites").val()) || $(".num-whites").val() < 0 || isNaN($(".num-reds").val()) || $(".num-reds").val() < 0){
                alert("Please enter a valid number");
            }
            
            else{
                var states = [parseInt($(".num-reds").val()),parseInt($(".num-whites").val())];
                model.set_num_blocks(states);
                
                startDisplay([parseInt($(".num-whites").val()),parseInt($(".num-reds").val())]);
            }
        }
        
        function firstupdate(current_state){
            updateArrows(current_state);
            updateBottomBubbles(current_state);
            // updateFirstInputRow();
            setupSideLabels(current_state);
            updateGraph();
        }
        
        function setupSideLabels(current_state){
            $('.side-labels').append("<label class='num-label"+state+"'>States at<br><strong>Time = "+state+"</strong></label>");
            $('.side-labels').append("<label class='first-prob"+state+"'>P(S<sub>"+state+"</sub>=s)</label>");
            $('.num-label'+current_state).offset({top: $(".top_bubble"+current_state).offset().top});
            $('.first-prob'+current_state).offset({top: $(".bubble-label"+current_state).offset().top});
            
            if($('.bottom-bubble'+current_state).length >0){
                $('.side-labels').append("<label class='num2-label"+state+"'>States at<br><strong>Time = "+(state+1)+"</strong></label>");
                // $('.side-labels').append("<label class='second-prob'>P(S<sub>"+(state+1)+"</sub>=s)</label>");
                $('.num2-label'+current_state).offset({top: $(".bottom-bubble"+current_state).offset().top});       
                // $('.second-prob').offset({top: $(".input-row").offset().top});
            }
            //$('.input-row #'+i+'').offset({left: $(".input-row").offset().left + i*(chart_width)/(num_entries-1)});
        }
        
        /*
            function that starts the display
        */
        function startDisplay(whites_reds){
            cleardisplay();
            state = 0;
            $(".span7").prepend("<div class='chart-container chart"+state+"'></div>");
            setupGraph(state);
            updateTopBubbles(state);
            setupSideLabels(state);
            setupKnownBlocks(whites_reds);
            updateGraph();
            $('.start-row').append("<button class='btn btn-large btn-primary first-transition'>Start</button>");
            
            if($(".continue-row").length ==0){
                $(".span7").append("<div class='row-fluid continue-row'><button class='arrow-transition btn btn-large'>See Transition Model</button></div>");
            }
            
            $(".first-transition").on("click", function(){
                    $(this).remove()//css("visibility","hidden");
                    $(".start-row").append("<p class='help-text'>A random block was removed, and a random block was put in</p>");
                    animateTransitionBlocks();
                    window.setTimeout(function(){
                            $(".arrow-transition").css("visibility","visible")
                            $('.arrow-transition').on("click", function(){
                                $(this).closest('.row-fluid').remove();
                                $('.num-label'+state).remove(); $('.first-prob'+state).remove() //to prevent duplicate
                                firstupdate(state);
                                
                                var firstDiv = $("<div hidden class=firstDiv>The numbers next to the arrows<br>represent the transition model<br>from time 0 to time 1.<br></div>");
                                $('.markov').append(firstDiv);
                                var firstDivBtn = $("<button hidden class='btn btn-small firstDivBtn'>OK</button>");
                                firstDiv.append(firstDivBtn);
                                $('.firstDivBtn').on("click", function(){
                                    firstDiv.html("Using the transition model,<br>you can figure out the prob distribution of each state in the next time step.<br>");
                                    firstDiv.append(firstDivBtn);
                                    $('.firstDivBtn').on("click", function(){
                                        firstDiv.remove();
                                        updateFirstInputRow();
                                    });
                                });
                                firstDiv.fadeIn('slow');
                            })
                    }, 2000)

//                    setTimeout(firstupdate, 2000);
                            
            })
        }
        
        /*
            function that updates the top blocks of the current svg
        */
        function updateTopBubbles(current_state){
            var this_chart = chart[current_state]
            
            //clear the past blocks from the svg
            this_chart.selectAll(".top-node"+current_state).remove();
            this_chart.selectAll(".top_bubble"+current_state).remove();
            
            //append a light gray rectangle that groups the possible states together
            this_chart.append("rect")
                .attr("class","grouping-rect")
                .attr("x",-1*margin.left)
                .attr("y",-0.5*margin.top)
                .attr("width",chart_width+margin.left+margin.right)
                .attr("height",margin.top+chart_height/12+10)
                .attr("fill","#e4e4e4")
                .attr("rx",40);

            //setup the data needed to draw the blocks
            var points = model.get_current_state_array();
            var pointdict = model.get_current_state();
            var newpoints =[];
            var numpoints = points.length;
            
            for(var i in pointdict){
                newpoints.push([i,points[i]])
            }
            
            //create nodes for each possible state of the bag
            var node = this_chart.selectAll(".top-node"+current_state)
                  .data(newpoints)
                .enter().append("g")
                  .attr("class", "top-node"+current_state)
                .attr("y", function(d,i,j) {return chart_height/20; })
                .on("mouseover", function(d,i){
                        var index = i;
                        $(".line"+index).attr("class", "selected-line line"+index);
                        $("path.line-graph").attr("id", "faded-line")
                        $(".arrow"+current_state).attr("id", "faded-arrow")
                        $(".arrow"+current_state+".this-arrow"+index).attr("id", "selected-arrow");
                        $("[id=faded-arrow]").attr("marker-end","");
                    })
                .on("mouseout", function(d,i){
                        $(".selected-line").attr("class", "line-graph line"+i);
                        $("#selected-arrow").attr("id","");
                        $("[id=faded-arrow]").attr("id","")
                        $("[id=faded-line]").attr("id","")
                        $(".arrow"+current_state).attr("marker-end","url(#arrowhead)")
                    });
            
            //appends blocks to the nodes
            for(var a =0; a < numpoints-1; a++){
                node.append("rect")
                    .attr("class", "top_bubble"+current_state)
                    .attr("x", function(d,i){return -8+(chart_width)*(i/(points.length-1))+a*((d[1]*(chart_height/12)+10)/(numpoints-1))})
                    .attr("width", function(d){return (d[1]*(chart_height/12)+10)/(numpoints-1)})
                    .attr("height", function(d){return d[1]*(chart_height/12)+10})
                    .style("fill",function(d,i){if(a<i){return "red"} else {return "white"}})
                    .style("stroke","black")
                    //.attr("y", function(d,i,j) {return chart_height/100; })
                    //.style("fill-opacity",function(d){return d[1];});
            }
            
            updateTopLabels(current_state);
        }
        
        //clears the past markov chain and visualizations from the display
        function cleardisplay(){
            $('.textbox-row').closest('.row-fluid').remove();
            $(".firstDiv").remove();
            $('.side-labels').empty();
            $(".start-row").empty();
            $(".chart-container").remove();
            $(".continue-row").remove();
            chart = [];
        }
            
        /*
            function that resizes the bottom blocks based on the inputted probabilities from the user
        */
        function transitionBottom(current_state, blocks_state){
            var points = blocks_state;
            var numpoints = points.length;
            var newstate = [];
            
            for(var i=0; i<numpoints; i++){
                for(var j=0; j<numpoints-1; j++){
                    newstate.push(points[i])
                }
            }
            
            chart[current_state].selectAll(".bottom-bubble"+state).data(newstate).transition().duration(500)
                .attr("width", function(d){return (d*(chart_height/12)+10)/(numpoints-1)})
                .attr("height", function(d){return d*(chart_height/12)+10})
                .attr("x", function(d,i){ return -8+(chart_width)*(parseInt(i/(numpoints-1))/(points.length-1))+(i%(numpoints-1))*((d*(chart_height/12)+10)/(numpoints-1))})
        }
        
        /*
            function that moves the display to the next state of calculation
                draws another svg with the next possible lego states
        */
        function nextState(){
            var points = model.get_current_state_array();
            var pointdict = model.get_current_state();
            var numpoints = points.length;
            var newstate = [];
            
            state++;
            updateGraph();
            
            $(".next-state").attr("disabled",false);
            $(".previous-state").attr("disabled",false);
                                    
            $(".span7").append("<a name='bottom'><div class='chart-container chart"+state+"'></div></a>");
            setupGraph(state);
            updateTopBubbles(state);
            setupSideLabels(state);
            $(".span7").append("<div class='row-fluid continue-row'><button class='arrow-transition btn btn-large'>See Transition Model</button></div>");
            $(".arrow-transition").css("visibility","visible");
            $(".arrow-transition").on("click",function(){
                $(this).closest('.row-fluid').remove();
                $('.num-label'+state).remove(); $('.first-prob'+state).remove(); //to remove the duplicate
                firstupdate(state);
                updateFirstInputRow(state);
            })
        }
        
        /*
            function that updates the bottom bubbles of the current svg
        */
        function updateBottomBubbles(current_state){
            var this_chart = chart[current_state]
            
            //removes the current bubbles from the svg
            this_chart.selectAll(".bottom-node"+current_state).remove();
            this_chart.selectAll(".bottom-bubble"+current_state).remove();
            
            //sets up the necessary data
            var pointlength = model.get_current_state_array().length;
            var points = model.get_current_state_array();
            var pointdict = model.get_current_state();
            var newpoints =[];
            var numpoints = points.length;
            
            for(var i in pointdict){
                newpoints.push([i,1/pointlength])
            }
            
            //appends a light gray rectangle that groups the states together
            this_chart.append("rect")
                .attr("class","grouping-rect")
                .attr("x",-1*margin.left)
                .attr("y",10/11*chart_height-0.5*margin.top)
                .attr("width",chart_width+margin.left+margin.right)
                .attr("height",margin.top+chart_height/12+10)
                .attr("fill","#e4e4e4")
                .attr("rx",40);
            
            //creates n nodes, where n is the number of possible states
            var node = this_chart.selectAll(".bottom-node"+current_state)
                  .data(newpoints)
                .enter().append("g")
                  .attr("class", "bottom-node"+current_state)
                .attr("y", (10/11)*chart_height);

            //appends rectangles to the nodes that represents the blocks in each state
            for(var a =0; a < numpoints-1; a++){
                node.append("rect")
                    .attr("class", "bottom-bubble"+current_state)
                    .attr("x", function(d,i){ return -8+(chart_width)*(i/(points.length-1))+a*((d[1]*(chart_height/12)+10)/(numpoints-1))})
                    .attr("y", (10/11)*chart_height)
                    .attr("width", function(d){return (d[1]*(chart_height/12)+10)/(numpoints-1)})
                    .attr("height", function(d){return d[1]*(chart_height/12)+10})
                    .on("mouseover", function(d,i){
                        var index = i;
                        $(".line"+index).attr("class", "selected-line line"+index);
                        $("path.line-graph").attr("id", "faded-line");
                        $('.arrow'+current_state).attr("id","faded-arrow");
                        $('.straight.this-arrow'+index).attr("id","");
                        $('.diagRight.this-arrow'+(index-1)).attr("id","");
                        $('.diagLeft.this-arrow'+(index+1)).attr("id","");
                        $("[id=faded-arrow]").attr("marker-end","");
                    })
                .on("mouseout", function(d,i){
                        $(".selected-line").attr("class", "line-graph line"+i);
                        $("[id=faded-line]").attr("id","");
                        $("[id=faded-arrow]").attr("marker-end","url(#arrowhead)");
                        $("[id=faded-arrow]").attr("id","");
                    })
                    .style("fill",function(d,i){if(a<i){return "red"} else {return "white"}})
                    .style("stroke","black")
                    //.style("fill-opacity",function(d){return d[1];});
            }
        }
        
        /*
            function that updates the probability labels on the top states of the current svg
        */
        function updateTopLabels(current_state){
            
            var points = model.get_current_state_array();
            var names = Object.keys(model.get_current_state());

            chart[current_state].selectAll(".bubble-label"+current_state).remove();
            
            chart[current_state].selectAll(".bubble-label"+current_state).data(points).enter().append("text").attr("class", "bubble-label"+current_state)
                .attr("x",function(d,i){return chart_width*(i/(points.length-1))})
                .attr('y',chart_height/4)
                .attr("dx",-4)
                .attr("text-anchor","middle")
                .text(function(d) { return round_number(d,4); });
        }
        
        /*
            function that displays the first row of calculation:
                label for P(S=state)
                textboxes to input answers
                check button to trigger the controller's checkAnswers function
                allows user to move to the next row of calculation
        */
        function updateFirstInputRow(){
            $('.side-labels').append("<label class='second-prob"+state+"'>P(S<sub>"+(state+1)+"</sub>=s)</label>");
            $('.second-prob'+state).append('<i class="icon icon-question-sign second-prob-icon" rel="tooltip"></i>');
            $(".span7").append("<div class = 'row-fluid'><div class = 'first-row"+state+" textbox-row input-row'></div></div>");
            $('.second-prob'+state).offset({top: $(".first-row"+state).offset().top});

            $('.second-prob-icon').attr("title","= P(S<sub>"+(state+1)+"</sub>=s|S<sub>"+state+"</sub>=0r) \xD7 P(S<sub>"+state+"</sub>=0r)<br>+ P(S<sub>"+(state+1)+"</sub>=s|S<sub>"+state+"</sub>=1r) \xD7 P(S<sub>"+state+"</sub>=1r)<br>+ ...");
            $('.second-prob-icon').tooltip({placement:'bottom', html:true});


            var num_entries = model.get_current_state_array().length;
            
            for(var i = 0; i < num_entries; i++){
                $('.input-row').append("<input class='obs-entry "+i+"' placeholder='P("+i+")' id='"+i+"'>");
                $('.input-row .'+i).offset({left: $(".input-row").offset().left + i*(chart_width)/(num_entries-1)});
                $('.obs-entry').css("width",""+(10-num_entries/3)+"%")
            }

            for(var i=0; i <num_entries; i++){
                // $('.obs-entry.'+i).attr("title","= P(S<sub>"+(state+1)+"</sub>="+i+"r|S<sub>"+state+"</sub>=0r) \xD7 P(S<sub>"+state+"</sub>=0r)<br>+ P(S<sub>"+(state+1)+"</sub>="+i+"r|S<sub>"+state+"</sub>=1r) \xD7 P(S<sub>"+state+"</sub>=1r)<br>+ ...");
                // $('.obs-entry.'+i).tooltip({placement:'right', html:true});
                //$('.obs-entry.'+i).tooltip({title: function() {return "hi";}});

                $('.obs-entry.'+i).focusin(function(){
                    var index = parseInt($(this).attr("id"));
                    $('.arrow'+state).attr("id","faded-arrow");
                    $('.straight.this-arrow'+index).attr("id","");
                    $('.diagRight.this-arrow'+(index-1)).attr("id","");
                    $('.diagLeft.this-arrow'+(index+1)).attr("id","");
                    $("[id=faded-arrow]").attr("marker-end","");
                })
                $('.obs-entry.'+i).focusout(function(){
                    $('.arrow'+state).attr("id","");
                    $('.arrow'+state).attr("marker-end","url(#arrowhead)")
                })
            }
            
            $('.input-row').after("<div class='row-fluid check-row check-row"+state+"'><button class='btn btn-small check'>Check</button></div>");
            model.transition();
            
            $('.check').on('click',function(){
                
                var results = checkView(0,"none");
                var error = results[results.length-1];
                $('.trans_feedback').remove();
                $('.input-row .obs-entry').css("background-color","white");
                
                if(error.errorName == "sum_error"){
                    $('.check-row'+state).append("<div class='trans_feedback'>should sum to 1.</div>");
                }
                else if(error.errorName == "nonnumber_error"){
                    $('.check-row'+state).append("<div class='trans_feedback'>Not valid number.</div>");
                    for(var i=0; i<error.badInputs.length; i++){
                        $('.input-row .obs-entry.'+error.badInputs[i]).css("background-color","pink");
                    }
                }
                else if(error.errorName == "negative_error"){
                    $('.check-row'+state).append("<div class='trans_feedback'>can't have negative numbers.</div>");
                    for(var i=0; i<error.badInputs.length; i++){
                        $('.input-row .obs-entry.'+error.badInputs[i]).css("background-color","pink");
                    }
                }
                            
                if(results[results.length-2] == 1){ //if they're all correct
                    $(this).remove(); $('.trans_feedback').remove();
                    $('.check-row'+state).append("<button class='btn btn-small observation'>Make Observation</button>");
                    
                    $('.observation').on("click",makeObservation);
                }
            });
            $(document).keypress(function(event){

                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode == '13'){
                    $('.check').click();   
                }
            
            });
        }
        
        /*
        displays to the user if they are correct or incorrect, with the parameter indexOfCheck referring to the type of answer it is (which row is being checked - 0: p(s=s), 1: p(o=obs|s=s), 2: p(o=obs,s=s)...)
            adds checkmarks and xs to the correct and incorrect answers
            and returns results, an array like ["right","wrong","right",...,0,{}]
                where the second to last entry is a flag that signals if all answers were right (1) or not (0), and last entry is an associative array of errors (like entering a probability greater than 1) in the input fields
        */
        function checkView(indexOfCheck,observation){
            var answers = [];
            var num_entries = model.get_current_state_array().length;
                
            for(var i=0; i<num_entries; i++){
                var input = $('.input-row .'+i).val();
                answers.push(calculator.evaluate(calculator.parse(input)));
            }

            if(indexOfCheck == 0){
                transitionBottom(state, answers);
                var results = controller.checkAnswers(answers);
            }
            else if(indexOfCheck == 1){
                var results = controller.checkOgS(answers,observation);
            }
            else if(indexOfCheck == 2){
                var results = controller.checkOnS(answers,observation);
            }
            else{// if(indexOfCheck == 3){
                transitionBottom(state, answers);
                var results = controller.checkObs(answers,observation);
            } 
            
            $('.input-row .icon').remove();
            
            for(var i = 0; i<results.length-2 ; i++){
                if(results[i] == "right"){
                    $('.input-row .'+i).after('<i class="icon icon-large icon-ok" id="icon'+i+'"></i>');
                    $(".input-row #icon"+i).offset({left: $('.input-row .'+i).offset().left + parseInt($('.input-row .'+i).css("width"))+5});
                    $('.input-row .'+i).val(answers[i]);
                    $('.input-row .'+i).attr("disabled",true);
                }
                else{
                    $('.input-row .'+i).after('<i class="icon icon-large icon-remove" id="icon'+i+'"></i>');
                    $(".input-row #icon"+i).offset({left: $('.input-row .'+i).offset().left + parseInt($('.input-row .'+i).css("width"))+5});
                }
            }
            return results;
        }
        
        /*
            function that makes an observation and displays the observation to the user through text
            and a visual display of the observed block
            then triggers next row of calculations
        */
        function makeObservation(){
            $('.observation').remove();
            var observation = model.make_obs();
            $(".check-row"+state).after("<div class='row-fluid obs-label obs-label"+state+"'>You observe a <span style='color:"+observation+"'>"+observation+"</span> block!</div>");
            $(".help-text").html("You observe a <span style='color:"+observation+"'>"+observation+"</span> block!");
            observeBlock(observation);
            displayOgSInputRow(observation);
        }
        
        /*
            function that takes in an observation and displays the second row of calculation:
                label for P(O=observation|S=state)
                textboxes to input answers
                check button to trigger the controller's checkOgS function
                allows user to move to the next row of calculation
        */
        function displayOgSInputRow(observation){
            $(".check-row"+state).remove();
            $(".span7").append("<div class='row-fluid'><div class ='textbox-row input-obs-given-row"+state+"'></div></div>");
            
            $('.side-labels').append("<div class='obs-given-p"+state+"'>P(O="+observation+"|S<sub>"+(state+1)+"</sub>=s)</div>");
            $('.obs-given-p'+state).append('<i class="icon icon-question-sign obs-given-p-icon" rel="tooltip"></i>');
            
            $('.obs-given-p-icon').attr("title","= # of "+observation+" blocks<br>\xF7 # of total blocks");
            $('.obs-given-p-icon').tooltip({placement:'bottom', html:true});
            
            var num_entries = model.get_current_state_array().length;
            
            for(var i = 0; i < num_entries; i++){
                $('.input-obs-given-row'+state).append("<input class='obs-entry "+i+"' placeholder='P("+observation+"|"+i+")'>");
                $('.input-obs-given-row'+state+' .'+i+'').offset({left: $(".input-obs-given-row"+state).offset().left + i*(chart_width)/(num_entries-1)});
                $('.obs-entry').css("width",""+(10-num_entries/3)+"%");

                // $('.obs-entry.'+i).attr("title","= # of "+observation+" blocks<br>\xF7 # of total blocks");
                // $('.obs-entry.'+i).tooltip({placement:'right', html:true});
 

            }
            
            $('.obs-given-p'+state).offset({top: $(".input-obs-given-row"+state).offset().top});
            
            $('.input-obs-given-row'+state).after("<div class='row-fluid check-row check-row"+state+"'><button class='btn btn-small check'>Check</button></div>");
            
            $('.input-row').removeClass('input-row');
            $('.input-obs-given-row'+state).addClass('input-row');
            
            $('.check').on('click',function(){
                
                var results = checkView(1,observation);
                $('.trans_feedback').remove();
                $('.input-row .obs-entry').css("background-color","white");
                
                if(results[results.length-1][0] == "greater_error"){
                    $('.check-row'+state).append("<div class='trans_feedback'>can't have probability greater than 1</div>");
                    $('.input-row .obs-entry.'+results[results.length-1][1]).css("background-color","pink");
                }
                else if(results[results.length-1][0] == "negative_error"){
                    $('.check-row'+state).append("<div class='trans_feedback'>can't have negative numbers.</div>");
                    $('.input-row .obs-entry.'+results[results.length-1][1]).css("background-color","pink");
                }
                
                if(results[results.length-2] == 1){ // if they're all correct, move on
                    $(this).remove();
                    displayOnSInputRow(observation);
                }
            });
        }
        
        /*
            function that takes in an observation and displays the third row of calculation:
                label for P(O=observation,S=state)
                textboxes to input answers
                check button to trigger the controller's checkOnS function
                allows user to move to the next row of calculation
        */
        function displayOnSInputRow(observation){
            $(".check-row"+state).remove();
            $(".span7").append("<div class='row-fluid'><div class ='textbox-row input-ons-row"+state+"'></div></div>");
            
            $('.side-labels').append("<div class='ons-label"+state+"'>P(O="+observation+",S<sub>"+(state+1)+"</sub>=s)</div>");
            $('.ons-label'+state).append('<i class="icon icon-question-sign ons-label-icon" rel="tooltip"></i>');

            $('.ons-label-icon').attr("title","= P(S<sub>"+(state+1)+"</sub>=s) \xD7 P(O="+observation+"|S<sub>"+(state+1)+"</sub>=s)");
            $('.ons-label-icon').tooltip({placement:'bottom', html:true});
            
            var num_entries = model.get_current_state_array().length;
            
            for(var i = 0; i < num_entries; i++){
                $('.input-ons-row'+state).append("<input class='obs-entry "+i+"' placeholder='P("+observation+","+i+")'>");
                $('.input-ons-row'+state+' .'+i+'').offset({left: $(".input-ons-row"+state).offset().left + i*(chart_width)/(num_entries-1)});
                $('.obs-entry').css("width",""+(10-num_entries/3)+"%");

                // $('.obs-entry.'+i).attr("title","=  P(O="+observation+"|S<sub>"+(state+1)+"</sub>="+i+"r) \xD7 P(S<sub>"+(state+1)+"</sub>="+i+"r)");
                // $('.obs-entry.'+i).tooltip({placement:'right', html:true});

            }
            
            $('.ons-label'+state).offset({top: $(".input-ons-row"+state).offset().top});
            
            $('.input-ons-row'+state).after("<div class='row-fluid check-row check-row"+state+"'><button class='btn btn-small check'>Check</button></div>");
            
            $('.input-row').removeClass('input-row');
            $('.input-ons-row'+state).addClass('input-row');
            
            $('.check').on('click',function(){
                
                var results = checkView(2,observation);
                $('.obs_feedback').remove();
                $('.input-row .obs-entry').css("background-color","white");
                
                if(results[results.length-1][0] == "greater_error"){
                    $('.check-row'+state).append('<div class="obs_feedback">can\'t have probability greater than 1</div>');
                    $('.input-row .obs-entry.'+results[results.length-1][1]).css("background-color","pink");
                }
                else if(results[results.length-1][0] == "negative_error"){
                    $('.check-row'+state).append('<div class="obs_feedback">can\'t have negative numbers.</div>');
                    $('.input-row .obs-entry.'+results[results.length-1][1]).css("background-color","pink");
                }
                if(results[results.length-2] == 1){
                    $(this).remove();
                    displayNormInputRow(observation);
                }
            });
        }
        
        /*
            function that takes in an observation and displays the last row of calculation:
                label for P(O=observation|S=state)
                textboxes to input answers
                check button to trigger the controller's checkObs function
                allows user to move to the next state of the chain
        */
        function displayNormInputRow(observation){
            $(".check-row"+state).remove();
            $(".span7").append("<div class='row-fluid'><div class ='textbox-row input-norm-row"+state+"'></div></div>");
            
            $('.side-labels').append("<div class='norm-label"+state+"'>P(S<sub>"+(state+1)+"</sub>=s|O="+observation+")</div>");
            $('.norm-label'+state).append('<i class="icon icon-question-sign norm-label-icon" rel="tooltip"></i>');
            $('.norm-label-icon').attr("title","=  P(O="+observation+",S<sub>"+(state+1)+"</sub>=s)<br>\xF7 &Sigma; P(O="+observation+",S<sub>"+(state+1)+"</sub>=state)");
            $('.norm-label-icon').tooltip({placement:'bottom', html:true});
            
            var num_entries = model.get_current_state_array().length;
            
            for(var i = 0; i < num_entries; i++){
                $('.input-norm-row'+state).append("<input class='obs-entry "+i+"' placeholder='P("+i+"|"+observation+")'>");
                $('.input-norm-row'+state+' .'+i+'').offset({left: $(".input-norm-row"+state).offset().left + i*(chart_width)/(num_entries-1)});
                $('.obs-entry').css("width",""+(10-num_entries/3)+"%");

                // $('.obs-entry.'+i).attr("title","=  P(O="+observation+",S<sub>"+(state+1)+"</sub>="+i+"r)<br>\xF7 &Sigma; P(O="+observation+",S<sub>"+(state+1)+"</sub>=state)");
                // $('.obs-entry.'+i).tooltip({placement:'right', html:true});

            }
            
            $('.norm-label'+state).offset({top: $(".input-norm-row"+state).offset().top});
            
            $('.input-norm-row'+state).after("<div class='row-fluid check-row check-row"+state+"'><button class='btn btn-small check'>Check</button></div>");
            
            $('.input-row').removeClass('input-row');
            $('.input-norm-row'+state).addClass('input-row');
            
            $('.check').on('click',function(){
                
                var results = checkView(3,observation);
                $('.obs_feedback').remove();
                $('.input-row .obs-entry').css("background-color","white");
                
                if(results[results.length-1][0] == "sum_error"){
                    $('.check-row'+state).append('<div class="obs_feedback">should sum to 1.</div>');
                }
                else if(results[results.length-1][0] == "negative_error"){
                    $('.check-row'+state).append('<div class="obs_feedback">can\'t have negative numbers.</div>');
                    $('.input-row .obs-entry.'+results[results.length-1][1]).css("background-color","pink");
                }
                if(results[results.length-2] == 1){
                    $(this).html("Next State");
                    $('.obs_feedback').remove();
                    $(this).on("click", function(){
                        $('.input-row').removeClass('input-row');
                        model.observe(observation,true);
                        $(".help-text").html("A random block was removed, and a random block was put in");
                        $(this).closest('.row-fluid').remove();
                        animateTransitionBlocks();
                        setTimeout(nextState,2000);
                    });
                }
            });
        }
        
        /* 
            function that clears all of the transition arrows from the current svg.
        */
        function clearArrows(current_state){
            var this_chart = chart[current_state]
            
            this_chart.selectAll(".arrow"+current_state).remove();
            this_chart.selectAll(".trans-label"+current_state).remove();
            this_chart.selectAll(".diagRight-label"+current_state).remove();
            this_chart.selectAll(".diagLeft-label"+current_state).remove();
        }
        
        /*function that updates the transition arrows between states at time n and states at time n+1. 
            arrows are scaled in width based on the probability of transition times the probability of state n
            arrows are grouped in color based on source state (colors from d3 category10 colors)
            gets the data from the model
            uses svg/d3 elements to draw the arrows and position arrow labels
            called whenever a transition is made
        */
        function updateArrows(current_state){
            var this_chart = chart[current_state]
            
            //clears the svg so that we can draw new arrows
            clearArrows(current_state);
            
            //gets the data from the model about the current states
            var points = model.get_current_state_array();
            var numpoints = points.length;
            var transmodel = [];
            for(var i=0; i< Object.keys(model.get_transition_model()).length ; i++){
                transmodel.push(model.get_transition_model()[i]);
            }
            
            //draws the vertical downwards arrows
            this_chart.selectAll(".arrow"+current_state).data(points).enter().append("line")
                .attr("class", function(d,i){return "straight arrow"+current_state+" this-arrow"+i})
                .attr("x1", function(d,i){return chart_width*(i/(points.length-1))})
                .attr("y1", (2/6)*chart_height)
                .attr("x2", function(d,i){return chart_width*(i/(points.length-1))})
                .attr("y2", (13/16)*chart_height)
                .attr("stroke",function(d,i){return color_scale(i)})
                //.attr("stroke-width",6)
                .style("stroke-width",function(d,i){if(d!=0){return Math.min(20*transmodel[i][i]*d,8)} else{return 1};})
                .style("stroke-linecap","butt")
                .attr("stroke-dasharray", function(d){if(d==0){return "2,2"} else{return "";}})
                .attr("marker-end", "url(#arrowhead)");
            
            //draws the right diagonal arrows
            this_chart.selectAll(".diagRight").data(points).enter().append("line")
                .attr("class", function(d,i){return "diagRight arrow"+current_state+" this-arrow"+i})
                .attr("x1", function(d,i){return chart_width*(i/(points.length-1))})
                .attr("y1", (2/6)*chart_height)
                .attr("x2", function(d,i){if(i!=points.length-1){return chart_width*((i+1)/(points.length-1))}
                                          else{return chart_width*(i/(points.length-1))}})
                .attr("y2", function(d,i){if(i!=points.length-1){ return (13/16)*chart_height}
                                          else{ return (2/6)*chart_height}})
                .attr("marker-end", function(d,i){if(i!=points.length-1){ return "url(#arrowhead)"}
                                          else{ return ""}})
                .attr("stroke",function(d,i){return color_scale(i)})
                .attr("stroke-dasharray", function(d){if(d==0){return "2,2"} else{return "";}})
                .style("stroke-width",function(d,i){if(i!=points.length-1){ if(d!=0 && i!=points.length-1){ return Math.min(15*transmodel[i][i+1]*d,8)};}
                                                    else{return ""}});
            
            //draws the left diagonal arrows
            this_chart.selectAll(".diagLeft").data(points).enter().append("line")
                .attr("class", function(d,i){return "diagLeft arrow"+current_state+" this-arrow"+i})
                .attr("x1", function(d,i){return chart_width*(i/(points.length-1))})
                .attr("y1", (2/6)*chart_height)
                .attr("x2", function(d,i){if(i!=0){return chart_width*((i-1)/(points.length-1))}
                                          else{return chart_width*(i/(points.length-1))}})
                .attr("y2", function(d,i){if(i!=0){ return (13/16)*chart_height}
                                          else{ return (2/6)*chart_height}})
                .attr("marker-end", function(d,i){if(i!=0){ return "url(#arrowhead)"}
                                            else{ return ""}})
                .attr("stroke",function(d,i){return color_scale(i)})
                .attr("stroke-dasharray", function(d){if(d==0){return "2,2"} else{return "";}})
                .style("stroke-width",function(d,i){if(d!=0 && i!=0){return Math.min(15*transmodel[i][i-1]*d,8);} else{ return 1}});
            
//////////////set up labels that show the probability of a transition occuring between states
            //labels on the vertical arrows
            this_chart.selectAll(".trans-label"+current_state).data(transmodel).enter().append("text").attr("class", "trans-label"+current_state)
                .attr("x", function(d,i){ return i*(chart_width/(numpoints-1))})
                .attr('dx',"-0.32em")
                .attr("y", (29/64)*chart_height)
                .attr("text-anchor","end")
                .attr("fill",function(d,i){return color_scale(i)})
                .text(function(d,i) {  return round_number(d[i],3); });
            
            //labels on the diagonal right arrows
            this_chart.selectAll(".diagRight-label"+current_state).data(transmodel).enter().append("text").attr("class", "diagRight-label"+current_state)
                .attr("x", function(d,i){return (i+1/4)*(chart_width/(numpoints-1))})
                .attr('dx',2/numpoints+"em")
                .attr("y", (29/64)*chart_height)
                //.attr("text-anchor","end")
                .attr("fill",function(d,i){return color_scale(i)})//"#97C30A")
                .text(function(d,i) {if (!isNaN(d[i+1])) {return round_number(d[i+1],3); }});
            
            //labels on the diagonal left arrows
            this_chart.selectAll(".diagLeft-label"+current_state).data(transmodel).enter().append("text").attr("class", "diagLeft-label"+current_state)
                .attr("x", function(d,i){return (i-1/4)*(chart_width/(numpoints-1))})
                .attr('dx',-2/numpoints+"em")
                .attr("y", (29/64)*chart_height)
                .attr("text-anchor","end")
                .attr("fill",function(d,i){return color_scale(i)})//"#FF717E")
                .text(function(d,i) {
                    if (!isNaN(d[i-1])) {return round_number(d[i-1],3); }});
            
        }

        function updateArrowTextbox(){
            // var points = model.get_current_state_array();
            // var numpoints = points.length;
            // var transmodel = [];
            // for(var i=0; i< Object.keys(model.get_transition_model()).length ; i++){
            //     transmodel.push(model.get_transition_model()[i]);
            // }
            // console.log(transmodel);

            // var left = $('.chart').position().left;
            // var top = $('.chart').position().top;
            // console.log(left,top);
            // for(var i=0; i<transmodel.length; i++){
            //     $('.chart-container').append("<input class='trans-textbox' placeholder='haha'>");
            //     $('.trans-textbox').css("position", "absolute")
            //                         .css("top", top+(29/64)*chart_height+16)
            //                         .css("left",function(i){ return left-16+i*(chart_width/(numpoints-1))});
            //     $('.chart-container').append("<input class='diagRight-textbox' placeholder='haha'>");
            //     $('.diagRight-textbox').css("position", "absolute")
            //                         .css("top", top+(29/64)*chart_height+16)
            //                         .css("left",function(i){ return left+32/numpoints+16+(i+1/4)*(chart_width/(numpoints-1))});
            // }
        }
        
        /*sets up a bag visualization with the model's current amount of blocks
        all blocks are unknown color, so they are set up as gray with ?s */
        function setupUnknownBlocks(){
            $(".block").remove();
            var numblocks = model.get_current_state_array().length -1;
            
            $("img").css("height", numblocks*15+75);
            
            for(var i=0; i<numblocks; i++){
                $(".image-container").append("<div class='block gray-block block"+i+"'>?</div>");
                $(".block"+i).css("top",""+(15*i+parseInt($("img").css("height"))/2)+"px");
            }
            
        }
        
        /*sets up a bag visualization with a known distribution of blocks
        parameter whites_reds is an array of [white blocks, red blocks] to be displayed*/
        function setupKnownBlocks(whites_reds){
            $(".block").remove();
            var numblocks = model.get_current_state_array().length -1;
            
            $("img").css("height", numblocks*15+75);
            
            for(var i=0; i<whites_reds[0]; i++){
                $(".image-container").append("<div class='block white-block block"+i+"'></div>");
                $(".block"+i).css("top",""+(15*i+ parseInt($("img").css("height"))/2)+"px");
            }
            for(var i=whites_reds[0]; i<whites_reds[0]+whites_reds[1]; i++){
                $(".image-container").append("<div class='block red-block block"+i+"'></div>");
                $(".block"+i).css("top",""+(15*i+parseInt($("img").css("height"))/2)+"px");
            }
        }
        
        /* animates a block being removed from the bag and observed,
        parameter 'observation' is the color of the block that is observed */
        function observeBlock(observation){
            setupUnknownBlocks();
            $('.block0').animate({top:-5},"slow");
            $('.block0').removeClass("gray-block");
            $('.block0').addClass(observation+"-block");
            $('.block0').animate({top:parseInt($("img").css("height"))/2},"slow");
            $('.block0').html("");
        }
        
        //animates one block being removed from the bag and one block being put in the bag
        function animateTransitionBlocks(){
            
            //if there are both red and white blocks in the bag
            if($('.block').hasClass("red-block") && $('.block').hasClass('white-block')){
                setupUnknownBlocks();
                $('.block0').animate({top:-5},"fast");
                $('.block0').animate({left:300},"slow");
                $('.block0').animate({left:137},"slow");
                $('.block0').animate({top:parseInt($("img").css("height"))/2},"fast")
            }
            
            //if both blocks are the same color
            else{                
                $('.block0').html("?")
                $('.block0').attr("class","block0 block gray-block");
                $('.block0').animate({top:-5},"fast");
                $('.block0').animate({left:300},"slow");
                $('.block0').animate({left:137},"slow");
                $('.block0').animate({top:50},"fast")
            }

        }
        
        //sets up svg with axes and labels to display the states and their transition arrows
        function setupGraph(current_state){
            
            $(".chart-container.chart"+current_state).empty();            
            var this_chart = d3.select(".chart-container.chart"+current_state).append("svg")
                .attr("class","chart"+current_state)
                .attr("height", outer_height)
                .attr("width",outer_width)
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")")

            chart.push(this_chart);
                
            //draws an arrowhead 
            chart[current_state].append("defs").append("marker")
                    .attr("id", "arrowhead")
                    .attr("refX", 6) 
                    .attr("refY", 2)
                    .attr("markerWidth", 10)
                    .attr("markerHeight", 6)
                    .attr("orient", "auto")
                    .attr("stroke","inherit")
                    .append("path")
                        .attr("d", "M 0,0 V 4 L6,2 Z");
        }
        
        //sets up the line graph of the transitions on the sidebar
        function setupProbVsTime(){
            $(".graph-container").empty();
            graph = d3.select(".graph-container").append("svg")
                .attr("class","graph").attr("height", graph_container_height)
                .attr("width",parseInt(graph_container_width)).append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");

            graph.selectAll(".y-line").data(y_scale.ticks(1)).enter().append("line")
                .attr("class", "y-line")
                .attr('x1', 0)
                .attr('x2', graph_width)
                .attr('y1', y_scale)
                .attr('y2',y_scale);
            
            graph.selectAll(".x-line").data(x_scale.ticks(1)).enter().append("line")
                .attr("class", "x-line").attr('x1', x_scale)
                .attr('x2', x_scale).attr('y1', 0)
                .attr('y2',graph_height);

            graph.append("rect")
                .attr("x",0)
                .attr("y",0)
                .attr("width",graph_width)
                .attr("height",graph_height)
                .attr("fill","#e4e4e4");
            
            graph.selectAll(".y-scale-label").data(y_scale.ticks(6)).enter().append("text")
                .attr("class", "y-scale-label")
                .attr("x",x_scale(0))
                .attr('y',y_scale)
                .attr("text-anchor","end")
                .attr("dy","0.3em")
                .attr("dx","-0.1em")
                .text(String);
            
            graph.append("text")
                .attr("class", "time-label")
                .attr("x",graph_width/2)
                .attr('y',y_scale(0))
                .attr("text-anchor","middle")
                .attr("dy","2em")
                //.attr("dx","-0.1em")
                .text("Time");
        }
        
        //updates the line graph on the side that shows the transitions between states
        function updateGraph(){
            $(".graph").empty();
            setupProbVsTime();
            var data_array = model.get_states_array();
            //var data_array = [{0:1,1:0,2:0},{0:0.5,1:0.5,2:0},{0:3/8,1:0.5,2:1/8}];
            var restructured_data = [];
            for (var i = 0; i < Object.keys(data_array[0]).length; i++) {
                var inner_array = [];
                for (var j = 0; j < data_array.length; j++) {
                    inner_array.push({"px":j,"py":data_array[j][i],"color_id":i});
                }
                restructured_data.push(inner_array);
            }

            var x_new_scale = d3.scale.linear().domain([0,Object.keys(restructured_data[0]).length-1]).range([0,graph_width]);

            if (Object.keys(restructured_data[0]).length <= 15) {
                graph.selectAll(".x-scale-label").data(x_new_scale.ticks(Object.keys(restructured_data[0]).length-1)).enter().append("text")
                    .attr("class", "x-scale-label")
                    .attr("x",x_new_scale)
                    .attr('y',y_scale(0))
                    .attr("text-anchor","middle")
                    .attr("dy","0.9em")
                    //.attr("dx","-0.1em")
                    .text(String);
            }
            else {
                graph.selectAll(".x-scale-label").data([0,Object.keys(restructured_data[0]).length-1]).enter().append("text")
                    .attr("class", "x-scale-label")
                    .attr("x",x_new_scale)
                    .attr('y',y_scale(0))
                    .attr("text-anchor","middle")
                    .attr("dy","0.9em")
                    //.attr("dx","-0.1em")
                    .text(String);                
            }

            var line = d3.svg.line()
                .x(function(d){
                    //console.log("this",d,d.px,x_scale(d.px));
                    return x_new_scale(d.px);
                })
                .y(function(d){
                    //console.log("this",d,d.y,y_scale(d.y));
                    return y_scale(d.py);
                });

            //     graph.append("path")
            //         .attr("class","line-graph")
            //         .attr("d",line(restructured_data[0]))
            //         .attr("stroke-width",3)  
            //         .attr("fill","none")
            //         .attr("stroke", "black");
            //     graph.append("path")
            //         .attr("class","line-graph")
            //         .attr("d",line(restructured_data[0]))
            //         .attr("stroke-width",2)  
            //         .attr("fill","none")
            //         .attr("stroke", color_scale(0));
            // for (var i = 1; i < restructured_data.length; i++){
            //     graph.append("path")
            //         .attr("class","line-graph")
            //         .attr("d",line(restructured_data[i]))
            //         .attr("stroke-width",3)  
            //         .attr("fill","none")
            //         .attr("stroke", color_scale(i));
            // }

            for (var i = 0; i < restructured_data.length; i++){
                graph.append("path")
                    .attr("class","line-graph line"+i)
                    .attr("d",line(restructured_data[i]))
                    .attr("stroke-width",3)  
                    .attr("fill","none")
                    .attr("stroke", color_scale(i));
            }

            // graph.selectAll(".line").data(restructured_data[1]).enter().append("path")
            //     .attr("class","line")
            //     .attr("d",line(restructured_data[1]))
            //     //.attr("stroke","black")
            //     .style("stroke", function(d){return color(d.color_id);})
            //     .attr("stroke-width",3)
            //     .attr("fill","none");

            // var first_line = graph.selectAll(".prob-line").data([data1]).enter().append("path");
            // first_line.attr("d", d3.svg.line().x(function(d){console.log("this",d,d.x,x_scale(d.x));return x_scale(d.x);}).y(function(d){console.log("this",d,d.y,y_scale(d.y));return y_scale(d.y);}));
            // first_line.attr("stroke","blue").attr("stroke-width",3).attr("fill","none");
//            graph.selectAll(".x-scale-label").data(x_scale.ticks(10)).enter().append("text").attr("class", "x-scale-label").attr("x",x_scale).attr('y',y_scale(0)).attr("text-anchor","end").attr("dy","0.3em").attr("dx","0.5em").text(String);
        }
        return {nextState: nextState, updateTopBubbles: updateTopBubbles, updateArrows: updateArrows, updateArrowTextbox: updateArrowTextbox, setupGraph: setupGraph, updateGraph: updateGraph, animateTransitionBlocks:animateTransitionBlocks};

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