/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/gameobject', ['mixin', 'lyria/eventmap', 'lyria/component'], function(mixin, EventMap, Component) {
  'use strict';
  
  //Lyria.GameObject
  return (function() {
    
    // Constructor
    var GameObject = function() {
      mixin(GameObject.prototype, new EventMap());
      
    };
    
    GameObject.prototype.add = function(component) {
      
    };
    
    GameObject.prototype.execute = function(functionBody) {
      
    };
    
    GameObject.prototype.log = function() {
      
    };
    
    GameObject.prototype.update = function(dt) {
      
    };
    
    return GameObject;
    
  })();
  
});