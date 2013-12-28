define('options', ['jquery'], function($) {
  'use strict';
  
  return function(obj, defaultOptions) {
    return $.extend(true, obj, defaultOptions);
  };
});
