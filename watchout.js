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

var move = function() {
  return d3enemies.transition().duration(gameOptions.duration)
    .attr("cx", function (){
    return axes.x(xRandom())
    })
  .attr("cy", function (){
    return axes.y(yRandom())
  }).each('end', function() {
    move(d3.select(this));
  })
};

d3.timer(move);

var drag = d3.behavior.drag()
  // .on('dragstart', function() { player.style('fill', 'red'); })
  .on('drag', function() {
    player
      .attr('cx', d3.event.x)
      .attr('cy', d3.event.y);

  // console.log(player.attr("cx"));
  // console.log(player.attr("cy"));
  // console.log("Enemy cx: " + d3enemies.attr("cx"));
  // console.log("enemy cy: " + d3enemies.attr("cy"));
  // console.log(player.attr("cy"));
  // console.log("Enemy cx: " + d3enemies.attr("cx"));
  // console.log("enemy cy: " + d3enemies.attr("cy"));

  });
  // .on('dragend', function() { player.style('fill', 'black'); });




var playerPosition = function() {
  console.log(player.attr("cx"));
  console.log(player.attr("cy"));
};

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
  // .call(detectCollision);

// d3.timer(detectCollision, 1500);

var prevCollision = false;
var detectCollision = function() {

  var collision = false;

  d3enemies.each(function() {
    var diffX = player.attr("cx") - this.getAttribute("cx");
    var diffY = player.attr("cy") - this.getAttribute("cy");
    var distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

    if (distance <= 2 * gameOptions.r) {
      collision = true;
    }

  });

  if ((collision !== prevCollision) && collision) {
    console.log("collision!");
  }
  prevCollision = collision;
}

d3.timer(detectCollision);

