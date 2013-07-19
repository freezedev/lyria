/**
 * @module Lyria
 */
define('lyria/scene', ['isemptyobject', 'each', 'extend', 'clone', 'mixin', 'lyria/eventmap', 'lyria/gameobject'], function(isEmptyObject, each, extend, clone, mixin, EventMap, GameObject) {'use strict';

  var Scene = (function() {

    /**
     * Scene constructor
     *
     * @class Scene
     * @constructor
     */
    var Scene = function(sceneName, sceneDeps, sceneFunction, options) {
      if (!sceneName) {
        return;
      }
      
      if (typeof sceneDeps === 'function') {
        sceneFunction = sceneDeps;
        sceneDeps = [];
      }

      // Mixin event map into Scene
      mixin(Scene.prototype, new EventMap('scene:' + sceneName));

      // We need a reference to the scene not being this
      var self = this;

      // Set name
      this.name = sceneName;

      this.async = false;

      // Default values
      this.localization = {};

      this.template = {};
      this.template.source = '';
      // Collect all template values
      this.template.data = {};

      this.children = this.children || {};
      this.children.gameObjects = {};
      this.children.prefabs = {};

      // Expose function for template values
      this.expose = function(obj) {
        if (!obj || isEmptyObject(obj)) {
          return;
        }

        self.template.data = extend(true, self.template.data, obj);
      };

      // Call scene
      require(['lyria/achievements', 'lyria/log', 'lyria/component', 'lyria/gameobject', 'lyria/events', 'lyria/resource', 'lyria/data/store'], function(Achievements, Log, Component, GameObject, Events, Resource, DataStore) {
        var LyriaObject = {
          Achievements: Achievements,
          Log: Log,
          Component: Component,
          GameObject: GameObject,
          Events: Events,
          Resource: Resource,
          DataStore: DataStore
        };
        
        sceneFunction.apply(self, [self, LyriaObject]);

        self.refresh();

        if (self.events) {
          if (options && options.isPrefab) {
            self.events.delegate = (options.target) ? options.target : 'body';
          } else {
            self.events.delegate = '#' + sceneName;
          }
        }

        self.on('update', function(dt) {
          each(self.children, function(childKey, childValue) {
            if (!isEmptyObject(childValue)) {
              each(childValue, function(key, value) {
                value.trigger('update', dt);
              });
            }
          });
        });
      });

    };

    /**
     * Adds a gameobject to the scene
     *
     * @method add
     * @param {Object} child
     */
    Scene.prototype.add = function(child) {
      var self = this;

      if ( child instanceof GameObject) {
        this.children.gameObjects[child.name] = child;

        this.template.data.gameobject = (function() {
          var array = [];

          each(self.children.gameObjects, function(key, value) {
            array.push(value);
          });

          return array;
        })();

        this.trigger('add');

        return true;
      }

      if ( child instanceof GameObject) {
        this.children.prefabs[child.name] = child;

        this.template.data.gameobject = (function() {
          var array = [];

          each(self.children.gameObjects, function(key, value) {
            array.push(value);
          });

          return array;
        })();

        this.trigger('add');

        return true;
      }

      return false;
    };

    /**
     * Refreshes the scene (Re-renders the template)
     *
     * @method refresh
     * @param {Object} val
     */
    Scene.prototype.refresh = function(val) {
      if (val == null && this.template) {
        val = this.template.data;
      }

      if (this.template && this.template.source) {
        this.content = this.template.source(val);
      }

      this.trigger('refresh');
    };

    /**
     *  Sets an event to the event object or returns a specified event
     *  
     * @method event
     * @param {String} selector
     * @param {String} eventName
     * @param {Function} eventFunction
     */
    Scene.prototype.event = function(selector, eventName, eventFunction) {
      if (selector == null) {
        return;
      }
      
      if (eventName == null) {
        return this.events[selector];
      } else {
        if (typeof eventFunction === 'function') {
          this.events[selector] = {};
          this.events[selector][eventName] = eventFunction;
        } else {
          return this.events[selector][eventName];
        }
      }
    };

    return Scene;

  })();

  return Scene;

}); 