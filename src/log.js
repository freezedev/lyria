define(['gemabord/log'], function(Log) {
  'use strict';
  
  // Map shorthand functions to Log.i
  root.log = root.out = Log.i;
  
  return Log;
});