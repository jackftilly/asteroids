const Util = require("./utils.js");


function Bullet (game) {
  const COLOR = "#000";
  const RADIUS = 2;
  this.pos = game.ship.pos;
  game.movingObject.call(this, this.pos, game.setVel(), RADIUS, COLOR, game);
}


module.exports = Bullet;
