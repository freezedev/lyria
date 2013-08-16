// Debug settings
define('lyria/debug', function() {
  return true;
});

// General constants
define('lyria/constants', function() {
  return {
    animSpeed: 300
  };
});

define('lyria/language', ['detectr', 'lyria/events', 'lyria/mixin/language'], function(detectr, Events, langMixin) {
  // Fallback language
  var langObject = {
    defaultLanguage: 'en'
  };

  var langProp = detectr.Browser.language() || langObject.defaultLanguage;

  langMixin(langObject, langProp, Events);

  return langObject;
});
