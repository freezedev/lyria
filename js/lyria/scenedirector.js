/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(window, document, Lyria, $, undefined) {
  'use strict';

  /**
   * The scene director is the manager for all scenes
   *  
   */
  Lyria.SceneDirector = (function() {
    
    function SceneDirector(container, parent) {
      
      if (container instanceof Lyria.Viewport) {
        this.viewport = container;
      } else {
        this.viewport = new Lyria.Viewport(container, parent);
      }
      
      this.sceneList = {};
      this.currentScene = null;
      this.onSceneChange = function(scene) {};
      
    }
    
    // Properties
    SceneDirector.prototype.sceneClassName = 'scene';
    
    // Methods
    SceneDirector.prototype.add = function(scene, options) {
      
      if (!(scene instanceof Lyria.Scene)) {
        if (Lyria.Scenes[scene]) {
          scene = Lyria.Scenes[scene];          
        } else {
          throw 'No valid scene found.';
        }        
      }
      
      scene.parent = this;
      this.sceneList[scene.name] = scene;
      
      if (this.viewport.$container) {
        if ($('#' + scene.name).length === 0) { 
          this.viewport.$container.prepend($(document.createElement('div'))
                       .attr('id', scene.name)
                       .attr('class', SceneDirector.prototype.sceneClassName));
                       
          if (scene.content) {
            $('#' + scene.name).html(scene.content);
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

})(this, this.document, this.Lyria = this.Lyria || {}, this.jQuery);
