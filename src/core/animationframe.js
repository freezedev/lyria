define('requestAnimationFrame', ['root'], function(root) {
  // frameRate is only used if requestAnimationFrame is not available
  var frameRate = 60;

  var requestAnimationFrame = root.requestAnimationFrame;

  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !root.requestAnimationFrame; ++x) {
    requestAnimationFrame = root[vendors[x] + 'RequestAnimationFrame'];

    if (requestAnimationFrame) {
      break;
    }
  }

  if (!requestAnimationFrame) {
    requestAnimationFrame = function(callback) {
      root.setTimeout(callback, ~~(1000 / root.frameRate));
    };
  }

  return requestAnimationFrame;
});

define('cancelAnimationFrame', ['root'], function(root) {

  var cancelAnimationFrame = root.cancelAnimationFrame;

  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !root.requestAnimationFrame; ++x) {
    cancelRequestAnimationFrame = root[vendors[x] + 'CancelRequestAnimationFrame'];

    if (cancelAnimationFrame) {
      break;
    }
  }

  if (!cancelAnimationFrame) {
    cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
});