(function() {
  var vendors;

  vendors = ['ms', 'moz', 'webkit', 'o'];

  define('requestanimationframe', ['root'], function(root) {
    var lastTime, requestAnimationFrame, x, _i, _len;
    requestAnimationFrame = root.requestAnimationFrame;
    if (!requestAnimationFrame) {
      for (_i = 0, _len = vendors.length; _i < _len; _i++) {
        x = vendors[_i];
        requestAnimationFrame = root["" + x + "RequestAnimationFrame"];
        if (requestAnimationFrame) {
          break;
        }
      }
    }
    if (!requestAnimationFrame) {
      lastTime = 0;
      requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall, _ref;
        currTime = (_ref = performance.now()) != null ? _ref : Date.now();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = root.setTimeout((function() {
          return callback(currTime + timeToCall);
        }), timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    return requestAnimationFrame;
  });

  define('cancelanimationframe', ['root'], function(root) {
    var cancelAnimationFrame, x, _i, _len;
    cancelAnimationFrame = root.cancelAnimationFrame;
    if (!cancelAnimationFrame) {
      for (_i = 0, _len = vendors.length; _i < _len; _i++) {
        x = vendors[_i];
        cancelAnimationFrame = root["" + x + "CancelAnimationFrame"] || root["" + x + "CancelRequestAnimationFrame"];
        if (cancelAnimationFrame) {
          break;
        }
      }
    }
    if (!cancelAnimationFrame) {
      cancelAnimationFrame = function(id) {
        return root.clearTimeout(id);
      };
    }
    return cancelAnimationFrame;
  });

}).call(this);