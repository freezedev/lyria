define('mygame', ['lyria/game'], function(Game) {
  'use strict';
  
	var myGame = Game();
	
	myGame.director.add('scene1');
	myGame.director.add('scene2');
	
	myGame.director.show('scene1');
});