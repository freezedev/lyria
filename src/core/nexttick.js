/**
 * Trying to find a better alternative than setTimeout(fn, 0)
 * requestAnimationFrame should be a better alternative
 * TODO: Evaluate setImmediate shims
 */
define('nexttick', ['requestanimationframe', 'cancelanimationframe'], function(requestAnimationFrame, cancelAnimationFrame) {
  'use strict';
  
  return function(fn) {
    var id = requestAnimationFrame(function() {
      if (fn != null) {
        fn();
      }
      cancelAnimationFrame(id);
    });
  };
});
