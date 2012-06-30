/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, undefined) {

	Lyria.SceneDirector = (function() {
		
		function SceneDirector(container) {
			this.containerObj = null;
						
			if (container) {			
				$('body').append($(document.createElement('div')).attr('id', container));
				
				this.containerObj = $('#' + container);
			}
			
		};
		
		// Properties
		SceneDirector.prototype.sceneClassName = 'scene';
		SceneDirector.prototype.sceneList = {};
		SceneDirector.prototype.currentScene = null;
		
		// Methods
		SceneDirector.prototype.add = function(scene, options) {
			
			var defaultOptions = {
				parent: this
			};
			options = $.extend(true, defaultOptions, options);
			
			var newScene = Lyria.Scene(scene, options);
			
			SceneDirector.prototype.sceneList[newScene.name] = newScene;
			
			if (this.containerObj) {
				this.containerObj.append($(document.createElement('div'))
										 .attr('id', newScene.name)
										 .attr('class', SceneDirector.prototype.sceneClassName));
			}
		};
		
		SceneDirector.prototype.show = function(scene) {
			// More than one scene visible at the same time
			if ($('.' + SceneDirector.prototype.sceneClassName + ':visible')) {
				$('.' + SceneDirector.prototype.sceneClassName).hide();
			}

			if (SceneDirector.prototype.currentScene) {
				if (SceneDirector.prototype.currentScene.transition && SceneDirector.prototype.currentScene.length) {
					$('#' + SceneDirector.prototype.currentScene).hide(SceneDirector.prototype.currentScene.transition.length, function() {
						$('.' + SceneDirector.prototype.sceneClassName).hide();
					});
				} else {
					$('.' + SceneDirector.prototype.sceneClassName).hide();
				}

				if (SceneDirector.prototype.currentScene.onSceneDeactivated) {
					SceneDirector.prototype.currentScene.onSceneDeactivated();
				}

			}

			$.each(SceneDirector.prototype.sceneList, function(key, value) {
				if (key === scene) {

					if (scene.transition && scene.transition.length) {
						$('#' + scene).show(scene.transition.length);
					} else {
						$('#' + scene).show();
					}
					SceneDirector.prototype.currentScene = value;
					if (SceneDirector.prototype.currentScene.onSceneActive) {
						SceneDirector.prototype.currentScene.onSceneActive();
					}
					return false;
				}
			});
		};
		
		SceneDirector.prototype.render = function() {
			if (!SceneDirector.prototype.currentScene.render) {
				return;
			}
			SceneDirector.prototype.currentScene.render();
		};
		
		SceneDirector.prototype.update = function(dt) {
			if (!SceneDirector.prototype.currentScene.update) {
				return;
			}
			SceneDirector.prototype.currentScene.update(dt);
		}
		
		return SceneDirector;
		
	})();

	/**
	 *
	 */
	/*Lyria.SceneDirector = Lyria.Base.extend({
		sceneClassName: 'scene',
		sceneList: {},
		currentScene: null,
		add: function(scene) {
			Lyria.SceneDirector.sceneList[scene.name] = scene;
		},
		show: function(scene) {
			// More than one scene visible at the same time
			if ($('.' + Lyria.SceneDirector.sceneClassName + ':visible')) {
				$('.' + Lyria.SceneDirector.sceneClassName).hide();
			}

			if (Lyria.SceneDirector.currentScene) {
				if (Lyria.SceneDirector.currentScene.transition && Lyria.SceneDirector.currentScene.length) {
					$('#' + Lyria.SceneDirector.currentScene).hide(Lyria.SceneDirector.currentScene.transition.length, function() {
						$('.' + Lyria.SceneDirector.sceneClassName).hide();
					});
				} else {
					$('.' + Lyria.SceneDirector.sceneClassName).hide();
				}

				if (Lyria.SceneDirector.currentScene.onSceneDeactivated) {
					Lyria.SceneDirector.currentScene.onSceneDeactivated();
				}

			}

			$.each(Lyria.SceneDirector.sceneList, function(key, value) {
				if (key === scene) {

					if (scene.transition && scene.transition.length) {
						$('#' + scene).show(scene.transition.length);
					} else {
						$('#' + scene).show();
					}
					Lyria.SceneDirector.currentScene = value;
					if (Lyria.SceneDirector.currentScene.onSceneActive) {
						Lyria.SceneDirector.currentScene.onSceneActive();
					}
					return false;
				}
			});
		},
		connectRoutes: function(startScene) {
			if ($.sammy) {

				var app = $.sammy(function() {

					var sammyContext = this;

					$.each(Lyria.SceneDirector.sceneList, function(key, value) {
						if (value.route) {
							sammyContext.get(value.route, function() {
								Lyria.SceneDirector.show(key);
							});
						}
					});

				});

				app.run('/' + startScene);

			}
		},
		render: function() {
			if (!Lyria.SceneDirector.currentScene.render) {
				return;
			}
			Lyria.SceneDirector.currentScene.render();
		},
		update: function(dt) {
			if (!Lyria.SceneDirector.currentScene.update) {
				return;
			}
			Lyria.SceneDirector.currentScene.update(dt);
		}
	});*/

})(window.Lyria = window.Lyria || {});
