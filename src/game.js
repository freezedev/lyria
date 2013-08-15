/**
 * @module Lyria
 */
define('lyria/game', ['extend', 'lyria/viewport', 'lyria/scene/director', 'lyria/preloader', 'lyria/loop'], function(extend, Viewport, Director, Preloader, Loop) {'use strict';

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

      options = extend(options, {
        startLoop: true
      });

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