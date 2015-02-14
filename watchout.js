// start slingin' some d3 here.


var gameOptions = {
  height: 400,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var axes = {
  x: d3.scale.linear().domain([0,100])
  .range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100])
  .range([0,gameOptions.height])
};

var gameBoard = d3.select("body").append("svg:svg")
  .style({width: gameOptions.width,
          height: gameOptions.height,
          "background-color": "#ccc"});

// var updateScore =   d3.select('.current')
//       .text(gameStats.score.toString());

// var updateBestScore = {
//         gameStats.bestScore =
//           _.max [gameStats.bestScore, gameStats.score]

//         d3.select('#best-score').text(gameStats.bestScore.toString())
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


var Player = function() {
  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  this.fill = 'orange';
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 5;


}

var render = function(enemy_data) {
    var checkCollision, enemies, onCollision, tweenWithCollisionDetection;
    enemies = gameBoard.selectAll('circle.enemy').data(enemy_data, function(d) {
      return d.id;
    });
    enemies.enter().append('svg:circle').attr('class', 'enemy').attr('cx', function(enemy) {
      return axes.x(enemy.x);
    }).attr('cy', function(enemy) {
      return axes.y(enemy.y);
    }).attr('r', 0);
    enemies.exit().remove();

    var tweenWithCollisionDetection = function(endData) {
      var endPos, enemy, startPos;
      enemy = d3.select(this);
      startPos = {
        x: parseFloat(enemy.attr('cx')),
        y: parseFloat(enemy.attr('cy'))
      };
      endPos = {
        x: axes.x(endData.x),
        y: axes.y(endData.y)
      };
      return function(t) {
        var enemyNextPos;
        // checkCollision(enemy, onCollision);
        enemyNextPos = {
          x: startPos.x + (endPos.x - startPos.x) * t,
          y: startPos.y + (endPos.y - startPos.y) * t
        };
        return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
      };
    };

    // onCollision = function() {
    //   updateBestScore() ;
    //   gameStats.score = 0;
    //   return updateScore();
    // };

    return enemies.transition().duration(500).attr('r', 10).transition().duration(2000).tween('custom', tweenWithCollisionDetection);
  };


var createEnemies = function() {
    return _.range(0, gameOptions.nEnemies).map(function(i) {
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      };
    });
  };

var play = function() {
    var gameTurn;
    gameTurn = function() {
      var newEnemyPositions;
      newEnemyPositions = createEnemies();
      return render(newEnemyPositions);
    };
    // increaseScore = function() {
    //   gameStats.score += 1;
    //   return updateScore();
    // };
    gameTurn();
    setInterval(gameTurn, 2000);
    // return setInterval(increaseScore, 50);
  };
  play();
