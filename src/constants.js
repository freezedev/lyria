// Debug settings
define('lyria/debug', function() {
  return true;
});

// General constants
define('lyria/constants', {
  animSpeed: 300
});

define('lyria/language', ['root'], function(root) {
  // Fallback language
  var defaultLanguage = 'en';
  
  return detectr.Browser.language() || defaultLanguage;  
});
