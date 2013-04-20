;(function(window, undefined) {
  // frameRate is only used if requestAnimFrame is not available
  window.frameRate = 60;
  
  /* shim layer with setTimeout fallback
    http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  
   http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  */
  
  var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+
          'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimFrame) {
      window.requestAnimFrame = function( callback ){
          window.setTimeout(callback, ~~(1000 / window.frameRate));
        };
    }
    
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    } 
})(this);
