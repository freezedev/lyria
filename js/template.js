;(function(global, Lyria, undefined) {
	
	var myGame = new Lyria.Game();
	
	myGame.director = new Lyria.SceneDirector('viewport');
	myGame.director.add('scene1');
	myGame.director.add('scene2');
	
	myGame.director.show('scene1');
	
	global.myGame = myGame;
	
})(this, Lyria);
