/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(global, Lyria, undefined) {'use strict';

  Lyria.Log = (function() {

    var Log = {};

    Log.Connector = null;

    Log.Plugins = {};

    Log.Plugins.Console = {
      e: function(text) {
        if (global.console && global.console.error) {
          global.console.error(text);
        }
      },
      w: function(text) {
        if (global.console && global.console.warn) {
          global.console.warn(text);
        }
      },
      i: function(text) {
        if (global.console && global.console.info) {
          global.console.info(text);
        }
      },
      d: function(text) {
        if (global.console && global.console.log) {
          global.console.log(text);
        }
      },
      v: function(text) {
        if (global.console && global.console.log) {
          global.console.log(text);
        }
      }
    };

    Log.Connector = Log.Plugins.Console;

    Log.logLevelMap = {
      'error': ['e'],
      'warn': ['w', 'e'],
      'info': ['i', 'w', 'e'],
      'debug': ['d', 'i', 'w', 'e'],
      'verbose': ['v', 'd', 'i', 'w', 'e']
    };

    Log.logLevel = 'verbose';

    var logFunctions = ['v', 'd', 'i', 'w', 'e'];

    for (var i = 0, j = logFunctions.length; i < j; i++) {

      (function(iterator) {
        Log[iterator] = function() {
          if (Log.logLevelMap[Log.logLevel].indexOf(iterator) >= 0) {
            Log.Connector[iterator].apply(this, arguments);
          }
        };        
      })(logFunctions[i]);
      
    }

    return Log;

  })();

  // Map shorthand functions to Log.i
  global.log = global.out = Lyria.Log.i;

})(this, this.Lyria = this.Lyria || {});
