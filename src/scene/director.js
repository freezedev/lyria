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
      mixer(SceneDirector.prototype, new EventMap());

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
       * The current scene
       *
       * @property currentScene
       * @type {Scene}
       */
      this.currentScene = null;

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

    // Properties
    SceneDirector.prototype.sceneClassName = 'scene';

    // Methods

    /**
     * Adds a scene to the scene director
     *
     * @method add
     * @param {Object} scene
     * @param {Object} options
     */
    SceneDirector.prototype.add = function(scene, options) {

      if (!( scene instanceof Scene)) {
        if (this.scenes && !$.isEmptyObject(this.scenes)) {
          scene = this.scenes[scene];
        } else {
          // TODO: Don't throw a string. Throw an error
          throw 'No valid scene found.';
        }
      }

      scene.parent = this;
      
      // Update reference to the game itself
      if (this.parent != null) {
        scene.game = this.parent;
      }
      
      this.sceneList[scene.name] = scene;

      if (this.viewport.$element) {
        if ($('#' + scene.name).length === 0) {
          this.viewport.$element.prepend($(root.document.createElement('div')).attr('id', scene.name).attr('class', SceneDirector.prototype.sceneClassName));

          if (!scene.isAsync) {
            scene.trigger('added');
          }

        }
      }

      return this;
    };

    /**
     * Shows a specified scene
     *
     * @method show
     * @param {String} scene
     * @param {Object} options
     * @param {Function} callback
     */
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
