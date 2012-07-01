/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, undefined) {


	/**
	 * The scene director is the manager for all scenes
	 *  
	 */
	Lyria.SceneDirector = (function() {
		
		function SceneDirector(container, parent) {
			this.containerObj = null;
						
			if (container) {
				var createdElement = $(document.createElement('div')).attr('id', container);
				
				if (parent) {
					$(parent).append(createdElement);
				} else {
					$('body').append(createdElement);
				}
				
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

})(window.Lyria = window.Lyria || {});
