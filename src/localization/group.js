define('lyria/localization/group', ['lyria/localization'], function(Localization) {
  
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
