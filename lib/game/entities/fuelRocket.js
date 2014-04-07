ig.module(
  'game.entities.fuelRocket'
)
.requires(
  'impact.game'
)
.defines(function(){

  EntityFuelRocket = ig.Entity.extend({

    animRocket: null,
    size: {x: 13, y: 60},
    type: ig.Entity.TYPE.A,

	init: function(x, y, settings) {
      this.parent(x, y, settings);
      var animSheet = new ig.AnimationSheet( 'media/fuelRocket.png', 13, 60 );
      this.animRocket = new ig.Animation( animSheet, 0.1, [0] );
	},

	update: function() {
      this.parent();
	},

	draw: function() {
      this.animRocket.draw(this.pos.x, this.pos.y);
	}
  });
});
