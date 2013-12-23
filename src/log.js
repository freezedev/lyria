define(['root'], function(root) {
  'use strict';
  /**
   * @module lyria/log
   */
  
  /**
   * @class Log 
   */
  var Log = (function() {

    var Log = {};

    Log.connector = null;

    Log.plugins = {};

    Log.plugins.console = {
      e: function() {
        if (root.console && root.console.error) {
          return root.console.error.apply(console, arguments);
        }
      },
      w: function() {
        if (root.console && root.console.warn) {
          return root.console.warn.apply(console, arguments);
        }
      },
      i: function() {
        if (root.console && root.console.info) {
          return root.console.info.apply(console, arguments);
        }
      },
      d: function() {
        if (root.console && root.console.log) {
          return root.console.log.apply(console, arguments);
        }
      },
      v: function() {
        if (root.console && root.console.log) {
          return root.console.log.apply(console, arguments);
        }
      }
    };

    Log.connector = Log.plugins.console;

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
            Log.connector[iterator].apply(this, arguments);
          }
        };        
      })(logFunctions[i]);
      
    }

    return Log;

  })();

  // Map shorthand functions to Log.i
  root.log = root.out = Log.i;
  
  return Log;
});