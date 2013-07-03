define('fisheryates', ['random'], function(random) {
  /**
   * Randomize array element order in-place.
   * Using Fisher-Yates shuffle algorithm.
   */
  return function(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = random(i + 1);
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };
});
