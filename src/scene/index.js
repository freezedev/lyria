/**
 * @module Lyria
 */
define('lyria/scene', ['isEmptyObject', 'each', 'extend', 'mixin', 'lyria/eventmap', 'lyria/gameobject'], function(isEmptyObject, each, extend, mixin, EventMap, GameObject) {
  'use strict';

  var sceneCache = {};

  var Scene = (function() {
    
    /**
     * Scene constructor
     * 
     * @class Scene
     * @constructor
     */
    var Scene = function(sceneName, sceneFunction, options) {
      if (!sceneName) {
        return;
      }
      
      // Mixin event map into Scene
      mixin(Scene.prototype, new EventMap('scene:' + sceneName));
      
      // We need a reference to the scene not being this
      var self = this;
      
      // Collect all template values
      this.templateData = {};
      
      // Set name
      this.name = sceneName;
      
      // Default values
      this.localization = {};
      
      this.template = {};
      this.template.source = '';
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
      sceneFunction.call(this, this);

      this.refresh();
      
      if (this.events) {
        if (options && options.isPrefab) {
          this.events.delegate = (options.target) ? options.target : 'body';              
        } else {
          this.events.delegate = '#' + sceneName;
        }        
      }
      
      this.on('update', function(dt) {
        each(self.children, function(childKey, childValue) {
          if (!isEmptyObject(childValue)) {
            each(childValue, function(key, value) {
              value.trigger('update', dt);
            });
          }
        });
      });
      
    };
    
    /**
     * Adds a gameobject to the scene 
     * 
     * @param {Object} child
     */
    Scene.prototype.add = function(child) {
      var self = this;
      
      
      if (child instanceof GameObject) {
        this.children.gameObjects[child.name] = child;
        
        this.template.data.gameobject = (function() {
          var array = [];
          
          each(self.children.gameObjects, function(key, value) {
            array.push(value);
          });
          
          return array;
        })();
        
        return true;
      }
      
      if (child instanceof GameObject) {
        this.children.prefabs[child.name] = child;
        
        this.template.data.gameobject = (function() {
          var array = [];
          
          each(self.children.gameObjects, function(key, value) {
            array.push(value);
          });
          
          return array;
        })();
        
        return true;
      }
      
      return false;
    };
    
    /**
     * Refreshes the scene (Re-renders the template)
     * 
     * @param {Object} val
     */
    Scene.prototype.refresh = function(val) {
        if (val == null && this.template) {
          val = this.template.data;
        }
        
        if (this.template && this.template.source) {
          this.content = this.template.source(val);        
        }
      };
    
    return Scene;
    
  })();
  
  return Scene;
  
});