/**
 * Lyria module
 *
 * @module Lyria
 */
define('lyria/layer', ['mixer', 'lyria/gameobject'], function(mixer, GameObject) {
  'use strict';

  return (function() {

    /**
     * @class Layer
     * @extends Lyria.GameObject 
     * @constructor
     */
    var Layer = function() {
      mixer(this.prototype, new GameObject());
    };

    return Layer;

  })();
}); 