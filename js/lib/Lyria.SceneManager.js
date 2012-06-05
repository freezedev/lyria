/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
var Lyria = Lyria || {};

/**
 * 
 */
Lyria.SceneManager = Lyria.Base.extend({
	sceneClassName: 'scene',
	sceneList: {},
	currentScene: null,
	add: function(scene) {
		Lyria.SceneManager.sceneList[scene.name] = scene;
	},
	show: function(scene) {
		// More than one scene visible at the same time
		if ($('.' + Lyria.SceneManager.sceneClassName + ':visible')) {
			$('.' + Lyria.SceneManager.sceneClassName).hide();
		}
		
		if(Lyria.SceneManager.currentScene) {
			if (Lyria.SceneManager.currentScene.transition && Lyria.SceneManager.currentScene.length) {
				$('#' + Lyria.SceneManager.currentScene).hide(Lyria.SceneManager.currentScene.transition.length, function() {
					$('.' + Lyria.SceneManager.sceneClassName).hide();
				});
			} else {
				$('.' + Lyria.SceneManager.sceneClassName).hide();
			}
			
			if (Lyria.SceneManager.currentScene.onSceneDeactivated) { Lyria.SceneManager.currentScene.onSceneDeactivated(); }

		}

		$.each(Lyria.SceneManager.sceneList, function(key, value) {
			if(key === scene) {
				
				if (scene.transition && scene.transition.length) {
					$('#' + scene).show(scene.transition.length);
				} else {
					$('#' + scene).show();
				}
				Lyria.SceneManager.currentScene = value;
				if (Lyria.SceneManager.currentScene.onSceneActive) { Lyria.SceneManager.currentScene.onSceneActive(); }
				return false;
			}
		});
	},
	connectRoutes: function(startScene) {
		if($.sammy) {

			var app = $.sammy(function() {

				var sammyContext = this;

				$.each(Lyria.SceneManager.sceneList, function(key, value) {
					if(value.route) {
						sammyContext.get(value.route, function() {
							Lyria.SceneManager.show(key);
						});
					}
				});

			});

			app.run('/' + startScene);

		}
	},
	render: function() {
		if(!Lyria.SceneManager.currentScene.render) {
			return;
		}
		Lyria.SceneManager.currentScene.render();
	},
	update: function(dt) {
		if(!Lyria.SceneManager.currentScene.update) {
			return;
		}
		Lyria.SceneManager.currentScene.update(dt);
	}
});
