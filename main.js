"use strict";
var game = new Phaser.Game(800, 600, Phaser.CANVAS);

//Creating the states
var MainMenu = function(game) {};
var Instruct = function(game) {};
var GamePlay = function(game) {};
var GameOver = function(game) {};
var counter = 0;
var musicCount = 0;

//MainMenu state
MainMenu.prototype = {
	initial: function() {
		console.log('MainMenu: initial');
		//initializing
		this.TitleOne;
	},

	preload: function() {
		console.log('MainMenu: preload');
		// preload assets
		game.load.image('sheet', 'assets/img/Background.png');
		game.load.image('ledge', 'assets/img/music-note.png');
		game.load.image('note', 'assets/img/noteTwo.png');
		game.load.atlas('player', 'assets/img/MHsprite.png', 'assets/img/MHsprite.json');
		game.load.path = 'assets/audio/';
			game.load.audio('pop', ['note.mp3']);
			game.load.audio('doHigh', ['doHigh.mp3']);
			game.load.audio('re', ['re.mp3']);
			game.load.audio('mi', ['mi.mp3']);
			game.load.audio('sol', ['sol.mp3']);
			game.load.audio('doLow', ['doLow.mp3']);
			game.load.audio('si', ['si.mp3']);
			game.load.audio('la', ['la.mp3']);
			game.load.audio('song', ['MoonlightSonata.mp3']);
	},

	create: function() {
		console.log('MainMenu: create');
		// place your assets
		game.stage.backgroundColor = "#d8bfd8";
		this.TitleOne = game.add.text(225,250, 'Music Hop', { font: '80px Pacifico', fill: '#ffffff', align: 'center'});
		this.tryAgain = game.add.text(250,350, 'Press SPACEBAR', { fontSize: '32px', fill: '#ffffff', align: 'center'});
	},

	update: function() {
		console.log('MainMenu: update');
		// run game loop
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			//changes the state to Instruct
			game.state.start('Instruct', true, false);
		}
	}
}
 
//instruction state where the instructions of the game are displayed for the player
Instruct.prototype = {
	initial: function() {
		console.log('Instruct: initial');
		//initializing
		this.instruction;
		this.textOne;
		this.textTwo;
	},

	preload: function() {
		console.log('Instruct: preload');
		// preload assets
		
	},

	create: function() {
		console.log('Instruct: create');
		// place your assets
		//Places text onto the screen for instructions
		game.stage.backgroundColor = "#0892d0";
		this.Title = game.add.text(240,250, 'Jump = SPACEBAR', { fontSize: '32px', fill: '#ffffff', align: 'center'});
		this.textOne = game.add.text(115,300, 'Jump from note to note to get points', { fontSize: '32px', fill: '#ffffff', align: 'center'});
		this.textTwo= game.add.text(95,450, 'Press SPACEBAR to Play', { fontSize: '50px', fill: '#ffffff', align: 'center'});
	},

	update: function() {
		console.log('Instruct: update');
		// run game loop
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			//changes the state to GamePlay
			game.state.start('GamePlay', true, false);
		}
	}
}

function noteGenerator() {
		//generates a new platform every 2.5 seconds
    	this.notes = new NoteBlock(game, 'note');
    	game.add.existing(this.notes);
    	this.notes.body.velocity.x = -75;
    	this.platforms.add(this.notes);
	}

