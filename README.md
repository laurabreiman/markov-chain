Markov-Chain Applet
============
Developed by So yeun (Ashley) Cho (<socho@mit.edu>) and Laura Breiman (<lauracle@mit.edu>)
Mentor: Robert Miller (<rcm@mit.edu>)

=======
General Description: this applet, using a particular lego game example, helps students visualize how a Markov chain transitions the probability distribution of each state in discrete time. It also helps students to understand the application of Bayes' Theorem in updating the probability distribution. For use in the MIT class 6.01(Introducation to Electrical Engineering and Computer Science) to understand Markov chain and Bayes' Theorem.

Uses: Bootstrap, Javascript, CSS, jQuery, d3

To view the demo:

http://htmlpreview.github.com/?https://github.com/laurabreiman/markov-chain/blob/master/markov.html

========
To insert the applet in your own web page, follow these steps:

1. Clone our GitHub Repository so that you have access to our files. (www.github.com/laurabreiman/markov-chain) 

2. Then, add the following HTML code to the head of your own code, and insert a div with class "markov" in the body of your html:

        <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
        <script src="bootstrap/js/bootstrap.min.js"></script>
        <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
        <script src="calculate.js"></script>
        <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
        <link href="markov.css" rel="stylesheet">
        <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
        </head>
        ....
        ....
        <body>
        <div class = "markov"></div>
        ...
        </body>
