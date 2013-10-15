/**
 * @module Lyria
 * @submodule Scene
 */
define('lyria/scene/director', ['root', 'mixer', 'jquery', 'eventmap', 'lyria/scene', 'lyria/viewport'], function(root, mixer, $, EventMap, Scene, Viewport) {'use strict';

  /**
   * The scene director is the manager for all scenes
   *
   */
  return (function() {

    /**
     * The scene director constructor
     * Attaches a scene director to a container, the parent is optional
     *
     * @class Director
     * @constructor
     *
     * @param {Object} container
     * @param {Object} parent
     */
    function SceneDirector(container, parent) {
      mixer([this, SceneDirector.prototype], new EventMap());

      if ( container instanceof Viewport) {
        this.viewport = container;
      } else {
        this.viewport = new Viewport(container, {parent: parent});
      }

      /**
       * All scenes
       *
       * @property sceneList
       * @type {Object}
       */
      this.sceneList = {};
      
      /**
       * @property className
       * @type {String} 
       */
      this.className = 'scene';

      /**
       * The current scene
       *
       * @property currentScene
       * @type {Scene}
       */
      this.currentScene = null;
      
      /**
       * The default scene
       * 
       * @property defaultScene
       * @type {String} 
       */
      this.defaultScene = null;

      /**
       * Define events for scene director
       *
       */
      this.on('render', function() {
        if (this.currentScene) {
          this.currentScene.trigger('render');
        }
      });

      this.on('update', function(dt) {
        if (this.currentScene) {
          this.currentScene.trigger('update', dt);
        }
      });
    }


    /**
     * Adds a scene to the scene director
     *
     * @method add
     * @param {Object} scene
     * @param {Object} options
     */
    SceneDirector.prototype.add = function(scene, options) {
      
      // Shorthand to add all scenes to the scene director
      if (scene === '*' && this.scenes) {
        scene = Object.keys(this.scenes);
      }
      
      // Allow array as scenes
      if (Array.isArray(scene)) {
        for (var i = 0, j = scene.length; i < j; i++) {
          this.add(scene[i], options);
        }
        
        return;
      }

      if (scene instanceof Scene) {
        // Add to scenes if it's an actual scene
        this.scenes[scene.name] = scene;        
      } else {
        // Handle string
        if (this.scenes && Object.keys(this.scenes).length > 0) {
          scene = this.scenes[scene];
        } else {
          throw new Error('No valid scene found.');
        }
      }

      // Set scene parent
      scene.parent = this;
      
      // Update reference to the game itself
      if (this.parent != null) {
        scene.game = this.parent;
      }

      // Add first scene as a default scene      
      if (Object.keys(this.sceneList).length === 0) {
        this.defaultScene = scene.name;
      }

      // Set scene in sceneList
      this.sceneList[scene.name] = scene;

      if (this.viewport.$element) {
        if ($('#' + scene.name).length === 0) {
          this.viewport.$element.prepend($(root.document.createElement('div')).attr('id', scene.name).attr('class', this.className));
        }
      }
      
      scene.trigger('added');
          
      return this;
    };

    /**
     * Shows a specified scene
     *
     * @method show
     * @param {String} scene name of scene
     * @param {Object} options
     * @param {Function} callback
     */
    SceneDirector.prototype.show = function(sceneName, options, callback) {
      if (!sceneName) {
        return;
      }
      
      // More than one scene visible at the same time
      if ($('.' + this.className + ':visible')) {
        $('.' + this.className).hide();
      }

      if (this.currentScene) {
        if (this.currentScene.transition && this.currentScene.length) {
          $('#' + this.currentScene).hide(this.currentScene.transition.length, function() {
            $('.' + this.className).hide();
          });
        } else {
          $('.' + this.className).hide();
        }

        this.currentScene.trigger('deactivate', options);
      }

      var self = this;

      self.currentScene = this.sceneList[sceneName];
      
      if (self.currentScene.transition && self.currentScene.transition.length) {
        $('#' + sceneName).show(self.currentScene.transition.length);
      } else {
        $('#' + sceneName).show();
      }
      this.trigger('scene:change', sceneName);
      self.currentScene.trigger('active', options);
      
      if (callback) {
        callback(sceneName);
      }
    };

    /**
     * Refreshes a scene
     *
     * @method refresh
     * @param {String} scene
     */
    SceneDirector.prototype.refresh = function(scene) {
      var sceneObj = (scene) ? this.sceneList[scene] : this.currentScene;

      // Re-compile scene template
      sceneObj.refresh();
    };

    return SceneDirector;

  })();
});