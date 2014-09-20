// start slingin' some d3 here.

var options = {
  height: 450,
  width: 700,
  numEnemies: 10,
  padding: 20,
  enemyRadius: 10
};

// Step 1
// create the svg
// then create the data array for enemy positions (to be called later)
// append the enemies

var svg = d3.select('body').append('svg')
            .attr('height', options.height)
            .attr('width', options.width)
            .style('padding', options.padding + 'px');

// Step 3
// create an element which represents the player
var center = [{x: (options.width - 2 * options.padding) / 2,
               y: (options.height - 2 * options.padding) / 2 }];

var player = svg.selectAll('image').data(center);

player.enter().append('image').attr('class', 'mario')
              .attr('x', function(d){ return d.x; })
              .attr('y', function(d){ return d.y; })
              .attr('height', '40px')
              .attr('width', '40px')
              .attr('xlink:href', 'mario.png');

//make the player draggable
var dragMove = function(){
  var xdiff = d3.event.dx;
  var ydiff = d3.event.dy;
  var currentData = player.data()[0];
  var newX = currentData.x + xdiff;
  var newY = currentData.y + ydiff;
  player.data([{x: newX, y: newY}])
  .attr('x', function(d){ return d.x; })
  .attr('y', function(d){ return d.y; });
};
var drag = d3.behavior.drag().on('drag', dragMove);
player.call(drag);

var tweenWithCollisionDetection = function(endData){
  var enemy = d3.select(this);
  // console.log(parseFloat(enemy.attr("cx")));
  var startPos = {x: parseFloat(enemy.attr("x")), y: parseFloat(enemy.attr("y"))};

  return function(t){
    var currentPlayer = player.data()[0];
    var currentPlayerX = currentPlayer.x;
    var currentPlayerY = currentPlayer.y;
    var enemyX = startPos.x + (endData.x - startPos.x) * t;
    var enemyY = startPos.y + (endData.y - startPos.y) * t;
    var distance = Math.sqrt(Math.pow(currentPlayerX - enemyX, 2) +
      Math.pow(currentPlayerY - enemyY, 2));
    if(distance < 30){
      // debugger;
      console.log('game over');
      return;
    }
  };
};

var update = function(enemyPositions) {
  // Updating enemies with new positions
  var enemies = svg.selectAll('.enemy')
                   .data(enemyPositions);

  // Appending enemies (if they don't exist)
  enemies.enter().append('image').attr('class', 'enemy');

  // Setting the position of the enemies
  enemies.transition().duration(2000)
         .tween('custom', tweenWithCollisionDetection)
         .attr('x', function(d){ return d.x; })
         .attr('y', function(d){ return d.y; })
         .attr('height', '25px')
         .attr('width', '25px')
         .attr('xlink:href', 'enemy.png');
};

var generatePositions = function(){
  // make output array
  // go through for loop for number of enemies
  //   create empty objetc with random x and y coordinates
  //   adjusted by height / width / padding / radius
  // return the array

  var output = [];
  for (var i = 0; i < options.numEnemies; i++){
    var xposition = Math.random() * (options.width - 2 * (options.padding + options.enemyRadius)) + options.enemyRadius;
    var yposition = Math.random() * (options.height - 2 * (options.padding + options.enemyRadius)) + options.enemyRadius;
    output.push({x: xposition, y: yposition});
  }
  return output;
};

var initialEnemyPositions = generatePositions();
update(initialEnemyPositions);
setTimeout(function(){
  update(generatePositions());
}, 50);


// Step 2
// setInterval for updating enemy positions

setInterval(function(){
  update(generatePositions());
}, 2000);


//Step 4
//detect when a enemy touches you


// Step 5
//Keep track of the user's score, and display it.

