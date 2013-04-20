/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/log', ['root'], function(root) {
  'use strict';
  
  var Log = (function() {

    var Log = {};

    Log.Connector = null;

    Log.Plugins = {};

    Log.Plugins.Console = {
      e: function(text) {
        if (root.console && root.console.error) {
          root.console.error(text);
        }
      },
      w: function(text) {
        if (root.console && root.console.warn) {
          root.console.warn(text);
        }
      },
      i: function(text) {
        if (root.console && root.console.info) {
          root.console.info(text);
        }
      },
      d: function(text) {
        if (root.console && root.console.log) {
          root.console.log(text);
        }
      },
      v: function(text) {
        if (root.console && root.console.log) {
          root.console.log(text);
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
  root.log = root.out = Lyria.Log.i;
  
  return Log;
});