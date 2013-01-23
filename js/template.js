;(function(global, Lyria, undefined) {
	
	var director = new Lyria.SceneDirector('viewport');
	director.add('scene1');
	director.add('scene2');
	
	director.show('scene1');
	
})(this, Lyria);
