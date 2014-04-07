ig.module(
	'game.entities.booster'
)
.requires(
  'impact.game',
  'game.plugins.button'
)
.defines(function(){

  EntityBooster = EntityButton.extend({

    anim: null,
    zIndex: 1,

	init: function(x, y, settings) {
      this.parent(x, y, settings);

      var animSheet = new ig.AnimationSheet( settings.imageName, 100, 100 );
      this.anim = new ig.Animation( animSheet, 0.1, [0] );
	},

	update: function() {
      if (ig.gameStatus === ig.gameStates.flying) {
        this.parent();
      }
      this.anim.update();
	},

    pressed: function () {
      this.parent();
      ig.rocketDirection = this.rocketDirection;
    },

	draw: function() {
      this.anim.draw( this.pos.x, this.pos.y );
	}
  });
});