//GamePlay state
GamePlay.prototype = {
	initial: function() {
		console.log('GamePlay: initial');
		this.sound;
		this.platforms;
		this.startNote;
		this.notes;
		this.player;
		this.hitPlatform;
		this.text;
		this.check = false;
		this.boundary;
		this.stop;
		this.checkEnd;
		this.song;
		this.background;
	},
	preload: function() {
		console.log('GamePlay: preload');
		// preload assets
	},

	create: function() {
		console.log('GamePlay: create');
		// Enables Arcade Physics System
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.boundary = game.add.group();
		this.boundary.enableBody = true;
		this.stop = this.boundary.create(0,580, 'ledge');
		this.stop.scale.setTo(2,2);
		this.stop.body.immovable = true;

		//Generate the background
		this.background = this.game.add.tileSprite(0, 
            0, 
            this.game.width, 
            this.game.height, 
            'sheet'
        );

		//adds the music and sounds into the game
		this.pop = game.add.audio('pop');
		this.doLow = game.add.audio('doLow');
		this.doHigh = game.add.audio('doHigh');
		this.re = game.add.audio('re');
		this.mi = game.add.audio('mi');
		this.sol = game.add.audio('sol');
		this.la = game.add.audio('la');
		this.si = game.add.audio('si');
		this.song = game.add.audio('song');
		this.song.play('', 0, 1, true);

		//prints out the score on the top left of the screen
		this.text = game.add.text(32, 32, 'Score: 0', { font: "32px Times New Roman", fill: "#000000", align: "left" });
    	this.text.anchor.setTo(0, 0);

		//generate the starting platform
		this.platforms = game.add.group();
		this.platforms.enableBody = true;
		this.startNote = this.platforms.create(50, 350, 'ledge');
		game.physics.arcade.enable(this.startNote);
		this.startNote.body.immovable = true;

		//creating the player and physics
		this.player = game.add.sprite(250, 250, 'player', 'walk1');
		game.physics.arcade.enable(this.player);
		this.player.body.bounce.y = 0.1;
		this.player.body.gravity.y = 550;
		this.player.body.collideWorldBounds = true;

		//player animations
		this.player.animations.add('run', Phaser.Animation.generateFrameNames('walk', 1, 4, '', 1), 10, true);
		this.player.animations.add('jump',Phaser.Animation.generateFrameNames('walk', 4, 4, '', 1), 10, true);

		//allows a event to occur every 2.5 seconds
		game.time.events.loop(2750,noteGenerator,this);
	},

	update: function() {
		console.log('GamePlay: update');
		// run game loop

		//allows user to land on platforms
		this.hitPlatform = game.physics.arcade.collide(this.player, this.platforms);
		this.startNote.body.velocity.x = -75;

		//changes the velocity of the player whether the character is in the air or not
		if(this.player.body.touching.down && this.hitPlatform){
			this.player.body.velocity.x = 75;
		}
		else{
			this.player.body.velocity.x = 0;
		}

		//allows animation of the player in idle
		this.player.animations.play('run');

		//Has a rotation of music notes that play when the player lands on a platform
		if(this.player.body.touching.down && this.check) {
			if(musicCount == 0)
			{
				this.doLow.play('',0,0.3,false);
				musicCount++;
			}
			else if(musicCount == 1)
			{
				this.re.play('',0,0.3,false);
				musicCount++;
			}
			else if(musicCount == 2)
			{
				this.mi.play('',0,0.3,false);
				musicCount++;
			}
			else if(musicCount == 3)
			{
				this.pop.play('',0,0.3,false);
				musicCount++;
			}
			else if(musicCount == 4)
			{
				this.sol.play('',0,0.3,false);
				musicCount++;
			}
			else if(musicCount == 5)
			{
				this.la.play('',0,0.3,false);
				musicCount++;
			}

			else if(musicCount == 6)
			{
				this.sol.play('',0,0.3,false);
				musicCount++;
			}
			else if(musicCount == 7)
			{
				this.pop.play('',0,0.3,false);
				musicCount++;
			}
			else if(musicCount == 8)
			{
				this.mi.play('',0,0.3,false);
				musicCount++;
			}
			else if(musicCount == 9)
			{
				this.re.play('',0,0.3,false);
				musicCount++;
			}
			else
			{
				this.doLow.play('',0,0.3,false);
				musicCount = 0;
			}

			//Updates the score every time the player lands on a platform
			this.check = false;
			counter++;
			this.text.text = 'Score: ' + counter;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.player.body.touching.down && this.hitPlatform)
			{
				//Allows the player to jump
				this.player.body.velocity.y = -450;
				this.check = true;
			}

		if(!this.player.body.touching.down)
		{
			//If the player is in the air, then play the jump animation
			this.player.animations.play('jump');
		}

		this.checkEnd = game.physics.arcade.collide(this.player, this.boundary)
		if(this.checkEnd){
			//changes the state and stops the music if the player hits the bottom of the screen
			game.state.start('GameOver', true, false);
			this.song.stop();
		}

		this.background.tilePosition.x -= 0.5;
	}
}

//GameOver state
GameOver.prototype = {
	initial: function() {
		console.log('GameOver: initial');
		//initializing
		this.Title;
		this.tryAgain;
		this.score;
		this.creditOne;
		this.songCredit;
		this.creator;
	},

	preload: function() {
		console.log('GameOver: preload');
		// preload assets
	},

	create: function() {
		console.log('GameOver: create');
		// place your assets
		//Adds text and score to GameOver state
		game.stage.backgroundColor = "#0892d0";
		this.scoreText = game.add.text(335,100, 'Your Score: ', {font: '28px Pacifico', fill: '#ffffff', align: 'center'});
		this.score = game.add.text(385,150, counter, {font: '64px Pacifico', fill: '#ffffff', align: 'center'});
		this.Title = game.add.text(250,250, 'Game Over', { font: '64px Pacifico', fill: '#ffffff', align: 'center'});
		this.tryAgain = game.add.text(200,350, 'Press SPACEBAR to try again', { font: '32px Pacifico', fill: '#ffffff', align: 'center'});
		this.creditOne = game.add.text(50,450, 'Character provided by Phaser Tutorial ', { font: '16px Pacifico', fill: '#ffffff', align: 'center'});
		this.songCredit = game.add.text(50,500, 'Song: Moonlight Sonata, by Beethoven ', { font: '16px Pacifico', fill: '#ffffff', align: 'center'});
		this.creator = game.add.text(335,550, 'Made by: Kristofer Torres ', {font: '28px Pacifico', fill: '#ffffff', align: 'center'});
	},

	update: function() {
		console.log('GameOver: update');
		// run game loop
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			//changes the state to GamePlay
			//Resets score and sound loop
			counter = -1;
			musicCount = 0;
			game.state.start('GamePlay', true, false);
		}
	}
}

//Adding the states
game.state.add('MainMenu', MainMenu);
game.state.add('Instruct', Instruct);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');