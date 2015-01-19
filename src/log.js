define(['root', 'gameboard/log'], function(root, Log) {
  'use strict';
  
  // Map shorthand functions to Log.i
  root.log = root.out = Log.i;
  
  return Log;
});