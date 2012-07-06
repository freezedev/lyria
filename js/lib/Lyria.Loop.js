;(function(window, undefined) {
	// shim layer with setTimeout fallback
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	if (!window.requestAnimFrame) {
		window.requestAnimFrame = (function(){
		  return  window.requestAnimationFrame       || 
		          window.webkitRequestAnimationFrame || 
		          window.mozRequestAnimationFrame    || 
		          window.oRequestAnimationFrame      || 
		          window.msRequestAnimationFrame     || 
		          function( callback ){
		            window.setTimeout(callback, 1000 / 60);
		          };
		})();
	}
})(window);

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */

;(function(Lyria, undefined) {
	
	Lyria.Loop = (function() {
		
		var taskList = {};
		var isRunning = true;
		
		var run = function() {
			var time;
			
			(function loop() {
				requestAnimFrame(loop);
				
				var now = new Date().getTime(),
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
		}
		
		var addTask = function(taskName, taskFunction) {
			
			taskList[taskName] = {};
			taskList[taskName].paused = false;
			taskList[taskName].value = taskFunction;
		};
		
		var pauseTask = function(taskName) {
			taskList[taskName].paused = true;
		};
		
		var resumeTask = function(taskName) {
			taskList[taskName].paused = false;
		};
		
		var removeTask = function(taskName) {
			delete taskList[taskName];
		}
		
		return {
			run: run,
			stop: stop,
			clear: clear,
			addTask: addTask,
			removeTask: removeTask,
			pauseTask: pauseTask,
			resumeTask: resumeTask
		}
	})();
	
})(window.Lyria = window.Lyria || {});