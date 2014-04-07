ig.module(
	'game.entities.rocket'
)
.requires(
  'impact.game',
  'impact.font'
)
.defines(function(){

  EntityRocket = ig.Entity.extend({

    anim: null,
    _horizontalSpeed: 2,
    zIndex: 100,
    fuel: 100.00,
    fuelTimer : new ig.Timer(0.75),
    fuelFont: new Font( '15px Garamond' ),
    fuelColor: 'green',

    points: 0,
    pointsTimer: new ig.Timer(0.075),
    size : {x: 41, y: 88},

    //points for shaking of rocket
    shakingPos: {x: 0, y: 0},
    checkAgainst: ig.Entity.TYPE.BOTH,

	init: function(x, y, settings) {
      this.parent(x, y, settings);
      var animSheet = new ig.AnimationSheet( settings.imageName, 41, 88 );
      this.anim = new ig.Animation( animSheet, 0.1, [0] );
	},

	update: function() {
      this.parent();

      if (ig.rocketDirection !== false) {
        if (ig.rocketDirection === "left") {
          this.pos.x -= this._horizontalSpeed;
          if (this.pos.x < 0) {
            this.pos.x = 0;
          }
        } else if (ig.rocketDirection === "right") {
          this.pos.x += this._horizontalSpeed;
          if (this.pos.x + 41 > ig.system.width) { //41 used as width of image anim doesn't carry for some reason width switch to texture anim at later stage
            this.pos.x = ig.system.width - 41;
          }
        }
      }
      ig.rocketDirection = false;
      if (ig.gameStatus == ig.gameStates.launchRocket) {
        this.accel.y = -ig.rocketVerticalAcceleration;
        if (this.pos.y <= 350) {
          rollingBackground = ig.game.getEntitiesByType("EntityRollingBackground")[0];
          rollingBackground.accel.y = -this.accel.y;
          rollingBackground.vel.y = -this.vel.y;
          ig.gameStatus = ig.gameStates.flying;
          this.accel.y = 0;
          this.vel.y = 0;
          this.pos.y = 350;
          ig.game.getEntitiesByType("EntityMessageManager")[0].pushMessage("Captn! You've got control", 3);
        }
      }
      //deduce fuel parameter
      if ((ig.gameStatus == ig.gameStates.launchRocket || ig.gameStatus == ig.gameStates.flying) && this.fuelTimer.delta() >= 0) {
        this.fuel--;
        this.fuelTimer.reset();
        if (this.fuel <= 0) {
          ig.gameStatus = ig.gameStates.gameEnded;
          ig.rocketBoosterSound.stop();
          ig.explosionSound.play();
          this.fuel = 100;
          this.points = 0;
          this.pos.y = 468;
          this.fuelColor = 'green';
        } else if (this.fuel < 20) {
          this.fuelColor = 'red';
        } else if (this.fuel < 50) {
          this.fuelColor = "yellow";
        } else {
          this.fuelColor = 'green';
        }
      }

      if ((ig.gameStatus == ig.gameStates.launchRocket || ig.gameStatus == ig.gameStates.flying) && this.pointsTimer.delta() >= 0) {
        this.points++;
        this.pointsTimer.reset();
      }

      if (ig.gameStatus == ig.gameStates.launchRocket || ig.gameStatus == ig.gameStates.flying) {
        this.calculateShaking();
      }
	},

    check: function (other) {
      if (other instanceof EntityFuelRocket) {
        this.fuel += 45;
        other.kill();
      } else if (other instanceof EntityAsteroid) {
        if (ig.gameStatus == ig.gameStates.flying) {
          ig.gameStatus = ig.gameStates.gameEnded;
          ig.rocketBoosterSound.stop();
          ig.explosionSound.play();
          this.fuel = 100;
          this.points = 0;
          this.pos.y = 468;
          this.fuelColor = 'green';
        }
      }
    },

    //calculate shaking motion of the rocket
    calculateShaking: function () {
      var rand = Math.random();
      if (ig.gameStatus == ig.gameStates.flying) {
        if (rand < 0.33) {
          this.shakingPos.y = 2;
        } else if (rand < 0.66) {
          this.shakingPos.y = 1;
        } else {
          this.shakingPos.y = 0
        }
        if (Math.random() < 0.5) {
          this.shakingPos.y *= -1
        }
        rand = Math.random();
        if (rand < 0.33) {
          this.shakingPos.x = 2;
        } else if (rand < 0.66) {
          this.shakingPos.x = 1;
        } else {
          this.shakingPos.x = 0
        }
        if (Math.random() < 0.5) {
          this.shakingPos.x *= -1
        }
      } else {
        if (rand < 0.5) {
          this.shakingPos.y = 1;
        } else {
          this.shakingPos.y = 0;
        }
        if (rand < 0.5) {
          this.shakingPos.x = 1;
        } else {
          this.shakingPos.x = 0;
        }
      }
    },

	draw: function() {
      this.anim.draw(this.pos.x - this.shakingPos.x, this.pos.y - this.shakingPos.y);
      this.fuelFont.draw( 'Fuel: ' + this.fuel + "%", 5, 55, 'left', this.fuelColor );
      this.fuelFont.draw( 'Points: ' + this.points, 5, 75, 'left', "white" );
	}
  });
});

