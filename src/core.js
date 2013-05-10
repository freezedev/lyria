(function(root) {
  define('root', function() {
    return root;
  });
})(this);

define('mixin', function() {
  var mixin;

  mixin = function() {
    var key, oldRef, s, source, target, value, _i, _len;

    target = arguments[0], source = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
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

/*define('extend', function() {
  var __slice = [].slice, __hasProp = {}.hasOwnProperty;

  var extend = function() {
    var deep, key, s, source, target, value, _i, _j, _len, _len1;

    deep = arguments[0], target = arguments[1], source = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if ( typeof deep === 'object') {
      target = deep;
      deep = false;
    }
    if (deep) {
      for ( _i = 0, _len = source.length; _i < _len; _i++) {
        s = source[_i];
        for (key in s) {
          if (!__hasProp.call(s, key))
            continue;
          value = s[key];
          if ( typeof value === 'object') {
            target[key] = extend(true, {}, value);
          } else {
            target[key] = value;
          }
        }
      }
    } else {
      for ( _j = 0, _len1 = source.length; _j < _len1; _j++) {
        s = source[_j];
        for (key in s) {
          if (!__hasProp.call(s, key))
            continue;
          value = s[key];
          target[key] = value;
        }
      }
    }
    return target;
  };

  return extend;
});*/

define('extend', ['jquery'], function($) {
  return $.extend;
});

define('each', function() {
  return function(obj, callback) {
    var i, num, objKeys, val, _i, _j, _len, _len1;

    if (Array.isArray(obj)) {
      for ( num = _i = 0, _len = obj.length; _i < _len; num = ++_i) {
        i = obj[num];
        if (callback(num, i)) {
          continue;
        } else {
          break;
        }
      }
    } else {
      objKeys = Object.keys(obj);
      for ( num = _j = 0, _len1 = objKeys.length; _j < _len1; num = ++_j) {
        i = objKeys[num];
        val = obj[j];
        if (callback(j, val)) {
          continue;
        } else {
          break;
        }
      }
    }
    return null;
  };
});

define('isEmptyObject', function() {
  return function(obj) {
    if ( typeof obj !== 'object') {
      return;
    }

    return (Object.keys(obj).length === 0);
  };
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
