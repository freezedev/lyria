/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/scene/director', ['root', 'jquery', 'lyria/scene', 'lyria/viewport'], function(root, $, Scene, Viewport) {
  'use strict';
  
  /**
   * The scene director is the manager for all scenes
   *
   */
  return (function() {

    function SceneDirector(container, parent) {

      if ( container instanceof Viewport) {
        this.viewport = container;
      } else {
        this.viewport = new Viewport(container, parent);
      }

      this.sceneList = {};
      this.currentScene = null;
      this.onSceneChange = function(scene) {
      };

    }

    // Properties
    SceneDirector.prototype.sceneClassName = 'scene';
    
    // Methods
    SceneDirector.prototype.add = function(scene, options) {

      if (!( scene instanceof Scene)) {
        if (this.precompiledScenes) {
          scene = this.precompiledScenes[scene];
        } else {
          throw 'No valid scene found.';
        }
      }

      scene.parent = this;
      this.sceneList[scene.name] = scene;

      if (this.viewport.$container) {
        if ($('#' + scene.name).length === 0) {
          this.viewport.$container.prepend($(root.document.createElement('div')).attr('id', scene.name).attr('class', SceneDirector.prototype.sceneClassName));

          if (scene.content) {
            $('#' + scene.name).html(scene.content);
          }

          // Bind events
          if (scene.events && !$.isEmptyObject(scene.events)) {
            $.each(scene.events, function(key, value) {
              if (( typeof value === 'object') && (key !== 'delegate')) {
                $(scene.events.delegate).on(value, key, {
                  scene: scene
                });
              }
            });
          }
        }
      }

      return this;
    };

    SceneDirector.prototype.show = function(scene, options, callback) {

      if (this.onSceneChange) {
        this.onSceneChange(scene);
      }

      // More than one scene visible at the same time
      if ($('.' + SceneDirector.prototype.sceneClassName + ':visible')) {
        $('.' + SceneDirector.prototype.sceneClassName).hide();
      }

      if (this.currentScene) {
        if (this.currentScene.transition && this.currentScene.length) {
          $('#' + this.currentScene).hide(this.currentScene.transition.length, function() {
            $('.' + SceneDirector.prototype.sceneClassName).hide();
          });
        } else {
          $('.' + SceneDirector.prototype.sceneClassName).hide();
        }

        if (this.currentScene.onDeactivated) {
          this.currentScene.onDeactivated(options);
        }

      }

      $.each(this.sceneList, function(key, value) {
        if (key === scene) {

          if (scene.transition && scene.transition.length) {
            $('#' + scene).show(scene.transition.length);
          } else {
            $('#' + scene).show();
          }
          this.currentScene = value;
          if (this.currentScene.onActive) {
            this.currentScene.onActive(options);
          }

          if (callback)
            callback(scene);

          return false;
        }
      });
    };

    SceneDirector.prototype.render = function() {
      if (!this.currentScene.render) {
        return;
      }
      this.currentScene.render();
    };

    SceneDirector.prototype.update = function(dt) {
      if (!this.currentScene.update) {
        return;
      }
      this.currentScene.update(dt);
    };

    return SceneDirector;

  })();
});
