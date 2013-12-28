define('jqueryify', ['jquery'], function($) {
  'use strict';
  
  return function(sel) {
    return (sel instanceof $) ? sel : $(sel);
  };
});