ig.module(
	'game.entities.rollingBackground'
)
.requires(
  'impact.game'
)
.defines(function(){

  EntityRollingBackground = ig.Entity.extend({

    anim: null,
    zIndex: 0,
    maxVel: {x : 500, y: 500},

	init: function(x, y, settings) {
      this.parent(x, y, settings);
      var animSheet = new ig.AnimationSheet( settings.imageName, 800, 10000 );
      this.anim = new ig.Animation( animSheet, 0.1, [0] );
      this.accel.y = 0;
      this.vel.y = 0;
	},

	update: function() {
      this.parent();
      if (this.pos.y > 570) {
        ig.game.getEntitiesByType(EntityMessageManager)[0].pushMessage("You are in black space...", 10);
      }
	},

	draw: function() {
      this.anim.draw(this.pos.x, this.pos.y);
	},

    reboot: function () {
      this.vel.y = 0;
      this.accel.y = 0;
      this.pos.y = -9282;
    }
  });
});

