define('jqueryify', ['jquery'], function($) {
  return function(sel) {
    return (sel instanceof $) ? sel : $(sel);
  };
});