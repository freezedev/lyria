/**
 * @namespace Lyria
 * Lyria namespace decleration
 */

;(function(global, Lyria, $, undefined) {
  'use strict';
  
  
  Lyria.Loop = (function() {
    
    var taskList = {};
    var isRunning = true;
    
    var run = function() {
      var time;
      
      (function loop() {
        global.requestAnimFrame(loop);
        
        var now = Date.now(),
            dt = now - (time || now);
     
          time = now;
          //console.log(dt);
          
          if (!isRunning) {
            return;
          }
          
          $.each(taskList, function(key, value) {
           if (!value.paused) {
             value.value(dt);
           }
        });
      })();
    };
    
    var stop = function() {
      isRunning = false;
    };
    
    var clear = function() {      
      taskList = {};
    };
    
    var addTask = function(taskName, taskFunction) {
      
      taskList[taskName] = {
        'paused' : false,
        'value' : taskFunction
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
  
})(this, this.Lyria = this.Lyria || {}, this.jQuery);