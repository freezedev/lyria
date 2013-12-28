define('deleteitem', function() {
  'use strict';
  
  var deleteItem = function(obj, item) {
    var i, key, newObject, num, _i, _len, _results;
    if (Array.isArray(obj)) {
      _results = [];
      for ( num = _i = 0, _len = obj.length; _i < _len; num = ++_i) {
        i = obj[num];
        if (num !== item) {
          _results.push(i);
        }
      }
      return _results;
    } else {
      newObject = {};
      for (key in obj) {
        if (key !== item) {
          newObject[key] = obj[key];
        }
      }
      return newObject;
    }
  };

  return deleteItem;
});
