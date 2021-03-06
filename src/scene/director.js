define(['require'], function(require) {'use strict';

  var root = require('root');
  var mixedice = require('mixedice');
  var $ = require('jquery');
  var EventMap = require('eventmap');
  var Scene = require('../scene');
  var Viewport = require('../viewport');

  /**
   * @module lyria/scene/director
   * @requires root
   * @requires mixedice
   * @requires jquery
   * @requires eventmap
   * @requires lyria/scene
   * @requires lyria/viewport 
   */

  /**
   * The scene director is the manager for all scenes
   *
   */
  return (function() {

    /**
     * The scene director constructor
     * Attaches a scene director to a container, the parent is optional
     *
     * @class
     * @alias module:lyria/scene/director
     * @augments EventMap
     * 
     * @fires module:lyria/scene/director#render
     * @fires module:lyria/scene/director#update
     *
     * @param {Viewport} [container]
     * @param {jQuery|String} [parent]
     */
    function SceneDirector(container, parent) {
      mixedice([this, SceneDirector.prototype], new EventMap());

      if ( container instanceof Viewport) {
        this.viewport = container;
      } else {
        this.viewport = new Viewport(container, {
          parent: parent
        });
      }

      /**
       * All scenes
       *
       * @member {Object} sceneList
       * @memberof module:lyria/scene/director
       */
      this.sceneList = {};

      /**
       * @member {String} className
       * @memberof module:lyria/scene/director
       */
      this.className = 'scene';

      /**
       * The current scene
       *
       * @member {Scene} currentScene
       * @memberof module:lyria/scene/director
       */
      this.currentScene = null;

      /**
       * The default scene
       *
       * @member {String} defaultScene
       * @memberof module:lyria/scene/director
       */
      this.defaultScene = null;

      /**
       * Event for rendering all scenes
       *  
       * @event module:lyria/scene/director#render
       */
      
      /**
       * Event for updating all scenes 
       *
       * @event module:lyria/scene/director#update
       * @property {Number} dt Delta time
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
     * @param {Object} scene
     * @param {Object} data
     */
    SceneDirector.prototype.add = function(scene, data, done) {

      // Shorthand to add all scenes to the scene director
      if (scene === '*' && this.scenes) {
        scene = Object.keys(this.scenes);
      }

      // Allow array as scenes
      if (Array.isArray(scene)) {
        for (var i = 0, j = scene.length; i < j; i++) {
          this.add(scene[i], data, done);
        }
        return;
      }

      // Handle string - Check in scene list
      if (this.scenes && Object.keys(this.scenes).length > 0 && this.scenes[scene]) {
        scene = this.scenes[scene](data);
      } else {
        // Scene object
        if ( scene instanceof Scene) {
          // Add to scenes if it's an actual scene
          if (data) {
            scene.data = data;
          }
          this.scenes[scene.name] = scene;
        } else {
          // Function
          if ( typeof scene === 'function') {
            var sceneObj = scene(data);

            this.scenes[sceneObj.name] = sceneObj;
          } else {
            // Well, if none of these - There is only one choice
            throw new Error('No valid scene found.');
          }
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

      scene.trigger('added', done);

      return this;
    };

    /**
     * Shows a specified scene
     *
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
      
      if (self.currentScene == null) {
        throw new Error('Scene ' + sceneName + ' not found.');
      }

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