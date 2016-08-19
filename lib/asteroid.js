const Util = require("./utils.js");

function Asteroid (pos, game) {
  const COLOR = "#00ffff";
  this.game = game;
  const RADIUS = 12;
  let vel = Util.randomVec(10);
  console.log(this.game);
  this.game.movingObject.call(this, pos, vel, RADIUS, COLOR, game);
}


module.exports = Asteroid;
