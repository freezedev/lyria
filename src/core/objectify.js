define('objectify', function() {
  'use strict';
  
  return function(arr) {
    if (typeof arr === 'object') {
      if (!Array.isArray(arr)) {
        return arr;
      }
    } else {
      return {};
    }

    var rv = {};
    for (var i = 0, j = arr.length; i < j; i++) {
      if (arr[i] != null) {
        rv[i] = arr[i];
      }
    }
    return rv;
  };
});
