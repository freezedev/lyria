;(function(window, undefined) {
	// frameRate is only used if requestAnimFrame is not available
	window.frameRate = 60;
	
	// shim layer with setTimeout fallback
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	
	http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	
	var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+
          'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimFrame) {
    	window.requestAnimFrame = function( callback ){
	        window.setTimeout(callback, ~~(1000 / window.frameRate));
	      };
    }
    
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    } 
})(this);

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */

;(function(Lyria, undefined) {
	'use strict';
	
	
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