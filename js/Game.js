var game = game || {};

//title screen
game.Game = function(){};

game.Game.prototype = {
  create: function() {
  	//set world dimensions
    this.game.world.setBounds(0, 0, 4000, 6000);

    //background
    this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');

    //create player
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
    this.player.scale.setTo(0.5);

    //player initial score of zero
    this.playerScore = 0;

    //enable player physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.body.allowRotation = false;
    

    this.player.anchor.setTo(0.5, 0.5);


    //the camera will follow the player in the world
    this.game.camera.follow(this.player);
    this.game.camera.deadzone = new Phaser.Rectangle(380, 250, 600, 300);
    
    //generate game elements
    this.generateCollectables();
    this.generateAsteriods();

    //show score
    this.showLabels();

    //sounds
    this.explosionSound = this.game.add.audio('explosion');
    this.collectSound = this.game.add.audio('collect');
  },
  update: function() {
	this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);
	if (this.game.input.mousePointer.isDown)
	{
        //  400 is the speed it will move towards the mouse
        this.game.physics.arcade.moveToPointer(this.player, 400);

        //  if it's overlapping the mouse, don't move any more
        if (Phaser.Rectangle.contains(this.player.body, this.game.input.mousePointer.x, this.game.input.mousePointer.y))
        {
            this.player.body.velocity.setTo(0, 0);
        }
    }
    else
    {
        this.player.body.velocity.setTo(0, 0);
    }
	  /*
this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);
	  this.game.physics.arcade.moveToPointer(this.player, 250);
	  // if(this.player.x =! this.game.input.activePointer.x || this.player.y =! this.game.input.activePointer.y)
	  if (Phaser.Rectangle.contains(this.player.body, this.game.input.mousePointer.x, this.game.input.mousePointer.y))
        {
	  		this.player.body.velocity.setTo(0, 0);
	  	}
*/
	  
  	
    //collision between player and asteroids
    this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);

    //overlapping between player and collectables
    this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
  },
  generateCollectables: function() {
    this.collectables = this.game.add.group();

    //enable physics in them
    this.collectables.enableBody = true;
    this.collectables.physicsBodyType = Phaser.Physics.ARCADE;

    //phaser's random number generator
    var numCollectables = this.game.rnd.integerInRange(100, 150)
    var collectable;

    for (var i = 0; i < numCollectables; i++) {
      //add sprite
      collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
      collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
      collectable.animations.play('fly');
    }

  },
  generateAsteriods: function() {
    this.asteroids = this.game.add.group();
    
    //enable physics in them
    this.asteroids.enableBody = true;
    this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;

    //phaser's random number generator
    var numAsteroids = this.game.rnd.integerInRange(150, 200);
    var asteriod;

    for (var i = 0; i < numAsteroids; i++) {
      //add sprite
      asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
      asteriod.scale.setTo(this.game.rnd.integerInRange(10, 40)/10);

      //physics properties
      asteriod.body.velocity.x = this.game.rnd.integerInRange(-20, 20);
      asteriod.body.velocity.y = this.game.rnd.integerInRange(-20, 20);
      asteriod.body.immovable = true;
      asteriod.body.collideWorldBounds = true;
    }
  },
  hitAsteroid: function(player, asteroid) {
    //play explosion sound
    this.explosionSound.play();

    //make the player explode
    var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    emitter.makeParticles('playerParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);
    this.player.destroy();

    this.game.time.events.add(800, this.gameOver, this);
  },
  gameOver: function() {    
    //pass it the score as a parameter 
    this.game.state.start('MainMenu', true, false, this.playerScore);
  },
  collect: function(player, collectable) {
    //play collect sound
    this.collectSound.play();

    //update score
    this.playerScore++;
    this.scoreLabel.text = this.playerScore;

    //remove sprite
    collectable.destroy();
  },
  showLabels: function() {
    //score text
    var text = "0";
    var style = { font: "20px Arial", fill: "#fff", align: "center" };
    this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height - 50, text, style);
    this.scoreLabel.fixedToCamera = true;
  }
};

/*
TODO

-audio
-asteriod bounch
*/