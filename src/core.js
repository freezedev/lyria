(function(root) {
  define('root', function() {
    return root;
  });
})(this);

define('mixin', function() {
  var mixin, __slice = [].slice;

  mixin = function() {
    var key, oldRef, s, source, target, value, _i, _len;

    target = arguments[0], source = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!(target || source)) {
      return;
    }
    for ( _i = 0, _len = source.length; _i < _len; _i++) {
      s = source[_i];
      for (key in s) {
        value = s[key];
        if (!Object.hasOwnProperty.call(target, key)) {
          target[key] = value;
        } /* else {
          oldRef = target[key];
          target[key] = (function() {
            if ( typeof oldRef === 'function' && typeof value === 'function') {
              return function() {
                oldRef.apply(this, arguments);
                return value.apply(this, arguments);
              };
            } else {
              return [oldRef, value];
            }
          })();
        } */
      }
    }
    return null;
  };

  return mixin;
});

define('requestAnimationFrame', ['root'], function(root) {
  // frameRate is only used if requestAnimationFrame is not available
  var frameRate = 60;

  var requestAnimationFrame = root.requestAnimationFrame;

  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    requestAnimationFrame = root[vendors[x] + 'RequestAnimationFrame'];

    if (requestAnimationFrame) {
      break;
    }
  }

  if (!requestAnimationFrame) {
    requestAnimationFrame = function(callback) {
      window.setTimeout(callback, ~~(1000 / window.frameRate));
    };
  }

  return requestAnimationFrame;
});

define('cancelAnimationFrame', ['root'], function(root) {

  var cancelAnimationFrame = root.cancelAnimationFrame;

  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
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
