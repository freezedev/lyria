define('lyria/math', ['root', 'random', 'clamp', 'fisheryates'], function(root, random, clamp, fisheryates) {

  var Math = {
    random: random,
    clamp: clamp,
    fisherYates: fisheryates
  };

  return Math;

});
