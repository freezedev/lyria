/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/scene', ['isEmptyObject', 'extend', 'mixin', 'lyria/eventmap', 'lyria/gameobject'], function(isEmptyObject, extend, mixin, EventMap, GameObject) {
  'use strict';

  var sceneCache = {};

  var Scene = (function() {
    
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
      
      // Expose function for template values
      this.expose = function(obj) {
        if (!obj || isEmptyObject(obj)) {
          return;
        }
        
        self.templateData = extend(true, self.templateData, obj);
      };
      
      // Call scene
      sceneFunction.call(this, this);

      this.compileTemplate();
      
      
      
      if (this.events) {
        if (options && options.isPrefab) {
          this.events.delegate = (options.target) ? options.target : 'body';              
        } else {
          this.events.delegate = '#' + sceneName;
        }        
      }
      
    };
    
    Scene.prototype.add = function(gameObject) {
      if (gameObject instanceof GameObject) {
        
      }
    };
    
    Scene.prototype.compileTemplate = function(val) {
      if (val == null) {
        val = this.templateData;
      }
      
      if (this.template) {
        this.content = this.template(val);        
      }
    };
    
    return Scene;
    
  })();
  
  return Scene;
  
});