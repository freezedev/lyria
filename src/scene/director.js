/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/scene/director', ['root', 'mixin', 'jquery', 'lyria/eventmap', 'lyria/scene', 'lyria/viewport'], function(root, mixin, $, EventMap, Scene, Viewport) {
  'use strict';
  
  /**
   * The scene director is the manager for all scenes
   *
   */
  return (function() {

    function SceneDirector(container, parent) {
      mixin(SceneDirector.prototype, new EventMap());

      if ( container instanceof Viewport) {
        this.viewport = container;
      } else {
        this.viewport = new Viewport(container, parent);
      }

      this.sceneList = {};
      this.currentScene = null;
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
      this.trigger('scene:change', scene);

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

        this.currentScene.trigger('deactivate', options);
      }
      
      var self = this;

      $.each(this.sceneList, function(key, value) {
        if (key === scene) {

          if (scene.transition && scene.transition.length) {
            $('#' + scene).show(scene.transition.length);
          } else {
            $('#' + scene).show();
          }
          
          self.currentScene = value;
          
          self.currentScene.trigger('active', options);

          if (callback) {
            callback(scene);            
          }

          return false;
        }
      });
    };
    
    SceneDirector.prototype.refresh = function(scene) {
      var sceneObj = (scene) ? this.sceneList[scene] : this.currentScene;
      
      // Re-compile scene template
      sceneObj.compileTemplate();
      
      if (sceneObj.content) {
        $('#' + sceneObj.name).html(sceneObj.content);
      }
    };

    SceneDirector.prototype.render = function() {
      this.currentScene.trigger('render');
    };

    SceneDirector.prototype.update = function(dt) {
      this.currentScene.trigger('update', dt);
    };

    return SceneDirector;

  })();
});
