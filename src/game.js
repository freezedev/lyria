/**
 * @module Lyria
 */
define('lyria/game', ['lyria/viewport', 'lyria/scene/director', 'lyria/preloader', 'lyria/loop'], function(Viewport, Director, Preloader, Loop) {
  'use strict';
  
  /**
   * Game class which has a viewport, scene director and preloader by
   * default.
   *
   * @class Game 
   */
  return (function() {
    
    /**
     * @constructor 
     */
    var Game = function() {
      var self = this;
      
      /**
       * @property viewport
       * @type {Viewport} 
       */
      // Set up a viewport
      this.viewport = new Viewport();

      /**
       * @property director
       * @type {Director} 
       */      
      // Add a scene director
      this.director = new Director(this.viewport);
      
      /**
       * @property preloader
       * @type {Preloader} 
       */
      // Add a preloader
      this.preloader = new Preloader(); 
      
      // Bind the scene director to the preloader reference     
      this.preloader.sceneDirector = this.director;
      
      // Add an update task to the loop with updates the scene director on each frame
      Game.Loop.addTask('update', function(dt) {
        self.director.trigger('update', dt);
      });      
    };
    
    /**
     * @property Loop
     * @static
     * @type {Loop} 
     */
    // Store the reference to the Lyria Loop at the Game object
    Game.Loop = Loop;
    
    
    return Game;
    
  })();
  
});