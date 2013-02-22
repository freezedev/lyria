/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(window, Lyria, undefined) {
  'use strict';
  
  Lyria.Game = (function() {
    
    // Constructor
    var Game = function() {}
    
    Game.prototype.SceneDirector = new Lyria.SceneDirector();
    Game.prototype.Preloader = null;
    
    return Game;
    
  })();
  
})(this, this.Lyria = this.Lyria || {});
