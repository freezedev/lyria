/**
 * Mixin language property into objects
 * TODO: Refactor this to use mixedice library
 */

define(function() {
  return function(propertyName, propertyTrigger) {
    if (propertyName == null) {
      propertyName = 'language';
    }
    
    if (propertyTrigger == null) {
      propertyTrigger = 'language:change';
    }
    
    return function(attachedObject, value, eventMap) {
  
      Object.defineProperty(attachedObject, propertyName, {
        get: function() {
          return value;
        },
        set: function(val) {
          value = val;
          eventMap.trigger(propertyTrigger, value);
        },
        configurable: true,
        enumarable: true
      });
  
    };
  };
}); 