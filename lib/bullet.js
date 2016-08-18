const MovingObject = require("./moving_object.js");
const Util = require("./utils.js");


function Bullet (game) {
  const COLOR = "#000";
  const RADIUS = 2;
  console.log(this);
  this.vel = this.setVel(game);
  this.pos = game.ship.pos;
  MovingObject.call(this, this.pos, this.vel, RADIUS, COLOR, game);
}

Bullet.prototype.collidedWith = function(asteroid) {
  if (this.isCollidedWith(asteroid)) {
    game.remove(asteroid);
  }
};

Util.inherits(Bullet, MovingObject);

module.exports = Bullet;
