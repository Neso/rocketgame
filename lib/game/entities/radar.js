ig.module(
  'game.entities.radar'
)
.requires(
  'impact.game'
)
.defines(function(){

  EntityRadar = ig.Entity.extend({

    anim: null,
    animRadarScan: null,
    animBlipScan: null,
    posRadarScan: {x: 0, y: 0},
    blipPositionX: -50,
    shakingPos : {x : 0, y : 0},

	init: function(x, y, settings) {
      this.parent(x, y, settings);
      var animSheet = new ig.AnimationSheet( settings.imageName, 800, 50 );
      this.anim = new ig.Animation( animSheet, 0.1, [0] );
      animSheet = new ig.AnimationSheet( 'media/radarScan.png', 50, 50 );
      this.animRadarScan = new ig.Animation( animSheet, 0.1, [0] );
      animSheet = new ig.AnimationSheet( 'media/notAsteroid.png', 10, 10 );
      this.animBlipScan = new ig.Animation( animSheet, 0.1, [0] );
	},

	update: function() {
      this.parent();
      this.posRadarScan.x += 2;
      if (this.posRadarScan.x > ig.system.width + 50) {
        this.posRadarScan.x = -50;
      }
      if (ig.gameStatus == ig.gameStates.launchRocket || ig.gameStatus == ig.gameStates.flying) {
        this.calculateShaking();
      }
	},

	draw: function() {
      this.anim.draw(this.pos.x, this.pos.y);
      this.animRadarScan.draw(this.posRadarScan.x - this.shakingPos.x, this.posRadarScan.y - this.shakingPos.y);
      this.animBlipScan.draw(this.blipPositionX - this.shakingPos.x, this.pos.y + 25 - this.shakingPos.y);
	},
    
    //calculate shaking motion of the radar shakes in the same way as the rocket is shaking.
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


    registerBlip: function (posX) {
      this.blipPositionX = posX;
    },
  });
});

