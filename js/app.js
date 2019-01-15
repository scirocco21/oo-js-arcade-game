const board = {
  leftEdge: 0,
  rightEdge: 700,
  topEdge: 0,
  bottomEdge: 520
};
// generate random integers in intervals of 40 between 40-720 on the x-axis and between 150 - 360
class Asset {
  constructor() {
    this.possiblePositions = this.defineAssetPositions();
    this.coEfficient = this.possiblePositions.length - 1
    this.position = this.possiblePositions[Math.floor(Math.random() * this.coEfficient)]
    this.x = this.position[0]
    this.y = this.position[1]
    this.type = this.defineType();
    this.image = this.defineImage();
    this.width = 30;
    this.height = 40;
  }
}
Asset.prototype.defineAssetPositions = function() {
  let array = [];
  for (i = 40; i < board["rightEdge"]; i += 40) {
    for (j = 150; j < 360; j+= 30) {
      array.push([i,j]);
    }
  }
  return array;
}
Asset.prototype.defineType = function() {
  let types = ["heart", "gem", "star"];
  let random = Math.floor(Math.random() * (3 - 1 + 1) + 1);
  return types[random - 1 ]
}
Asset.prototype.defineImage = function() {
  let imageMap = {
    "heart": 'images/Heart.png',
    "gem": 'images/Gem Orange.png',
    "star": 'images/Star.png'
  }
  return imageMap[this.type]
}
Asset.prototype.checkCapture = function() {
  if (this.x + this.width >= player.x &&
    player.x + player.width >= this.x  &&
    this.y + this.height >= player.y &&
    player.y + player.height >= this.y) {
    allAssets = allAssets.filter(asset => asset !== this);
    this.applyBonus();
  }
}
Asset.prototype.applyBonus = function() {
  if (this.type === "heart") {
    player.lives = player.lives + 1;
  } else if (this.type === "gem") {
    player.score += 2000
  } else if (this.type === "star") {
    player.width = player.width * 1.5;
    player.score += 1000;
  }
}
Asset.prototype.render = function() {
  ctx.drawImage(Resources.get(this.image), this.x, this.y)
}
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
// check if the squares are blocked by obstacles before moving
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
  constructor(direction, speed, x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.speed = speed;
    this.x = x;
    this.y = y;
    // hardcode width  and height as long as there is only one enemy type
    this.width = 40;
    this.height = 30;
    this.direction = direction;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
  }
};
Enemy.prototype.sprite = function() {
  return this.direction === "right" ? 'images/enemy-bug.png' : 'images/enemy-bug-leftbound.png'
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
   let renderSpeed = this.speed * dt;
   if (this.direction === "right") {
     if (this.x < board["rightEdge"]) {
       this.x = this.x + renderSpeed;
     } else {
      this.x = 0;
    }
  } else {
    if (this.x > 0) {
      this.x = this.x - renderSpeed;
    } else {
      this.x = board["rightEdge"]
    }
  }
   this.checkCollisions();
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  const sprite = this.sprite();
    ctx.drawImage(Resources.get(sprite), this.x, this.y);
};
// enemies and player need to be contiguous, so all four conditions below have to apply jointly, not just one
Enemy.prototype.checkCollisions = function() {
  if (
    player.x + player.width >= this.x &&
    this.x + this.width >= player.x &&
    player.y + player.height >= this.y &&
    this.y + this.height >= player.y
    ) {
    player.lives = player.lives - 1;
    player.toStart();
  }
}
class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    // center player sprite
    this.x = board["rightEdge"]/2;
    // place player at bottom of canvas
    this.y = board["bottomEdge"];
    this.speed = 40;
    this.height = 40;
    this.width = 30;
    this.lives = 3;
    this.score = 0;
  }
}
Player.prototype.toStart = function() {
  this.x = board["rightEdge"]/2;
  this.y = board["bottomEdge"];
}
Player.prototype.isOver = function() {
  return this.y < board["topEdge"] + this.height ? true : false;
}
// update function is continuously called and store actions that are performed over and over, e.g. checking game end
Player.prototype.update = function() {
  if (this.isOver()) {
    alert("You beat the bugs!");
    this.toStart();
    allAssets = [new Asset(), new Asset(), new Asset()
  }
};
// converts key input to state change in sprite
Player.prototype.handleInput = function(keyPress) {
  let playerAtNewPosition = Object.assign({}, player)
  switch (keyPress) {
    case 'left':
    playerAtNewPosition.x = this.x - this.width;
      if (this.x >= 0 && !allObstacles.some(object => object.checkCollision(playerAtNewPosition))) {
        this.x = this.x - this.width;
        allAssets.forEach(function(asset) {asset.checkCapture()})
      }
      break;
    case 'right':
      playerAtNewPosition.x = this.x + this.width;
      if (this.x <= board["rightEdge"] && !allObstacles.some(object => object.checkCollision(playerAtNewPosition))) {
        this.x = this.x + this.width;
        allAssets.forEach(function(asset) {asset.checkCapture()})
      }
      break;
    case 'up':
     playerAtNewPosition.y = this.y - this.height;
      if (this.y >= this.height && !allObstacles.some(object => object.checkCollision(playerAtNewPosition))) {
        this.y = this.y - this.height;
        allAssets.forEach(function(asset) {asset.checkCapture()})
      }
      break;
    case 'down':
     playerAtNewPosition.y = this.y + this.height;
      if (this.y <= board["bottomEdge"] - this.height && !allObstacles.some(object => object.checkCollision(playerAtNewPosition))) {
        this.y = this.y + this.height;
        allAssets.forEach(function(asset) {asset.checkCapture()})
      }
    }
}
Player.prototype.render = function() {
 ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//  instantiate  objects.
let player = new Player();
let allEnemies = [new Enemy("right", 200, 0, 146), new Enemy("left", 100,700,146), new Enemy("left", 250, 700, 300), new Enemy("right", 300,0, 230)];
let allObstacles = [new Obstacle(100, 60), new Obstacle(200, 60), new Obstacle(710,55), new Obstacle(500, 500)]
let allAssets = [new Asset(), new Asset(), new Asset()]
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
