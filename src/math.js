define('lyria/math', function() {

  var Math = {
    clamp: function(value, min, max) {
      var _ref, _ref1;

      if ( typeof value === 'object') {
        _ref = value, min = _ref.min, max = _ref.max, value = _ref.value;
      }
      if (min == null) {
        min = 0.0;
      }
      if (max == null) {
        max = 1.0;
      }
      if (min > max) {
        _ref1 = [max, min], min = _ref1[0], max = _ref1[1];
      }
      if ((min <= value && value <= max)) {
        return value;
      } else {
        if (value > max) {
          return max;
        } else {
          return min;
        }
      }
    }
  };

  return Math;

});
