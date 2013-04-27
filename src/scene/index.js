/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/scene', ['jquery', 'lyria/eventmap', 'lyria/gameobject'], function($, EventMap, GameObject) {
  'use strict';

  var sceneCache = {};

  //Lyria.Scene
  return (function() {
    
    var Scene = function(sceneName, sceneFunction, options) {
      if (!sceneName) {
        return;
      }
      
      // We need a reference to the scene not being this
      var self = this;
      
      // Collect all template values
      var templateVals = {};
      
      // Set name
      this.name = sceneName;
      
      // Create new event map
      this.eventMap = new EventMap();
      
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
    
    var methods = Object.keys(EventMap.prototype);
    
    for (var i = 0, j = methods.length; i < j; i++) {
      (function(iterator) {
        Scene.prototype[iterator] = function() {
          this.eventMap[iterator].apply(this, arguments);
        };
      })(methods[i]);
    }
    
    return Scene;
    
  })();
  
});