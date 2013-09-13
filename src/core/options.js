define('options', ['jquery'], function($) {
  return function(obj, defaultOptions) {
    return $.extend(true, obj, defaultOptions);
  };
});
