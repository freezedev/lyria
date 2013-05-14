/**
 * @module Lyria
 */
define('lyria/loop', ['root', 'each', 'requestAnimationFrame'], function(root, each, requestAnimationFrame) {
  'use strict';
  
  /**
   * @class Loop
   * @static 
   */
  return (function() {

    var taskList = {};
    var isRunning = true;

    /**
     * @method run 
     */
    var run = function() {
      var time;

      (function loop() {
        requestAnimationFrame(loop);

        var now = Date.now();
        var dt = now - (time || now);

        time = now;

        if (!isRunning) {
          return;
        }

        each(taskList, function(key, value) {
          if (!value.paused) {
            value.value(dt);
          }
        });
      })();
    };

    /**
     * @method stop 
     */
    var stop = function() {
      isRunning = false;
    };

    var clear = function() {
      taskList = {};
    };

    var addTask = function(taskName, taskFunction) {

      taskList[taskName] = {
        'paused': false,
        'value': taskFunction
      };
    };

    var pauseTask = function(taskName) {
      taskList[taskName].paused = true;
    };

    var resumeTask = function(taskName) {
      taskList[taskName].paused = false;
    };

    var removeTask = function(taskName) {
      delete taskList[taskName];
    };

    return {
      run: run,
      stop: stop,
      clear: clear,
      addTask: addTask,
      removeTask: removeTask,
      pauseTask: pauseTask,
      resumeTask: resumeTask
    };
  })();
  
});