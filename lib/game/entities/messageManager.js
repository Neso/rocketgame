ig.module(
	'game.entities.messageManager'
)
.requires(
  'impact.game',
  'impact.font',
  'game.plugins.font'
)
.defines(function(){

  EntityMessageManager = ig.Entity.extend({

    zIndex: 50,
    font: new Font( '20px Garamond' ),
    fontCountDown: new Font( '40px Garamond' ),

    messageTimer: new ig.Timer(2),
    messageText: "",

	init: function(x, y, settings) {
      this.parent(x, y, settings);
	},

	update: function() {
      this.parent();
	},

	draw: function() {
      if (ig.gameStatus === ig.gameStates.launchPrep) {
        this.font.draw( 'Launch in:', 160, 220, 'center', '#FF0000' );
        if (ig.timeTillLaunch == 0) {
          this.fontCountDown.draw( "GO", 160, 250, 'center', '#FF0000' );
        } else {
          this.font.draw( ig.timeTillLaunch, 160, 250, 'center', '#FF0000' );
        }
      } else if (this.messageText !== "") {
        if (this.messageTimer.delta() < 0) {
          this.font.draw(this.messageText, 160, 250, 'center', '#FF0000');
        } else {
          this.messageText = "";
        }
      } else {
        this.messageText = "";
      }
	},

    pushMessage: function (messageTxt, messageLifeTime) {
      this.messageText = messageTxt;
      this.messageTimer.set(messageLifeTime);
    },

    setText : function (messageTxt) {
      this.messageText = messageTxt;
    }
  });
});

