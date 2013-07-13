define('random', function() {
  return function(max, min) {
    if (max == null) {
      max = 1.0;
    }
    
    if (min == null) {
      min = 0.0;
    }
    
    return Math.floor(Math.random() * (max - min)) + min;
  };
});