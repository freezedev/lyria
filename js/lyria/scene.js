/*jshint evil:true */

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(window, Lyria, $, Handlebars, undefined) {
  'use strict';

  var sceneCache = {};

  Lyria.Scene = (function() {
    
    var Scene = function(sceneName, sceneFunction, options) {
      if (!sceneName) {
        return;
      }
      
      // We need a reference to the scene not being this
      var self = this;
      
      // Set name
      this.name = sceneName;
      
      // Create new event map
      this.eventMap = new Lyria.EventMap();
      
      // Default values
      this.localization = {};
      
      // Set a context object for sceneFunction to be called in
      var context = {};
      
      // Call scene
      var retValue = sceneFunction.call(context, this);
      
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
        this.content = this.template(retValue);
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
      if (gameObject instanceof Lyria.GameObject) {
        
      }
    };
    
    var methods = Object.keys(Lyria.EventMap.prototype);
    
    for (var i = 0, j = methods.length; i < j; i++) {
      (function(iterator) {
        Scene.prototype[iterator] = function() {
          this.eventMap[iterator].apply(this, arguments);
        };
      })(methods[i]);
    }
    
    return Scene;
    
  })();

  Lyria.Scenes = {};

})(this, this.Lyria = this.Lyria || {}, this.jQuery, this.Handlebars);
