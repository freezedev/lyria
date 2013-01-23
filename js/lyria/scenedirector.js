/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, $, undefined) {
	'use strict';

	/**
	 * The scene director is the manager for all scenes
	 *  
	 */
	Lyria.SceneDirector = (function() {
		
		function SceneDirector(container, parent) {
			this.containerObj = null;
						
			if (container) {
				
				if ($('#' + container).length > 0) {
					this.containerObj = $('#' + container);
				} else {
					var createdElement = $(document.createElement('div')).attr('id', container);
					
					if (parent) {
						$(parent).prepend(createdElement);
					} else {
						$('body').prepend(createdElement);
					}
					
					this.containerObj = $('#' + container);
				}
			}
			
		};
		
		// Properties
		SceneDirector.prototype.sceneClassName = 'scene';
		SceneDirector.prototype.sceneList = {};
		SceneDirector.prototype.currentScene = null;
		SceneDirector.prototype.onSceneChange = function(scene) {};
		
		// Methods
		SceneDirector.prototype.add = function(scene, options) {
			
			var defaultOptions = {
				parent: this
			};
			options = $.extend(true, defaultOptions, options);
			
			var newScene = Lyria.Scene(scene, options);
			
			SceneDirector.prototype.sceneList[newScene.name] = newScene;
			
			if (this.containerObj) {
				if ($('#' + newScene.name).length === 0) { 
					this.containerObj.prepend($(document.createElement('div'))
											 .attr('id', newScene.name)
											 .attr('class', SceneDirector.prototype.sceneClassName));
				}
			}
			
			return this;
		};
		
		SceneDirector.prototype.show = function(scene, options, callback) {
			
			if (SceneDirector.prototype.onSceneChange) {
				SceneDirector.prototype.onSceneChange(scene);
			}
			
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

				if (SceneDirector.prototype.currentScene.onDeactivated) {
					SceneDirector.prototype.currentScene.onDeactivated(options);
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
					if (SceneDirector.prototype.currentScene.onActive) {
						SceneDirector.prototype.currentScene.onActive(options);
					}
					
					if (callback)
						callback(scene);
					
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

})(this.Lyria = this.Lyria || {}, this.jQuery);
