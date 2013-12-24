define(['mixedice', './gameobject'], function(mixedice, GameObject) {
  'use strict';
  /**
   * @module lyria/layer
   */

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