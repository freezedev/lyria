/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/gameobject', ['mixin', 'lyria/eventmap', 'lyria/component', 'lyria/log'], function(mixin, EventMap, Component, Log) {
  'use strict';
  
  //Lyria.GameObject
  return (function() {
    
    // Constructor
    var GameObject = function() {
      mixin(GameObject.prototype, new EventMap());
      
    };
    
    GameObject.prototype.add = function(component) {
      if (component instanceof Component) {
        
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