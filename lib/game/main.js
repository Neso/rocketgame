ig.module(
	'game.main'
)
.requires(
  'impact.game',
  'game.entities.booster',
  'game.entities.rocket',
  'game.entities.rollingBackground',
  'game.entities.messageManager',
  'game.entities.radar',
  'game.entities.endingGame',
  'game.entities.menu',
  'game.entities.fuelRocket',
  'game.entities.asteroid'
)
.defines(function(){

RocketGame = ig.Game.extend({

  currentFuelRocketTime : 18.25,
  fuelRocketTimer : new ig.Timer(30), //fuel timer starts with 22.5 because //Also each time fuelRocket is spawned it will increase game difficulty
  fuelRocketTimerIncrease : 3.75,

  nextAsteroidTimer : 25, //asteroid starts spawning with 15s or rather 12s since player gets control usual asteroid spawning is between 1-5 secs
  asteroidTimer :  new ig.Timer(this.nextAsteroidTimer),
  asteroidSpeedCoefficient : 4, //Init coefficient used for asteroidspeed
  asteroidSpawningRate : 2.5, // Used to increase time spawning between asteroids

  rocketBoosterSoundTimer : new ig.Timer(6),
  rocket : undefined,

  gameSkippingTimer : new ig.Timer(1),

  init: function() {
    //key bindings for mobile and desktop
    ig.input.bind( ig.KEY.MOUSE1, 'MousePressed' );
    ig.input.bind( ig.KEY.LEFT_ARROW, 'LeftArrow' );
    ig.input.bind( ig.KEY.RIGHT_ARROW, 'RightArrow' );

    //Spawning control buttons
    ig.game.spawnEntity(EntityBooster, 0, 468, {rocketDirection: "left", imageName: "media/boosterRight.png", touchName: "MousePressed", keyName: "LeftArrow", size: {x: 100, y: 100}});
    ig.game.spawnEntity(EntityBooster, 220, 468, {rocketDirection: "right", imageName: "media/boosterLeft.png", touchName: "MousePressed", keyName: "RightArrow", size: {x: 100, y: 100}});

    ig.gameStates = { launchPrep: "launchPrep", launchRocket: "launchRocket", menu: "menu", gameEnded: "gameEnded", waitingUserInput: "waitingUserInput", flying: "flying", gameSkippingToMenu: "gameSkippingToMenu"};

    //GlobalVariables for rocket
    ig.rocketDirection = false;
    ig.rocketVerticalSpeed = 0;
    ig.rocketVerticalAcceleration = 10;
    ig.timeTillLaunch = 3;
    ig.timeTillLaunchOriginal = 3;
    ig.gameStatus = ig.gameStates.menu; //launchprep, launch menu, ended, flying
    ig.launchTimer = new ig.Timer(3.1);

    this.rocket = ig.game.spawnEntity(EntityRocket, 140, 468, {imageName: "media/rocket.png"});

    //spawning elements of the rollingBackground
    ig.game.spawnEntity(EntityRollingBackground, -220, -9282, {name: "rollingBackground", imageName: "media/launchPad.png"});

    ig.game.spawnEntity(EntityRadar, -240, 0, {imageName: "media/radarGrid.png"});

    ig.game.spawnEntity(EntityMessageManager, 0, 0);
    ig.game.sortEntitiesDeferred();

    //Prepare game sounds
    ig.rocketBoosterSound = new ig.Sound('media/sounds/engineRunning.mp3');
    ig.explosionSound = new ig.Sound('media/sounds/explosion.mp3');
  },

  update: function() {
    // Update all entities and backgroundMaps
    this.parent();
    if (ig.gameStatus == ig.gameStates.launchPrep) {
      if (ig.launchTimer.delta() > 0) {
        ig.gameStatus = ig.gameStates.launchRocket;
        this.rocketBoosterSoundTimer.set(5.5);
        ig.rocketBoosterSound.play();
        this.fuelRocketTimer.reset();
        this.asteroidTimer.reset();
      } else if (ig.launchTimer.delta() <= 0) {
        ig.timeTillLaunch = Math.floor(Math.abs(ig.launchTimer.delta()));
      }
    }

    if (ig.gameStatus == ig.gameStates.menu) {
      this.reboot();
      ig.game.spawnEntity(EntityMenu, 0, 0, {imageName: "media/startImage.png", touchName: "MousePressed", size: {x: 320, y: 568}});
      ig.gameStatus = ig.gameStates.waitingUserInput;
    }

    if (ig.gameStatus == ig.gameStates.gameEnded) {
      ig.gameStatus = ig.gameStates.gameSkippingToMenu;
      this.gameSkippingTimer.reset();
      this.gameEndScreen = ig.game.spawnEntity(EntityEndingGame, 0, 0, {imageName: "media/endImage.png", touchName: "MP", size: {x: 320, y: 528}});
    }

    if (ig.gameStatus == ig.gameStates.gameSkippingToMenu && this.gameSkippingTimer.delta() > 0) {
      ig.gameStatus = ig.gameStates.menu;
      this.gameEndScreen.kill();
    }

    if (ig.gameStatus == ig.gameStates.flying ) {
      this.calculateFuelRocket();
      this.calculateAsteroid();
      this.checkBoosterSound();
    }
  },

  draw: function() {
    // Draw all entities and backgroundMaps
    this.parent();
  },

  checkBoosterSound : function () {
    if (this.rocketBoosterSoundTimer.delta() > 0) {
      this.rocketBoosterSoundTimer.set(6);
      ig.rocketBoosterSound.play();
    }
  },

  //reboot all parameters after player loses game.
  reboot: function () {
    console.log("main.reboot invoked");
    ig.rocketDirection = false;
    ig.rocketVerticalSpeed = 0;
    ig.rocketVerticalAcceleration = 10;
    ig.timeTillLaunch = 3;
    ig.timeTillLaunchOriginal = 3;
    ig.game.getEntityByName("rollingBackground").reboot();
    this.rocket.pos.x = 140;
    this.rocket.pos.y = 468;

    this.asteroidSpeedCoefficient = 4;
  },

  calculateFuelRocket : function () {
    if (this.fuelRocketTimer.delta() >= 0) {
      this.fuelRocketTimer.set(this.currentFuelRocketTime + this.fuelRocketTimerIncrease);
      rollingBackground = ig.game.getEntitiesByType("EntityRollingBackground")[0];
      ig.game.spawnEntity(EntityFuelRocket, Math.floor(Math.random() * 220 + 50), -60, {accel: rollingBackground.accel, vel: rollingBackground.vel}); //using width of the screen -50px
      this.increaseGameDifficutly();
      ig.game.getEntitiesByType(EntityMessageManager)[0].pushMessage("Collect fuel rocket to refuel...", 5);
    }
  },

  increaseGameDifficutly : function (){
    this.asteroidSpeedCoefficient++;
    if (this.asteroidSpawningRate < 0) {
      this.asteroidSpawningRate = 0;
    } else {
      this.asteroidSpawningRate -= 0.5;
    }
  },

  calculateAsteroid : function () {
    if (this.asteroidTimer.delta() >= 0) {
      this.asteroidTimer.set(Math.floor(Math.random() * 1 + this.asteroidSpawningRate));
      var entry = Math.floor(Math.random() * 300 + 10);
      ig.game.spawnEntity(EntityAsteroid, entry, -250, {vel: {x: 0, y: 200 + 50 * Math.floor(Math.random() * this.asteroidSpeedCoefficient)}});
      ig.game.getEntitiesByType("EntityRadar")[0].registerBlip(entry + Math.floor(Math.random() * 20 - 10));
    }
  }
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', RocketGame, 60, 320, 568, 1 );

});
