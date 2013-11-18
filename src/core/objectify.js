define('objectify', function() {
  return function(arr) {
    if (!Array.isArray(arr)) {
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
