const board = {
  leftEdge: 0,
  rightEdge: 700,
  topEdge: 0,
  bottomEdge: 520
};

// Obstacles to navigate
class Obstacle {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 30;
    this.image = 'images/Rock.png';
  }
}
Obstacle.prototype.render = function() {
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
};

// player instance needs to check if the squares are blocked by obstacles before moving
Obstacle.prototype.checkCollision = function(player) {
  if (this.x + this.width >= player.x &&
    player.x + player.width >= this.x  &&
    this.y + this.height >= player.y &&
    player.y + player.height >= this.y) {
      return true
  } else {
    return false;
  }
}
// Enemies our player must avoid
class Enemy {
  constructor(speed, x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.speed = speed;
    this.x = x;
    this.y = y;
    // hardcode width  and height as long as there is only one enemy type
    this.width = 40;
    this.height = 30;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
  }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
   let renderSpeed = this.speed * dt;
   if (this.x < board["rightEdge"]) {
     this.x = this.x + renderSpeed;
   } else {
     this.x = 0;
   };
   this.checkCollisions();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// enemies and player need to be contiguous, so all four conditions below have to apply jointly, not just one
Enemy.prototype.checkCollisions = function() {
  if (
    player.x  + player.width >= this.x &&
    this.x + this.width >= player.x &&
    player.y + player.height >= this.y &&
    this.y + this.height >= player.y
    ) {
    player.toStart()
  }
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    // center player sprite
    this.x = board["rightEdge"]/2;
    // place player at bottom of canvas
    this.y = board["bottomEdge"];
    this.speed = 40;
    // hardcode height and width as long as only one type of character is available
    this.height = 40;
    this.width = 30;
  }
}
Player.prototype.toStart = function() {
  this.x = board["rightEdge"]/2;
  this.y = board["bottomEdge"];
}
Player.prototype.isOver = function() {
  return this.y <= this.height ? true : false;
}
// update function is continuously called and store actions that are performed over and over, e.g. checking game end
Player.prototype.update = function() {
  if (this.isOver()) {
    alert("You beat the bugs!");
    this.toStart();
  }
};
// converts key input to state change in sprite
Player.prototype.handleInput = function(keyPress) {
  let playerAtNewPosition = Object.assign({}, player)
  switch (keyPress) {
    case 'left':
    playerAtNewPosition.x = this.x - this.width;
    console.log(playerAtNewPosition, player)
      if (this.x >= 0 && !allObstacles.some(object => object.checkCollision(playerAtNewPosition))) {
        this.x = this.x - this.width;
      }
      break;
    case 'right':
      playerAtNewPosition.x = this.x + this.width;
      if (this.x <= board["rightEdge"] && !allObstacles.some(object => object.checkCollision(playerAtNewPosition))) {
        this.x = this.x + this.width;
      }
      break;
    case 'up':
     playerAtNewPosition.y = this.y - this.height;
      if (this.y >= this.height && !allObstacles.some(object => object.checkCollision(playerAtNewPosition))) {
        this.y = this.y - this.height;
      }
      break;
    case 'down':
     playerAtNewPosition.y = this.y + this.height;
      if (this.y <= board["bottomEdge"] - this.height && !allObstacles.some(object => object.checkCollision(playerAtNewPosition))) {
        this.y = this.y + this.height;
      }
    }
}

Player.prototype.render = function() {
 ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

let player = new Player();
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [new Enemy(200, 0, 146), new Enemy(100,0,146), new Enemy(250, 0, 300), new Enemy(300,0, 230)];
let allObstacles = [new Obstacle(100, 60), new Obstacle(200, 60), new Obstacle(710,55), new Obstacle(500, 500)]
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
