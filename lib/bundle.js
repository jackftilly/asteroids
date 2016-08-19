/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);
	
	document.addEventListener("DOMContentLoaded", function() {
	  // debugger
	  let canvas = document.getElementById("game-canvas");
	  let ctx = canvas.getContext("2d");
	  let gameview = new GameView(ctx);
	  gameview.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	function GameView (ctx) {
	  this.ctx = ctx;
	  this.game = new Game();
	}
	
	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  setInterval(() => {
	    this.game.draw(this.ctx);
	    this.game.step();
	  }, 20);
	
	};
	
	GameView.prototype.bindKeyHandlers = function() {
	  window.key("w", () => {
	    this.game.ship.power([0, -1]);
	  });
	  window.key("a", () => this.game.ship.power([-1, 0]));
	  window.key("s", () => this.game.ship.power([0, 1]));
	  window.key("d", () => this.game.ship.power([1, 0]));
	
	  window.key("space", () => this.game.addBullet());
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(3);
	const Bullet = __webpack_require__(5);
	const Ship = __webpack_require__(6);
	const MovingObject = __webpack_require__(7);
	const Utils = __webpack_require__(4);
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	
	function Asteroid (pos, game) {
	  const COLOR = "#00ffff";
	  this.game = game;
	  const RADIUS = 12;
	  let vel = Util.randomVec(10);
	  console.log(this.game);
	  this.game.movingObject.call(this, pos, vel, RADIUS, COLOR, game);
	}
	
	
	module.exports = Asteroid;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Util = {
	  inherits (childClass, parentClass) {
	    function Surrogate () {}
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate();
	    childClass.prototype.constructor = childClass;
	  },
	
	  randomVec (length) {
	    let x = Math.random() * (2 * length) - length;
	    let pom = Math.floor(Math.random() * 2);
	    let y = Math.sqrt(Math.pow(length, 2) - Math.pow(x, 2));
	    if (pom === 1) {
	      y = -y;
	    }
	    return [x, y];
	  }
	};
	
	module.exports = Util;
	// console.log(Util.randomVec(10));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	
	
	function Bullet (game) {
	  const COLOR = "#000";
	  const RADIUS = 2;
	  this.pos = game.ship.pos;
	  game.movingObject.call(this, this.pos, game.setVel(), RADIUS, COLOR, game);
	}
	
	
	module.exports = Bullet;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(7);
	const Utils = __webpack_require__(4);
	
	function Ship (game) {
	  const RADIUS = 8;
	  const COLOR = "#aa0000";
	  this.game = game;
	  this.pos = game.randomPosition();
	  MovingObject.call(this, this.pos, [0,0], RADIUS, COLOR, game);
	}
	Utils.inherits(Ship, MovingObject);
	
	Ship.prototype.relocate = function() {
	  this.pos = this.game.randomPosition();
	  this.vel = [0, 0];
	};
	Ship.prototype.power = function(impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	};
	module.exports = Ship;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Bullet = __webpack_require__(5);
	function MovingObject(pos, vel, radius, color, game) {
	  this.pos = pos;
	  this.vel = vel;
	  this.radius = radius;
	  this.color = color;
	  this.game = game;
	}
	MovingObject.prototype.draw = function(ctx) {
	  ctx.beginPath();
	  ctx.fillStyle = this.color;
	  let x = this.pos[0];
	  let y = this.pos[1];
	  ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
	  ctx.fill();
	};
	MovingObject.prototype.collidedWith = function (bullet, asteroid) {
	  if (this.isCollidedWith(asteroid)) {
	    game.remove(asteroid);
	  }
	}
	
	MovingObject.prototype.move = function() {
	  if (this instanceof Bullet) {
	
	  } else {
	    this.pos = this.game.wrap(this.pos);
	  }
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  let dx = this.pos[0] - otherObject.pos[0];
	  let dy = this.pos[1] - otherObject.pos[1];
	
	  let distance = Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
	
	  // debugger
	  if ((this.radius + otherObject.radius) > distance) {
	    return true;
	  } else {
	    return false;
	  }
	};
	
	module.exports = MovingObject;
	//
	// let a1 = new MovingObject([10,10], [0,0], 10);
	// let a2 = new MovingObject([19, 25], [0,0], 10);
	// console.log(a1.isCollidedWith(a2));


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map