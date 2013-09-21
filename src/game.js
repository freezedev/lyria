/**
 * @module Lyria
 */
define('lyria/game', ['eventmap', 'mixer', 'jquery', 'lyria/viewport', 'lyria/scene/director', 'lyria/preloader', 'lyria/loop', 'lyria/world'], function(EventMap, mixer, $, Viewport, Director, Preloader, Loop, World) {'use strict';

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
    var Game = function(options) {
      var self = this;

      options = $.extend(options, {
        startLoop: true
      });
      
      mixer(Game.prototype, new EventMap());

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
      
      this.paused = false;
      
      // World reference
      this.world = new World();

      // Add an update task to the loop with updates the scene director on each
      // frame
      Game.Loop.on('update', function(dt) {
        self.director.trigger('update', dt);
      });
      
      // Run game loop (if it should start by default)
      // In most cases, you'll need the loop (animation/physics/etc.)
      // In a pure event-based game - like a turn-based-strategy game -
      // you might want turn startLoop off
      if (options.startLoop) {
        Game.Loop.run();
      }
      
      $(document).ready(function() {
        $(window).blur(self.pause);
        $(window).focus(self.resume);
      });
    };
    
    Game.prototype.pause = function() {
      this.paused = true;
      this.trigger('pause');
    };
    
    Game.prototype.resume = function() {
      this.paused = false;
      this.trigger('resume');
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