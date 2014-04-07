ig.module( 
	'game.plugins.button' 
)
.requires(
	'impact.game'
)
.defines(function(){
  
  EntityButton = ig.Entity.extend({
    size: { x: 80, y: 40 },
    
    text: [],
    textPos: { x: 5, y: 5 },
    textAlign: ig.Font.ALIGN.LEFT,
    
    font: null,
    animSheet: null,
    
    state: 'idle',
    
    _oldPressed: false,
    _startedIn: false,
    _touchActionName: 'click',
    _keyActionName: 'click',
    
    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this._touchActionName = settings.touchName;
      this._keyActionName = settings.keyName;
    },
    
    update: function() {
      if ( this.state !== 'hidden' ) {
        var _clicked = ig.input.state( this._touchActionName ) || ig.input.state( this._keyActionName);
        
        if ( !this._oldPressed && _clicked && (this._inButton() || ig.input.state(this._keyActionName) ) ) {
          this._startedIn = true;
        }
        
        if ( this._startedIn && this.state !== 'deactive' && (this._inButton() || ig.input.state(this._keyActionName) )) {
          if ( _clicked && !this._oldPressed ) { // down
            this.setState( 'active' );
            this.pressedDown();
          }
          else if ( _clicked ) { // pressed
            this.setState( 'active' );
            this.pressed();
          }
          else if ( this._oldPressed ) { // up
            this.setState( 'idle' );
            this.pressedUp();
          }
        }
        else if ( this.state === 'active' ) {
          this.setState( 'idle' );
        }
 
        if ( this._oldPressed && !_clicked ) {
          this._startedIn = false;
        }
 
        this._oldPressed = _clicked;
      }
    },
    
    draw: function() {
    },
    
    setState: function( s ) {
      this.state = s;
    },
    
	pressedDown: function() {
		console.log( 'pressedDown' );
	},
	pressed: function() {
		console.log( 'pressed' );
	},
	pressedUp: function() {
		console.log( 'pressedUp' );
	},
    
    _inButton: function() {
      return ig.input.mouse.x + ig.game.screen.x > this.pos.x && 
             ig.input.mouse.x + ig.game.screen.x < this.pos.x + this.size.x &&
             ig.input.mouse.y + ig.game.screen.y > this.pos.y && 
             ig.input.mouse.y + ig.game.screen.y < this.pos.y + this.size.y;
    }
  });
});