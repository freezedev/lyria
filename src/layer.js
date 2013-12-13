/**
 * Lyria module
 *
 * @module Lyria
 */
define(['mixedice', 'lyria/gameobject'], function(mixedice, GameObject) {
  'use strict';

  return (function() {

    /**
     * @class Layer
     * @extends Lyria.GameObject 
     * @constructor
     */
    var Layer = function() {
      mixedice(this.prototype, new GameObject());
    };

    return Layer;

  })();
}); 