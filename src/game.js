/**
 * @module Lyria
 */
define(['eventmap', 'mixedice', 'fullscreen', 'jquery', 'lyria/viewport', 'lyria/scene/director', 'lyria/preloader', 'lyria/loop', 'lyria/world', 'lyria/checkpoints'], function(EventMap, mixedice, fullscreen, $, Viewport, Director, Preloader, Loop, World, Checkpoints) {'use strict';

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

      options = $.extend({
        startLoop: true
      }, options);
      
      mixedice([this, Game.prototype], new EventMap());

      /**
       * @property viewport
       * @type {Viewport}
       */
      // Set up a viewport
      this.viewport = new Viewport();
      this.viewport.parent = this;

      /**
       * @property director
       * @type {Director}
       */
      // Add a scene director
      this.director = new Director(this.viewport);
      this.director.parent = this;

      /**
       * @property preloader
       * @type {Preloader}
       */
      // Add a preloader
      this.preloader = new Preloader();
      this.preloader.parent = this;

      // Bind the scene director to the preloader reference
      this.preloader.sceneDirector = this.director;
      
      this.paused = false;
      
      // Mute
      this.mute = false;
      
      // World reference
      this.world = new World();
      this.world.parent = this;
      
      // Checkpoints
      this.checkpoints = new Checkpoints();

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
      
      this.on('pause', function() {
        self.paused = true;
      });
      
      this.on('resume', function() {
        self.paused = false;
      });
      
      this.on('fullscreen', function() {
        var viewportElement = self.viewport.$element[0];
        
        if (!viewportElement) {
          return;
        }
        
        if (fullscreen.isFullscreen(viewportElement)) {
          fullscreen.cancel(viewportElement);
        } else {
          fullscreen.request(viewportElement);
        }
      });
      
      $(document).ready(function() {
        if (self.pause) {
          $(window).blur(function() {
            self.pause();
          });          
        }
        
        if (self.resume) {
          $(window).focus(function() {
            self.resume();
          });          
        }
      });
    };
    
    /**
     * 
     */
    Game.prototype.addScene = function(name, data) {
      var self = this;
      
      if (!name) {
        return this;
      }
      
      if (Array.isArray(name)) {
        for (var i = 0, j = name.length; i < j; i++) {
          (function(item) {
            if (typeof item === 'object') {
              self.addScene(name.name, name.data);
            } else {
              self.addScene(name);
            }
          })(name[i]);
        }
      }
      
      this.preloader.taskAsync(function(done) {
        self.director.add(name, data, done);
      });
      
      return this;
    };
    
    /**
     * 
     */
    Game.prototype.showScene = function(name) {
      this.director.show(name);
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