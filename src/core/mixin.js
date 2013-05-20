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