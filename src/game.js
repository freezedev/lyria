/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/game', ['lyria/viewport', 'lyria/scene/director', 'lyria/preloader'], function(Viewport, Director, Preloader) {
  'use strict';
  
  // Lyria.Game
  return (function() {
    
    // Constructor
    var Game = function() {
      this.viewport = new Viewport();
      this.director = new Director(this.viewport);
      this.preloader = new Preloader();      
    };
    
    
    return Game;
    
  })();
  
});