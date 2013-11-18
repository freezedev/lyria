define('lyria/achievement', ['clamp'], function(clamp) {

  var Achievement = (function() {
    var Achievement = function(options) {
      if (options == null) {
        throw new Error('An achievement constructor needs to be called with a parameter');
      }
      
      if (typeof options === 'string') {
        options = {
          name: options
        };
      }
      
      if (!options.name) {
        // Break if no name has been specified
        throw new Error('An achievement needs to have a name.');
      } else {
        this.name = options.name;
      }

      this.id = options.id || 'achievement-' + Date.now();
      this.icon = options.icon || null;
      
      this.progress = options.progress || {min: 0, max: 1};

      this.unlocked = (options.unlocked == null) ? false : options.unlocked;
      
      var progressCurrent = this.progress.min;

      var self = this;

      Object.defineProperty(this.progress, 'current', {
        get: function() {
          return progressCurrent;
        },
        set: function(value) {
          progressCurrent = clamp(value, self.progress.min, self.progress.max);
          
          if (progressCurrent >= self.progress.max) {
            self.unlocked = true;
          } else {
            if (self.unlocked === true) {
              self.unlocked = false;
            }
          }
        },
        enumarable: true,
        configurable: true
      });
    };

    Achievement.prototype.reset = function() {
      this.progress.current = this.progress.min;
    };

    Achievement.prototype.unlock = function() {
      this.progress.current = this.progress.max;
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
