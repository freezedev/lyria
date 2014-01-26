define(['mixedice', './gameobject'], function(mixedice, GameObject) {
  'use strict';
  /**
   * @module lyria/layer
   * @requires mixedice
   * @requires lyria/gameobject
   */

  return (function() {

    /**
     * @class
     * @alias module:lyria/layer
     * 
     * @augments module:lyria/eventmap 
     */
    var Layer = function() {
      mixedice(this.prototype, new GameObject());
    };

    return Layer;

  })();
}); 