define('each', function() {
  return function(obj, callback) {
    var i, num, objKeys, val, _i, _j, _len, _len1;

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return;
      }
      
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
      if (objKeys.length === 0) {
        return;
      }
      
      for ( num = _j = 0, _len1 = objKeys.length; _j < _len1; num = ++_j) {
        i = objKeys[num];
        val = obj[i];
        if (callback(i, val)) {
          continue;
        } else {
          break;
        }
      }
    }
    return null;
  };
});