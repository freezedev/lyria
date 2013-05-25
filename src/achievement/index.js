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

      this.progress = {};
      this.progress.max = 1;

      var progressCurrent = 0;

      var self = this;

      Object.defineProperty(this.progress, 'current', {
        get: function() {
          return progressCurrent;
        },
        set: function(value) {
          progressCurrent = value;
          if (self.progress.max === progressCount) {
            self.unlock();
          }
        },
        enumarable: true,
        configurable: true
      });

      this.unlocked = false;
    };

    Achievement.prototype.lock = function() {
      this.unlocked = false;
    };

    Achievement.prototype.unlock = function() {
      this.unlocked = true;
    };

    Achievement.prototype.toJSON = function() {
      var achObject = {};

      for (var key in this) {
        if (Object.hasOwnProperty.call(this, key)) {
          continue;
        }

        achObject[key] = this[key];
      }

      return achObject;
    };

    Achievement.prototype.toString = function() {
      return JSON.stringify(this.toJSON());
    };

    return Achievement;
  })();

  return Achievement;

});
