Lyria.Achievements = function()
{
	
}();


Lyria.SceneManager = function()
{
	var
	_scenes = null,
	
	add = function(scene)
	{
		
	},
	
	currentScene = function(scene)
	{
		if (typeof(scene) === "undefined")
			;
	},
	
	render = function()
	{
		if (typeof(currentScene().render()) === "undefined") return; 
		
		if (typeof(currentScene().render()) == "function") currentScene().render();
	},
	
	update = function(dt)
	{
		if (typeof(currentScene().update(dt)) === "undefined") return; 
		
		if (typeof(currentScene().update(dt)) == "function") currentScene().update(dt);
	};
	
	return {
		add: add,
		currentScene: currentScene,
		render: render,
		update: update
	};
}();
