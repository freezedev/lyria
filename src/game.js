/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/game', ['lyria/viewport', 'lyria/scene/director'], function(Viewport, Director) {
  'use strict';
  
  // Lyria.Game
  return (function() {
    
    // Constructor
    var Game = function() {};
    
    Game.prototype.viewport = new Viewport();
    Game.prototype.director = new Director(Game.prototype.viewport);
    Game.prototype.preloader = null;
    
    return Game;
    
  })();
  
});