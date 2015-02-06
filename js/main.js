var game = game || {};

game.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

game.game.state.add('Boot', game.Boot);
game.game.state.add('Preload', game.Preload);
game.game.state.add('MainMenu', game.MainMenu);
game.game.state.add('Game', game.Game);

game.game.state.start('Boot');