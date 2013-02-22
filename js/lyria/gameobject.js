/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(window, Lyria, undefined) {
  'use strict';
  
  Lyria.GameObject = (function() {
    
    // Constructor
    var GameObject = function() {
      
    }
    
    GameObject.prototype.add = function(component) {
      
    };
    
    GameObject.prototype.execute = function(functionBody) {
      (function(gameObject) { functionBody; }).call(this);
    };
    
    GameObject.prototype.log = function() {
      
    };
    
    return GameObject;
    
  })();
  
})(this, this.Lyria = this.Lyria || {});
