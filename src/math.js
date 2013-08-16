define('lyria/math', ['random', 'clamp', 'fisheryates'], function(random, clamp, fisheryates) {

  var Math = {
    random: random,
    clamp: clamp,
    fisherYates: fisheryates
  };

  return Math;

});
