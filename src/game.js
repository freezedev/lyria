/**
 * Lyria namespace decleration
 * 
 * @namespace Lyria
 */
define('lyria/game', ['lyria/viewport', 'lyria/scene/director', 'lyria/preloader', 'lyria/loop'], function(Viewport, Director, Preloader, Loop) {
  'use strict';
  
  // Lyria.Game
  return (function() {
    
    // Constructor
    var Game = function() {
      var self = this;
      
      this.viewport = new Viewport();
      this.director = new Director(this.viewport);
      this.preloader = new Preloader();      
      this.preloader.sceneDirector = this.director;
      this.loop = Loop;
      
      Game.Loop.addTask('update', function(dt) {
        self.director.trigger('update', dt);
      });      
    };
    
    Game.Loop = Loop;
    
    
    return Game;
    
  })();
  
});