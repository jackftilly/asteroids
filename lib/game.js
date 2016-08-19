const Asteroid = require("./asteroid.js");
const Bullet = require("./bullet.js");
const Ship = require("./ship.js");
const MovingObject = require("./moving_object.js");
const Utils = require("./utils.js");
const DIM_X = 1000;
const DIM_Y = 600;
const NUM_ASTEROIDS = 2;
Utils.inherits(Bullet, MovingObject);
Utils.inherits(Asteroid, MovingObject);
function Game() {
  this.movingObject = MovingObject;
  this.asteroids = [];
  this.addAsteriods();
  this.ship = new Ship(this);
  this.bullets = [];
}
Game.prototype.randomPosition = function () {
  let x = Math.floor(Math.random() * DIM_X);
  let y = Math.floor(Math.random() * DIM_Y);
  return [x, y];
};

Game.prototype.addAsteriods = function() {
  for (let idx = 0; idx < NUM_ASTEROIDS; idx++) {
    let randompos = this.randomPosition();
    let asteroid = new Asteroid(randompos, this);
    this.asteroids.push(asteroid);
  }
};
Game.prototype.addBullet = function() {
  let bullet = new Bullet(this);
  this.bullets.push(bullet);
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, 1000, 600);
  this.allObjects().forEach(function (el) {
    el.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  let that = this;
  this.allObjects().forEach(function (el) {
    el.move.call(el);
    if (that.bullets.includes(el)) {
    }
  });
};
Game.prototype.setVel = function() {
  let [x, y] = this.ship.vel;
  let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));;
  let newX = ((x / length) * 50);
  let newY = ((y / length) * 50);
  return [newX, newY];
}
Game.prototype.wrap = function (pos) {
  let [x, y] = pos;
  if (y <= 0) {
    return [x, 600];
  } else if (y >= 600) {
    return [x, 0];
  } else if (x <= 0) {
    return [1000, y];
  } else if (x >= 1000) {
    return [0, y];
  } else {
    return [x, y];
  }
};

Game.prototype.checkCollisions = function () {
  this.asteroids.forEach( (a1) => {
    if (a1.isCollidedWith(this.ship)) {
      this.ship.relocate();
    }
    this.bullets.forEach((bullet) => {
      bullet.collidedWith(a1);
    })
  });
};

Game.prototype.step = function () {
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.allObjects = function() {
  let objects = this.asteroids.concat(this.ship);
  return objects.concat(this.bullets);
};

Game.prototype.remove = function(asteroid) {
  let asteroidsNew = []
  this.asteroids.forEach ((ast) => {

    if (ast === asteroid) {} else {
      asteroidsNew.push(ast);
    }
  });
  this.asteroids = asteroidsNew;
}

module.exports = Game;
