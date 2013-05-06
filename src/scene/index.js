/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/scene', ['jquery', 'mixin', 'lyria/eventmap', 'lyria/gameobject'], function($, mixin, EventMap, GameObject) {
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
      var templateVals = {};
      
      // Set name
      this.name = sceneName;
      
      // Default values
      this.localization = {};
      
      // Expose function for template values
      this.expose = function(obj) {
        if (!obj || $.isEmptyObject(obj)) {
          return;
        }
        
        templateVals = $.extend(true, templateVals, obj);
      };
      
      // Set a context object for sceneFunction to be called in
      var context = {};
      
      // Call scene
      var retValue = sceneFunction.call(this, this);
      
      if (retValue && !$.isEmptyObject(retValue)) {
        this.expose(retValue);
      }
      
      // Mix in keys from context to the scene object
      $.each(context, function(key, value) {
        if (self[key]) {
          
        } else {
          self[key] = value;           
        }
      });
      
      
      /*if (this.localization) {
        var currentLocalization = this.localization['de'];
        
        retValue = $.extend(retValue, currentLocalization);
      }*/

      if (this.template) {
        this.content = this.template(templateVals);
      }
      
      
      
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
      this.content = this.template(val);
    };
    
    return Scene;
    
  })();
  
  return Scene;
  
});