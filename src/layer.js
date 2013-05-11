/**
 * Lyria module
 *
 * @module Lyria
 */
define('lyria/layer', ['mixin', 'lyria/gameobject'], function(mixin, GameObject) {
  'use strict';

  return (function() {

    /**
     * @class Layer
     * @extends Lyria.GameObject 
     * @constructor
     */
    var Layer = function() {
      mixin(this.prototype, new GameObject());
    };

    return Layer;

  })();
}); 