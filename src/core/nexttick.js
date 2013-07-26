/**
 * Trying to find a better alternative than setTimeout(fn, 0)
 * requestAnimationFrame should be a better alternative
 */
define('nexttick', ['requestanimationframe', 'cancelanimationframe'], function(requestAnimationFrame, cancelAnimationFrame) {
  return function(fn) {
    var id = requestAnimationFrame(function() {
      if (fn != null) {
        fn();
      }
      cancelAnimationFrame(id);
    });
  };
});
