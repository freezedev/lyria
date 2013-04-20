/**
 * @module Lyria
 */
define('lyria/layer', ['lyria/gameobject'], function(GameObject) {
  'use strict';

  return (function(parent) {

    /**
     * @class Layer
     * @extends Lyria.GameObject 
     * @constructor
     */
    var Layer = function() {

    };

    Layer.prototype = parent.prototype;

    return Layer;

  })(GameObject);
}); 