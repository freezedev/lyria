/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/layer', ['lyria/gameobject'], function(GameObject) {
  'use strict';

  //Lyria.Layer
  return (function(parent) {

    var Layer = function() {

    };

    Layer.prototype = parent.prototype;

    return Layer;

  })(GameObject);
}); 