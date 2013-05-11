/**
 * @module Lyria
 */
define('lyria/scene', ['isEmptyObject', 'extend', 'mixin', 'lyria/eventmap', 'lyria/gameobject'], function(isEmptyObject, extend, mixin, EventMap, GameObject) {
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
      this.template.data = null;
      
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
      
    };
    
    /**
     * Adds a gameobject to the scene 
     * 
     * @param {Object} gameObject
     */
    Scene.prototype.add = function(gameObject) {
      if (gameObject instanceof GameObject) {
        
      }
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