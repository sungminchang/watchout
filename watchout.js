// // start slingin' some d3 here.

var _ = {};

_.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }
    return range;
  };

var gameOptions = {
  height: 400,
  width: 700,
  nEnemies: 30,
  padding: 20,
  duration: 1500,
  r: 10
};

var axes = {
  x: d3.scale.linear().domain([0,100])
  .range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100])
  .range([0,gameOptions.height])
};

var gameBoard = d3.select("body").append("svg:svg")
  .style( {width: gameOptions.width,
          height: gameOptions.height,
          "background-color": "#ccc"});


var increaseScore = function() {
  var scoreBoard = d3.select('.current span');
  var score = scoreBoard.text();
  score++;
  scoreBoard.text(score)
};

var getHighScore = function() {
  var highBoard = d3.select('.high span')
  var highScore = highBoard.text();
  var score = d3.select('.current span').text();

  if (score > highScore) {
    highBoard.text(score);
  }
};

setInterval(increaseScore, 100)


var xRandom = function(){ return (Math.random() * 100) + 1;}

var yRandom = function(){ return (Math.random() * 100) + 1;}

var d3enemies = d3.select("svg").selectAll("circle")
  .data(d3.range(gameOptions.nEnemies))
  .enter().append("circle")
  .attr("class", "enemy")
  .attr("cx", function (){
    return axes.x(xRandom())
  })
  .attr("cy", function (){
    return axes.y(yRandom())
  })
  .attr("r", gameOptions.r)
  .style({fill: "blue"
});

var move = function(element) {
  return element.transition().duration(gameOptions.duration)
    .attr("cx", function (){
    return axes.x(xRandom())
    })
  .attr("cy", function (){
    return axes.y(yRandom())
  }).each('end', function() {
    move(d3.select(this));
  })
};

move(d3enemies);

var drag = d3.behavior.drag()
  .on('drag', function() {
    player
      .attr('cx', d3.event.x)
      .attr('cy', d3.event.y);
  });

var player = d3.select("svg")
  .append("circle")
  .attr("cx", function (){
    return axes.x(50)
  })
  .attr("cy", function (){
    return axes.y(50)
  })
  .attr("r", gameOptions.r)
  .style({fill: "red"})
  .call(drag);

var prevCollision = false;
var detectCollision = function() {

  var collision = false;

  d3enemies.each(function() {
    var diffX = player.attr("cx") - this.getAttribute("cx");
    var diffY = player.attr("cy") - this.getAttribute("cy");
    var distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

    if (distance <= 2 * gameOptions.r) {
      collision = true;

      var collisions = d3.select('.collisions span').text();
      collisions++;
      d3.select('.collisions span').text(collisions);
    }

  });

  if ((collision !== prevCollision) && collision) {
    console.log("collision!");
  }
  prevCollision = collision;
}

d3.timer(detectCollision);


