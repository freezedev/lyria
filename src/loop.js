/**
 * @module Lyria
 */
define('lyria/loop', ['requestanimationframe', 'eventmap'], function(requestAnimationFrame, EventMap) {
  'use strict';
  
  var loopEvents = new EventMap();
  var pausedEvents = {};
  
  /**
   * @class Loop
   * @static 
   */
  return (function() {

    var isRunning = true;

    /**
     * @method run 
     */
    var run = function() {
      var time;

      (function loop() {
        requestAnimationFrame(loop);

        var now = performance.now() || Date.now();
        var dt = now - (time || now);

        time = now;

        if (!isRunning) {
          return;
        }

        var eventKeys = Object.keys(loopEvents.events);
        
        for (var i = 0, j = eventKeys.length; i < j; i++) {
          (function(key) {
            if (!pausedEvents[key]) {
              loopEvents.trigger(key, dt);
            }
          })(eventKeys[i]);
        }
      })();
    };

    /**
     * @method stop 
     */
    var stop = function() {
      isRunning = false;
    };

    var clear = function() {
      loopEvents.clear();
      pausedEvents = {};
    };
    
    var on = function(taskName, taskFunction) {
      loopEvents.on(taskName, taskFunction);
      pausedEvents[taskName] = false;
    };
    
    var off = function(taskName) {
      loopEvents.off(taskName);
      if (pausedEvents[taskName] != null) {
        delete pausedEvents[taskName];        
      }
    };

    var pause = function(taskName) {
      pausedEvents[taskName].paused = true;
    };

    var resume = function(taskName) {
      if (taskName == null) {
        isRunning = true;
        return;
      }
      
      pausedEvents[taskName].paused = false;
    };


    return {
      run: run,
      
      stop: stop,
      clear: clear,
      
      on: on,
      off: off,
      
      pause: pause,
      resume: resume
    };
  })();
  
});