/**
 * Mixin language property into objects
 * TODO: Refactor this to use mixer library
 */

define('lyria/mixin/language', function() {
  return function(attachedObject, value, eventMap) {

    Object.defineProperty(attachedObject, 'language', {
      get: function() {
        return value;
      },
      set: function(val) {
        value = val;
        eventMap.trigger('language:change', value);
      },
      configurable: true,
      enumarable: true
    });

  };
}); 