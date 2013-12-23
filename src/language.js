define(['detectr', 'eventmap', 'lyria/mixin/language'], function(detectr, EventMap, langMixin) {
  'use strict';
  
  /**
   * @module lyria/language 
   */
  
  var langEvents = new EventMap();
  
  // Fallback language
  var langObject = {
    defaultLanguage: 'en',
    on: langEvents.on,
    off: langEvents.off
  };

  var langProp = detectr.Browser.language() || langObject.defaultLanguage;

  langMixin('value', 'change')(langObject, langProp, langEvents);

  return langObject;
});