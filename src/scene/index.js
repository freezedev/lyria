/**
 * @module Lyria
 */
define('lyria/scene', ['jquery', 'mixer', 'nexttick', 'eventmap', 'lyria/gameobject', 'lyria/language', 'lyria/template/string', 'lyria/log', 'lyria/mixin/language'], function($, mixer, nextTick, EventMap, GameObject, Language, templateString, Log, langMixin) {'use strict';

  var createNamespace = function(obj, chain, value) {
    var chainArr = chain.split('.');

    for (var i = 0, j = chainArr.length; i < j; i++) {
      (function(item, lastElem) {
        if (lastElem) {
          obj[item] = value;
        } else {
          obj[item] = obj[item] || {};
        }

        obj = obj[item];
      })(chainArr[i], i === j - 1);
    }
  };

  // TODO: Move this into localization API when refactored
  var localizedElement = function(localization, language) {
    return function(name, parameter) {
      if (localization && localization[language]) {
        if (localization[language][name] == null) {
          return '[[Missing localization for ' + name + ']]';
        }

        if ( typeof localization[language][name] === 'string') {
          return templateString.process(localization[language][name], parameter);
        } else {
          return {
            plural: function(n) {
              if (self.localization[language][name][n]) {
                return templateString.process(self.localization[self.language][name][n], parameter);
              } else {
                return templateString.process(self.localization[self.language][name]['n'], parameter);
              }
            }
          };
        }
      }
    };
  };

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
      // Sender: "scene:#{sceneName}"
      mixer(Scene.prototype, new EventMap());

      // We need a reference to the scene not being this
      var self = this;

      // Set name
      this.name = sceneName;

      this.async = false;

      // Default values
      this.localization = {};
      
      // Default event value
      this.defaultEvent = 'click';

      var langValue = Language.language;

      langMixin(self, langValue, self);

      this.template = {};
      this.template.source = '';
      this.template.helpers = {};
      this.template.partials = {};
      // Collect all template values
      this.template.data = {};

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

        if (self.DOMEvents) {
          if (options && options.isPrefab) {
            self.DOMEvents.delegate = (options.target) ? options.target : 'body';
          } else {
            self.DOMEvents.delegate = '#' + sceneName;
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
        if (self.DOMEvents && !$.isEmptyObject(self.DOMEvents)) {
          $.each(self.DOMEvents, function(key, value) {
            if (( typeof value === 'object') && (key !== 'delegate')) {
              $(self.DOMEvents.delegate).on(value, key, {
                scene: self
              });
            }
          });
        }

        // Data binding
        // TODO: Find a better way than using Object.watch
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

        context.modules = LyriaObject;

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
      var reqModules = Object.keys(Scene.requireAlways) || [];

      require(reqModules, function() {
        var importedModules = {};

        for (var i = 0, j = arguments.length; i < j; i++) {
          (function(dep) {
            createNamespace(importedModules, Scene.requireAlways[reqModules[i]], dep);
          })(arguments[i]);
        }

        if (Array.isArray(sceneDeps)) {
          if (sceneDeps.length > 0) {
            require(sceneDeps, function() {
              createScene(importedModules, [].slice.call(arguments, 0));
            });
          } else {
            createScene(importedModules);
          }
        } else {
          sceneDeps = sceneDeps || {};
          var reqSceneModules = Object.keys(sceneDeps) || [];

          require(reqSceneModules, function() {

            for (var k = 0, l = arguments.length; k < l; k++) {
              (function(sceneDep) {
                createNamespace(importedModules, sceneDeps[reqSceneModules[j]], sceneDep);
              })(arguments[j]);
            }

            createScene(importedModules);
          });
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
      
      // Add default helpers
      this.template.helpers['translate'] = localizedElement(this.localization, this.language);

      if (this.template && this.template.source) {
        this.content = this.template.source(val, {
          partials: this.template.partials,
          helpers: this.template.helpers
        });
      }

      if (this.$element.length > 0) {
        this.$element.html(this.content);
      }

      this.trigger('refresh');
    };    
    
    /**
     * Sets an event to the event object (DOM events)
     * TODO: Not completely happy with the function name
     *
     * @method bindEvent
     * @param {String} selector
     * @param {String} eventName
     * @param {Function} eventFunction
     */
    Scene.prototype.bindEvent = function(selector, eventName, eventFunction) {
      if (selector == null) {
        return;
      }
      
      if (typeof selector === 'object') {
        this.DOMEvents = selector;
      }
      
      if (typeof eventName === 'function') {
        this.DOMEvents[selector][this.defaultEvent] = eventFunction;
      } else {
        this.DOMEvents[selector][eventName] = eventFunction;
      }
    };
    
    /*
     * Unbinds a previously bound event
     * 
     * @method unbindEvent
     * @param {String} selector
     * @param {String} eventName
     * @param {Function} eventFunction
     */
    Scene.prototype.unbindEvent = function(selector, eventName) {
      if (selector == null) {
        return;
      }
      
      if (eventName == null) {
        delete this.DOMEvents[selector];
      } else {
        delete this.DOMEvents[selector][eventName];
      }
    };

    /**
     * Gets localized value
     *
     * @param {Object} lang
     */
    Scene.prototype.t = function() {
      return localizedElement(this.localization, this.language).apply(this, arguments);
    };

    /**
     * Logging directly from the scene
     *
     * @param {Object} text
     */
    Scene.prototype.log = function(text) {
      Log.i('Scene ' + this.name + ': ' + text);
    };

    Scene.requireAlways = {
      'lyria/audio': 'Lyria.Audio',
      'lyria/achievement/manager': 'Lyria.AchievementManager',
      'lyria/log': 'Lyria.Log',
      'lyria/component': 'Lyria.Component',
      'lyria/gameobject': 'Lyria.GameObject',
      'lyria/events': 'Lyria.Events',
      'lyria/resource': 'Lyria.Resource',
      'lyria/loop': 'Lyria.Loop',
      'lyria/tween': 'Lyria.Tween',
      'lyria/animation': 'Lyria.Animation'
    };

    return Scene;

  })();

  return Scene;

});
