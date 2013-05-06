define('lyria/achievement', function() {
  
  var achievementId = 0;
  
  var Achievement = (function() {
    var Achievement = function(options) {
      if (!options.name) {
        // Break if no name has been specified
        return;
      } else {
        this.name = options.name;        
      }
      
      achievementId++;
      
      this.id = achievementId;
      
      if (options.description != null) {
        this.description = options.description;
      }
      
      if (options.icon != null) {
        this.icon = options.icon;
      }
      
      this.active = false;
    };
    
    Achievement.prototype.toJSON = function() {
      return {
        active: active,
        name: name,
        description: description,
        icon: icon
      };
    };
    
    Achievement.prototype.toString = function() {
      return JSON.stringify(this.toJSON());
    };
    
    return Achievement;
  })();
  
  return Achievement;
  
});
