/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/gameobject', ['mixin', 'isEmptyObject', 'each', 'lyria/eventmap', 'lyria/component', 'lyria/log'], function(mixin, isEmptyObject, each, EventMap, Component, Log) {
  'use strict';
  
  //Lyria.GameObject
  return (function() {
    
    // Constructor
    var GameObject = function() {
      mixin(GameObject.prototype, new EventMap());
      
      var self = this;
      
      this.components = {};
      
      this.on('update', function(dt) {
        if (isEmptyObject(self.components)) {
          return;
        }
        
        each(self.components, function(key, value) {
          value.trigger('update', dt);
        });
      });
    };
    
    GameObject.prototype.add = function(component) {
      if (component instanceof Component) {
        this.components[component.name] = component;
      }
    };
    
    GameObject.prototype.execute = function(functionBody) {
      functionBody.apply(this, this);
    };
    
    GameObject.prototype.log = function(text) {
      Log.i('GameObject: ' + text);
    };
    
    return GameObject;
    
  })();
  
});