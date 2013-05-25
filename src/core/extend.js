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