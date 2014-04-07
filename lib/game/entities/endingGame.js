ig.module(
  'game.entities.endingGame'
)
.requires(
  'impact.game',
  'game.plugins.button'
)
.defines(function(){

  EntityEndingGame = EntityButton.extend({

    anim: null,
    zIndex: 500,

	init: function(x, y, settings) {
      console.log("EntitiyEndingGame spawned");
      this.parent(x, y, settings);
      var animSheet = new ig.AnimationSheet( settings.imageName, 320, 568 );
      this.anim = new ig.Animation( animSheet, 0.1, [0] );
	},

	update: function() {
      this.parent();
	},

    pressed: function () {
      this.parent();
      ig.gameStatus = ig.gameStates.menu;
      this.kill();
    },

	draw: function() {
      this.anim.draw(this.pos.x, this.pos.y);
	}
  });
});

