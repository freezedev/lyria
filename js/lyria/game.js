/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(window, Lyria, undefined) {
  'use strict';
  
  Lyria.Game = (function() {
    
    // Constructor
    var Game = function() {};
    
    Game.prototype.viewport = new Lyria.Viewport();
    Game.prototype.director = new Lyria.SceneDirector(Game.prototype.viewport);
    Game.prototype.preloader = null;
    
    return Game;
    
  })();
  
})(this, this.Lyria = this.Lyria || {});
