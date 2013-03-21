/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, undefined) {
	'use strict';

  Lyria.Layer = (function(parent) {
    
    var Layer = function() {
      
    };
    
    Layer.prototype = parent.prototype;
    
    return Layer;
    
  })(Lyria.GameObject);
	
})(window.Lyria = window.Lyria || {});
