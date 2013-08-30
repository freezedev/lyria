/**
 * @module Lyria
 */
define('lyria/scene', ['jquery', 'mixer', 'nexttick', 'eventmap', 'lyria/gameobject', 'lyria/language', 'lyria/template/string', 'lyria/log', 'lyria/mixer/language'], function($, mixer, nextTick, EventMap, GameObject, Language, templateString, Log, langMixin) {'use strict';

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

      if ( typeof sceneDeps === 'function') {
        options = sceneFunction;
        sceneFunction = sceneDeps;
        sceneDeps = [];
      }

      // Mixin event map into Scene
      mixer(Scene.prototype, new EventMap('scene:' + sceneName));

      // We need a reference to the scene not being this
      var self = this;

      // Set name
      this.name = sceneName;

      this.async = false;

      // Default values
      this.localization = {};
      
      var langValue = Language.language;
      
      langMixin(self, langValue, self);

      this.template = {};
      this.template.source = '';
      this.template.helpers = {};
      this.template.partials = {};
      // Collect all template values
      this.template.data = {};

      // Add default helpers
      this.template.helpers['translate'] = this.t;

      this.children = this.children || {};
      this.children.gameObjects = {};
      this.children.prefabs = {};

      // Expose function for template values
      this.expose = function(obj) {
        if (!obj || $.isEmptyObject(obj)) {
          return;
        }

        self.template.data = $.extend(true, self.template.data, obj);
      };

      Object.defineProperty(self, '$element', {
        get: function() {
          return $('#' + self.name);
        }
      });

      self.on('added', function() {
        self.refresh();

        if (self.events) {
          if (options && options.isPrefab) {
            self.events.delegate = (options.target) ? options.target : 'body';
          } else {
            self.events.delegate = '#' + sceneName;
          }
        }

        self.on('update', function(dt) {
          $.each(self.children, function(childKey, childValue) {
            if (!$.isEmptyObject(childValue)) {
              $.each(childValue, function(key, value) {
                value.trigger('update', dt);
              });
            }
          });
        });

        // Bind events
        if (self.events && !$.isEmptyObject(self.events)) {
          $.each(self.events, function(key, value) {
            if (( typeof value === 'object') && (key !== 'delegate')) {
              $(self.events.delegate).on(value, key, {
                scene: self
              });
            }
          });
        }

        // Data binding
        if (self.template.data && !$.isEmptyObject(self.template.data)) {
          $('#' + self.name + ' [data-bind]').each(function() {
            var $dataElem = $(this);

            var prop = $dataElem.data('bind');

            self.template.data.watch(prop, function(id, oldval, newval) {
              if (oldval !== newval) {
                $dataElem.html(newval);
              }

              return newval;
            });
          });
        }
      });

      var createScene = function(LyriaObject, deps) {
        if (deps == null) {
          deps = [];
        }

        var sceneDone = function(err, success) {
          if (err) {
            return console.error('Error while executing scene ' + self.name + ': ' + err);
          }

          if (self.isAsync) {
            self.trigger('added');
          }
        };

        var async = false;

        var context = self;
        context.async = function() {
          async = true;

          return function() {
            nextTick(function() {
              sceneDone();
            });
          };
        };

        Object.defineProperty(self, 'isAsync', {
          get: function() {
            return async;
          }
        });

        // TODO: Evaluate how to show dependencies (concat into array, array with
        // objects of name and value)
        try {
          var success = sceneFunction.apply(context, [context, LyriaObject].concat(deps));

          if (!async) {
            sceneDone(null, success);
          }
        } catch (e) {
          sceneDone(e);
        }
      };

      // Call scene
      require(['lyria/achievements', 'lyria/log', 'lyria/component', 'lyria/gameobject', 'lyria/events', 'lyria/resource', 'lyria/loop'], function(Achievements, Log, Component, GameObject, Events, Resource, Loop) {
        var LyriaObject = {
          Achievements: Achievements,
          Log: Log,
          Component: Component,
          GameObject: GameObject,
          Events: Events,
          Resource: Resource,
          Loop: Loop
        };

        if (sceneDeps.length > 0) {
          require(sceneDeps, function() {
            createScene(LyriaObject, [].slice.call(arguments, 0));
          });
        } else {
          createScene(LyriaObject);
        }
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

          $.each(self.children.gameObjects, function(key, value) {
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

          $.each(self.children.gameObjects, function(key, value) {
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
        this.content = this.template.source(val, {partials: this.template.partials, helpers: {}});
      }

      if (this.$element.length > 0) {
        this.$element.html(this.content);
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
        if ( typeof eventFunction === 'function') {
          this.events[selector] = {};
          this.events[selector][eventName] = eventFunction;
        } else {
          return this.events[selector][eventName];
        }
      }
    };

    /**
     * Gets localized value
     *
     * @param {Object} lang
     */
    Scene.prototype.t = function(name, parameter) {
      var self = this;

      if (this.localization && this.localization[this.language]) {
        if (this.localization[this.language][name] == null) {
          return '[[Missing localization for ' + name + ']]';
        }

        if ( typeof this.localization[this.language][name] === 'string') {
          return templateString.process(this.localization[this.language][name], parameter);
        } else {
          return {
            plural: function(n) {
              if (self.localization[this.language][name][n]) {
                return templateString.process(self.localization[self.language][name][n], parameter);
              } else {
                return templateString.process(self.localization[self.language][name]['n'], parameter);
              }
            }
          };
        }
      }
    };

    /**
     * Logging directly from the scene
     *
     * @param {Object} text
     */
    Scene.prototype.log = function(text) {
      Log.i('Scene ' + this.name + ': ' + text);
    };

    return Scene;

  })();

  return Scene;

});
