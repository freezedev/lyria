define(['../localization'], function(Localization) {
  'use strict';
  
  var LocalizationGroup = (function() {
    var LocalizationGroup = function(groups) {
      for (var key in groups) {
        var value = groups[key];
        
        this[key] = new Localization(value);
      }
    };
    
    return LocalizationGroup;
  })();
  
  return LocalizationGroup;
  
});
