ig.module(
  'game.entities.asteroid'
)
.requires(
  'impact.game'
)
.defines(function(){

  EntityAsteroid = ig.Entity.extend({

    animAsteroid: null,
    size: {x: 25, y: 68},
    type: ig.Entity.TYPE.B,
    maxVel: {x : 500, y: 500},

	init: function(x, y, settings) {
      this.parent(x, y, settings);
      var animSheet = new ig.AnimationSheet( 'media/asteroid.png', 25, 68 );
      this.animAsteroid = new ig.Animation( animSheet, 0.1, [0] );
	},

	update: function() {
      this.parent();
      if (this.pos.y > 570) { //moved out of the bottom of the screen
        this.kill();
      }
	},

	draw: function() {
      this.animAsteroid.draw(this.pos.x, this.pos.y);
	}
  });
});
