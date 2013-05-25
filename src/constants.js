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

define('lyria/language', ['detectr', 'lyria/events'], function(detectr, Events) {
  // Fallback language
  var langObject = {
    defaultLanguage: 'en'
  };

  var langProp = detectr.Browser.language() || langObject.defaultLanguage;

  Object.defineProperty(langObject, 'language', {
    get: function() {
      return langProp;
    },
    set: function(value) {
      langProp = value;
      Events.trigger('language:change', langProp);
    },
    configurable: true,
    enumarable: true
  });

  return langObject;
});
