define('lyria/achievement', ['clamp'], function(clamp) {
  'use strict';

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

define('lyria/achievement/manager', ['jquery', '../achievement', '../template/engine', '../template/list', '../localization'], function($, Achievement, TemplateEngine, templateList, Localization) {
  'use strict';

  var achievementStore = {};

  var AchievementManager = {
    localization: new Localization(),
    add: function(achievement) {
      if ( achievement instanceof Achievement) {
        if (!Object.hasOwnProperty.call(achievementStore, achievement.name)) {
          achievementStore[achievement.name] = achievement;
        }
      }
    },
    progressSeparator: '/',
    viewport: null,
    remove: function(achName) {
      if (Object.hasOwnProperty.call(achievementStore, achName)) {
        delete achievementStore[achName];
      }
    },
    list: function() {
      //TemplateEngine.compile()
    },
    show: function(achName) {
      var currentAchievement = achievementStore[achName];

      if (currentAchievement == null) {
        throw new Error('Achievement ' + achName + ' not found.');
      }

      var title = (AchievementManager.localization.exists(currentAchievement.name)) ? AchievementManager.localization.t(currentAchievement.name) : currentAchievement.name;
      var description = (AchievementManager.localization.exists(currentAchievement.name + '-description')) ? AchievementManager.localization.t(currentAchievement.name + '-description') : currentAchievement.description;

      var achTemplate = TemplateEngine.compile(templateList['achievement'])({
        id: currentAchievement.id,
        className: currentAchievement.name,
        title: title,
        description: description,
        offscreen: true,
        progressable: (currentAchievement.progress.max > 0 && currentAchievement.progress.max !== 1),
        max: currentAchievement.progress.max,
        current: currentAchievement.progress.current,
        separator: AchievementManager.progressSeparator
      });


      if (AchievementManager.viewport == null) {
        $('body').append(achTemplate);
      } else {
        AchievementManager.viewport.$element.append(achTemplate);
      }

      var $currentAchievement = $('#' + currentAchievement.id);

      // Refactor this if lyria/tween is available
      $currentAchievement.css({
        opacity: 0.0
      });
      $currentAchievement.animate({
        opacity: 1.0
      }, 600).delay(2000).animate({
        opacity: 0.0
      }, 600, function() {
        $currentAchievement.remove();
      });
    },
    toJSON: function() {
      var key, value;
      var result = {};

      for (key in achievementStore) {
        value = achievementStore[key];
        result[key] = value.toJSON();
      }

      return result;
    },
    toString: function() {
      var result = '';

      try {
        result = JSON.stringify(AchievementManager.toJSON());
      } catch (e) {
        throw new Error('Error while serializing achievements in AchievementManager: ' + e);
      }
      return result;
    },
    fromJSON: function(achievements) {
      var key, value;

      for (key in achievements) {
        value = achievements[key];
        AchievementManager.add(value);
      }
    },
    fromString: function(achievements) {
      var deserializedValue = {};

      try {
        deserializedValue = JSON.parse(achievements);
      } catch (e) {
        throw new Error('Error while deserializing achivements in AchievementManager: ' + e);
      }

      return AchievementManager.fromJSON(deserializedValue);
    }
  };

  Object.defineProperty(AchievementManager, 'length', {
    get: function() {
      return Object.keys(achievementStore).length;
    }
  });

  Object.defineProperty(AchievementManager, 'unlockedCount', {
    get: function() {
      var counter = 0;

      $.each(achievementStore, function(key, value) {
        if (value.unlocked) {
          counter++;
        }
      });

      return counter;
    }
  });
  
  Object.defineProperty(AchievementManager, 'store', {
    get: function() {
      return achievementStore;
    }
  });

  return AchievementManager;

});

define('lyria/animation', ['jquery', 'mixedice', 'eventmap'], function($, mixedice, EventMap) {
  'use strict';
  
  var Animation = (function() {
    var Animation = function($elem, options) {
      this.$elem = $elem;
      
      var defaultOptions = {
        frame: {
          width: 0,
          height: 0,
          current: 0
        },
        speed: 1
      };
      
      options = $.extend(true, defaultOptions, options);
      
      this.frame = {};
      this.frame.width = options.frame.width;
      this.frame.height = options.frame.height;
      this.frame.current = options.frame.current;
      this.speed = options.speed;
      
      this.sprite = {};
      this.sprite.width;
      this.sprite.height;
      this.sprite.image = new Image();
      
      // Mix-in eventmap
      mixedice([this, Animation.prototype], new EventMap());
      
      this.on('play', function() {
        
      });
      
      this.on('pause', function() {
        
      });
      
      this.on('reset', function() {
        
      });
      
      this.on('stop', function() {
        
      });
    };
    
    return Animation;
  })();
  
  return Animation;
});

/**
 * @module Lyria
 */
define('lyria/audio', ['root', 'jquery'], function(root, $) {'use strict';

  var supportedTypes = {
    'mp3' : 'audio/mpeg',
    'wav' : 'audio/wav',
    'ogg' : 'audio/ogg'
  };

  /**
   * 
   *
   * @param {Object} options
   * @param {String} options.id
   * @param {String[]} options.paths
   * @param {Number} options.volume Volume between 0..1
   */
  var Audio = function(options) {
    options = $.extend({
      'id' : '',
      'volume' : 1.0,
      'loop' : 1,
      'paths' : []
    }, options);
    this.options = options;
    this.audio = new window.Audio();
    for (var i = 0; i < options.paths.length; i++) {
      var fileExtension = options.paths[i].split('.').pop();

      if (supportedTypes[fileExtension] && this.audio.canPlayType(supportedTypes[fileExtension])) {
        this.audio.type = supportedTypes[fileExtension];
        this.audio.src = options.paths[i];
        break;
      }
    }
    this.audio.volume = options.volume;
    this.audio.id = options.id;
    $('body').append(this.audio);
  };

  /**
   *
   * @param {String} loop amount of loops this song should be played (-1 if unlimited) 
   */
  Audio.prototype.play = function(loop) {
    if (loop != null) {
      this.options.loop = loop;
    }
    if (this.options.loop && this.options.loop > 0) {
      this.options.loop--;
    }
    this.audio.play();
  };

  Audio.prototype.pause = function() {
    this.audio.pause();
  };

  Audio.prototype.stop = function() {
    this.options.loop = 1;
    this.audio.pause();
    this.audio.currentTime = 0;
  };

  /**
   * Sets or gets properties of the audio object
   *
   * @param {Object} prop
   * @param {Object} value (optional)
   */
  Audio.prototype.attr = function(prop, value) {
    switch (prop) {
      case 'duration':
      case 'length':
        return this.audio.duration;
      case 'position':
      case 'pos':
        if ( typeof value === 'undefined') {
          return this.audio.currentTime;
        } else {
          this.audio.currentTime = value;
        }
        break;
      case 'loop':
        if ( typeof value === 'undefined') {
          return this.options.loop;
        } else {
          this.options.loop = value;
        }
        break;
      case 'volume':
      case 'vol':
        if ( typeof value === 'undefined') {
          return this.audio.volume;
        } else {
          this.audio.volume = value;
        }
        break;
    }
  };

  return Audio;
});

define('lyria/audio/manager', ['jquery', 'clamp', '../log', '../audio', 'mixedice', 'eventmap'], function($, clamp, Log, Audio, mixedice, EventMap) {
  'use strict';

  var AudioManager = function() {

    mixedice([this, AudioManager.prototype], new EventMap());
    this.audioFiles = {};
  };

  var volume = 1;
  // default

  Object.defineProperty(AudioManager, 'volume', {
    get : function() {
      return volume;
    },
    set : function(value) {
      volume = clamp(value, 0, 1);
    }
  });

  /**
   *
   * @param {Object} options
   * @param {String} options.type ['music', 'sound']
   * @param {String} options id
   * @param {Boolean} options loop
   * @param {Number} options volume
   * @param {Array} options paths paths to audio file with defined fallbacks
   *
   */
  AudioManager.prototype.add = function(options) {
    options = $.extend({
      'id' : '',
      'type' : 'sound',
      'loop' : false,
      'volume' : 1.0,
      'paths' : []
    }, options);

    // set volume in relation to current max volume
    options.volume *= volume;

    if (options.id === '') {
      Log.e('AudioManager.add: No id was given for new audio object');
      return;
    }

    this.audioFiles[options.id] = new Audio(options);
    this.trigger('added', options.id, this.audioFiles[options.id]);
    return this.audioFiles[options];
  };

  AudioManager.prototype.play = function(id, loop) {
    if (!this.audioFiles[id]) {
      Log.e('AudioManager.play: No audio element found under id ' + id);
      return;
    }
    
    $('#' + id).off('ended');
    $('#' + id).on('ended', {
      'audioFile' : this.audioFiles[id],
      'audioManager' : this,
      'id' : id
    }, function(event) {
      if (event.data.audioFile.attr('loop') > 0 || event.data.audioFile.attr('loop') === -1) {
        event.data.audioFile.play();
        event.data.audioManager.trigger('loopEnded', event.data.id, event.data.audioFile);
      } else {
        event.data.audioManager.trigger('ended', event.data.id, event.data.audioFile);
      }
    });
    
    this.audioFiles[id].play(loop);
    this.trigger('play', id, this.audioFiles[id]);
  };

  AudioManager.prototype.pause = function(id) {
    if (!this.audioFiles[id]) {
      Log.e('AudioManager.pause: No audio element found under id ' + id);
      return;
    }
    this.audioFiles[id].pause();
    this.trigger('paused', id, this.audioFiles[id]);
  };

  AudioManager.prototype.stop = function(id) {
    if (!this.audioFiles[id]) {
      Log.e('AudioManager.stop: No audio element found under id ' + id);
      return;
    }
    this.audioFiles[id].stop();
    // ended event should be triggered automatically
  };

  AudioManager.prototype.volume = function(id, volume) {
    if (!this.audioFiles[id]) {
      Log.e('AudioManager.volume: No audio element found under id ' + id);
      return;
    }
    if (volume) {
      this.audioFiles[id].volume = clamp(volume, 0, 1);
    } else {
      return this.audioFiles[id].volume;
    }
  };
  return AudioManager;
});

define('lyria/checkpoints', ['eventmap', 'mixedice', 'deleteitem', 'performance'], function(EventMap, mixedice, deleteItem, performance) {
  'use strict';

  var Checkpoints = (function() {
    
    /**
     * Checkpoints constructor
     *
     * @class Checkpoints
     * @constructor
     */
    var Checkpoints = function() {
      // Mix-in eventmap
      mixedice([this, Checkpoints.prototype], new EventMap());

      // Set start time
      this.startTime = performance.now();
      
      // List of all passed checkpoints
      this.checkpointList = [];
    };

    /**
     * Pass a checkpoint
     * 
     * @param {String} name
     */
    Checkpoints.prototype.pass = function(name) {
      // A checkpoint can only be passed once
      if (this.hasPassed(name)) {
        return;
      }
      
      this.checkpointList.push(name);
      
      this.trigger('pass', name, (performance.now() - this.startTime));
    };

    /**
     * Passes a checkpoint
     * 
     * @param {String} name
     */
    Checkpoints.prototype.hasPassed = function(name) {
      return (this.checkpointList.indexOf(name) !== -1);
    };

    /**
     * Reset a single or all checkpoints
     * 
     * @param {String} name
     */
    Checkpoints.prototype.reset = function(name) {
      if (this.checkpointList.length === 0) {
        return;
      }
      
      if (name == null) {
        var oldList = this.checkpointList;
        this.checkpointList = [];
        this.trigger('reset', oldList);
        return;
      }
      
      var index = this.checkpointList.indexOf(name);

      if (index === -1) {
        return;
      }

      this.checkpointList = deleteItem(this.checkpointList, index);
      this.trigger('reset', name);
    };

    return Checkpoints;
  })();
  
  return Checkpoints;

});

define('lyria/component', ['mixedice', 'eventmap', './component/manager', './log'], function(mixedice, EventMap, ComponentManager, Log) {
  'use strict';

  //Lyria.Component
  return (function() {

    var Component = function(name, factory) {
      mixedice([this, Component.prototype], new EventMap());
      
      this.name = name != null ? name : this.constructor.name;
      
      this.type = 'Component';
      
      this.children = {};
      
      if (factory) {
        factory.apply(this, [this]);        
      }
      
      this.on('update', function(dt) {
        for (var key in children) {
          var value = children[key];
          if (value && value.trigger) {
            value.trigger('update', dt);
          }
        }
      });
    };
    
    /**
     * Adds a component to this entity
     * 
     * @method add
     * @param {Object} child
     */
    Component.prototype.add = function(child) {
      var name = 'anonymous-' + Date.now();
      var childObject = null;
      
      if (typeof child === 'string') {
        name = child;
        childObject = ComponentManager.get(name);
      } else {
        name = child.name || name;
        childObject = child;
      }
      
      children[name] = childObject;
      
      this.trigger('add', name);
      childObject.trigger('added', this);
    };
    
    /**
     * Removes a component from the entity
     *  
     * @method remove
     * @param {String} name
     */
    Component.prototype.remove = function(name) {
      if (name == null) {
        return;
      }
      
      delete children[name];
      
      this.trigger('remove', name);
    };
    
    /**
     * Logs from the component itself
     * 
     * @method log
     * @param {String} text
     */
    Component.prototype.log = function(text) {
      if (this.type === this.name) {
        Log.i(this.type + ': ' + text);                
      } else {
        Log.i('[' + this.type + '] ' + this.name + ': ' + text);        
      }
    };

    return Component;

  })();

});

define('lyria/component/manager', function() {
  'use strict';

  var components = {};

  var ComponentManager = {};

  ComponentManager.add = function(component) {
    var name = component.name || 'anonymous-' + Date.now();

    components[name] = component;
  };

  ComponentManager.remove = function(name) {
    if (name == null) {
      return;
    }
    
    delete ComponentManager[name];
  };
  
  ComponentManager.get = function(name) {
    return components[name];
  };

  return ComponentManager;

});

// General constants
define('lyria/constants', {
  animSpeed: 300
});
define('clamp', function() {
  'use strict';
  
  var clamp = function(value, min, max) {
    var _ref, _ref1, _ref2;
    if ( typeof value === 'object') {
      _ref = value, min = _ref.min, max = _ref.max, value = _ref.value;
    }
    if (Array.isArray(min)) {
      _ref1 = min, min = _ref1[0], max = _ref1[1];
    }
    if (min == null) {
      min = 0.0;
    }
    if (max == null) {
      max = 1.0;
    }
    if (min > max) {
      _ref2 = [max, min], min = _ref2[0], max = _ref2[1];
    }
    if ((min <= value && value <= max)) {
      return value;
    } else {
      if (value > max) {
        return max;
      } else {
        return min;
      }
    }
  };

  return clamp;
});

define('deleteitem', function() {
  'use strict';
  
  var deleteItem = function(obj, item) {
    var i, key, newObject, num, _i, _len, _results;
    if (Array.isArray(obj)) {
      _results = [];
      for ( num = _i = 0, _len = obj.length; _i < _len; num = ++_i) {
        i = obj[num];
        if (num !== item) {
          _results.push(i);
        }
      }
      return _results;
    } else {
      newObject = {};
      for (key in obj) {
        if (key !== item) {
          newObject[key] = obj[key];
        }
      }
      return newObject;
    }
  };

  return deleteItem;
});

define('fisheryates', ['random'], function(random) {
  'use strict';
  
  /**
   * Randomize array element order in-place.
   * Using Fisher-Yates shuffle algorithm.
   */
  return function(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = random(i + 1);
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };
});

(function() {'use strict';

  define('requestfullscreen', function() {
    return function(element) {
      if (element.requestFullScreen) {
        element.requestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
    };
  });

  define('fullscreenelement', function() {
    return function(element) {
      return (element.fullscreenElement || element.mozFullScreenElement || element.webkitFullscreenElement);
    };
  });

  define('cancelfullscreen', function() {
    return function(element) {
      if (element.cancelFullScreen) {
        element.cancelFullScreen();
      } else if (element.mozCancelFullScreen) {
        element.mozCancelFullScreen();
      } else if (element.webkitCancelFullScreen) {
        element.webkitCancelFullScreen();
      }
    };
  });

  define('fullscreen', ['requestfullscreen', 'fullscreenelement', 'cancelfullscreen'], function(rf, fs, cf) {
    return {
      request: rf,
      isFullscreen: fs,
      cancel: cf
    };
  });
  
})(); 
define('hbs', ['handlebars', 'handlebars.runtime'], function(hbs, hbsRuntime) {
  'use strict';
  
  return ((hbs && hbs['default']) || hbsRuntime);
});
define('jqueryify', ['jquery'], function($) {
  'use strict';
  
  return function(sel) {
    return (sel instanceof $) ? sel : $(sel);
  };
});
/**
 * Trying to find a better alternative than setTimeout(fn, 0)
 * requestAnimationFrame should be a better alternative
 */
define('nexttick', ['requestanimationframe', 'cancelanimationframe'], function(requestAnimationFrame, cancelAnimationFrame) {
  'use strict';
  
  return function(fn) {
    var id = requestAnimationFrame(function() {
      if (fn != null) {
        fn();
      }
      cancelAnimationFrame(id);
    });
  };
});

define('objectify', function() {
  'use strict';
  
  return function(arr) {
    if (typeof arr === 'object') {
      if (!Array.isArray(arr)) {
        return arr;
      }
    } else {
      return {};
    }

    var rv = {};
    for (var i = 0, j = arr.length; i < j; i++) {
      if (arr[i] != null) {
        rv[i] = arr[i];
      }
    }
    return rv;
  };
});

define('options', ['jquery'], function($) {
  'use strict';
  
  return function(obj, defaultOptions) {
    return $.extend(true, obj, defaultOptions);
  };
});

define('path', function() {
  'use strict';
  
  var delimiter = '/';

  var Path = {
    join: function(arr) {
      var pathArray = (function() {
        var result = [];

        for (var i = 0, j = arr.length; i < j; i++) {
          if (arr[i] != null && arr[i] !== '') {
            result.push(arr[i]);
          }
        }

        return result;
      })();
      return pathArray.join(delimiter);
    },
    resolve: function(base, relativeStr) {
      if (!Array.isArray(relativeStr)) {
        relativeStr = relativeStr.split(delimiter);
      }

      var baseArray = base.split(delimiter);
      var result = [];

      var completeArr = baseArray.concat(relativeStr);

      // Last identifier should not be ..
      var lastElement = completeArr.length - 1;
      
      if ((completeArr[lastElement] === '..') || (completeArr[lastElement] === '.')) {
        completeArr[lastElement] = '';
      }

      for (var i = 0, j = completeArr.length; i < j; i++) {
        if (completeArr[i] != null && completeArr[i] !== '') {
          if (completeArr[i] === '.') {
            continue;
          }

          if (completeArr[i + 1] === '..') {
            completeArr[i] = '';
            completeArr[i + 1] = '';

            continue;
          }

          result.push(completeArr[i]);
        }
      }

      return Path.join(result);
    },
    dotToPath: function(str) {
      if (!str) {
        return;
      }
      
      if (~str.indexOf('.')) {
        return Path.join(str.split('.'));        
      } else {
        return str;
      }
      
    }
  };

  return Path;
});

define('random', function() {
  'use strict';
  
  return function(max, min) {
    if (max == null) {
      max = 1.0;
    }
    
    if (min == null) {
      min = 0.0;
    }
    
    return Math.floor(Math.random() * (max - min)) + min;
  };
});
(function(root) {
  'use strict';
  
  define('root', function() {
    return root;
  });
})(this);
/*
* object.watch polyfill
*
* 2012-04-03
*
* By Eli Grey, http://eligrey.com
* Public Domain.
* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*/

(function(Object) {
  'use strict';
  
  // object.watch
  if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
      enumerable: false,
      configurable: true,
      writable: false,
      value: function(prop, handler) {
        var oldval = this[prop], newval = oldval, getter = function() {
          return newval;
        }, setter = function(val) {
          oldval = newval;
          newval = handler.call(this, prop, oldval, val);
          return newval;
        };
  
        if (
        delete this[prop]) {// can't watch constants
          Object.defineProperty(this, prop, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
          });
        }
      }
    });
  }
  
  // object.unwatch
  if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
      enumerable: false,
      configurable: true,
      writable: false,
      value: function(prop) {
        var val = this[prop];
        delete this[prop];
        // remove accessors
        this[prop] = val;
      }
    });
  }
})(Object);


define('lyria/core/watch', function() {  });
/**
 * @module Lyria
 */
define('lyria/game', ['eventmap', 'mixedice', 'fullscreen', 'jquery', './viewport', './scene/director', './preloader', './loop', './world', './checkpoints'], function(EventMap, mixedice, fullscreen, $, Viewport, Director, Preloader, Loop, World, Checkpoints) {'use strict';

  /**
   * Game class which has a viewport, scene director and preloader by
   * default.
   *
   * @class Game
   */
  return (function() {

    /**
     * @constructor
     */
    var Game = function(options) {
      var self = this;

      options = $.extend({
        startLoop: true
      }, options);
      
      mixedice([this, Game.prototype], new EventMap());

      /**
       * @property viewport
       * @type {Viewport}
       */
      // Set up a viewport
      this.viewport = new Viewport();
      this.viewport.parent = this;

      /**
       * @property director
       * @type {Director}
       */
      // Add a scene director
      this.director = new Director(this.viewport);
      this.director.parent = this;

      /**
       * @property preloader
       * @type {Preloader}
       */
      // Add a preloader
      this.preloader = new Preloader();
      this.preloader.parent = this;

      // Bind the scene director to the preloader reference
      this.preloader.sceneDirector = this.director;
      
      this.paused = false;
      
      // Mute
      this.mute = false;
      
      // World reference
      this.world = new World();
      this.world.parent = this;
      
      // Checkpoints
      this.checkpoints = new Checkpoints();

      // Add an update task to the loop with updates the scene director on each
      // frame
      Game.Loop.on('update', function(dt) {
        self.director.trigger('update', dt);
      });
      
      // Run game loop (if it should start by default)
      // In most cases, you'll need the loop (animation/physics/etc.)
      // In a pure event-based game - like a turn-based-strategy game -
      // you might want turn startLoop off
      if (options.startLoop) {
        Game.Loop.run();
      }
      
      this.on('pause', function() {
        self.paused = true;
      });
      
      this.on('resume', function() {
        self.paused = false;
      });
      
      this.on('fullscreen', function() {
        var viewportElement = self.viewport.$element[0];
        
        if (!viewportElement) {
          return;
        }
        
        if (fullscreen.isFullscreen(viewportElement)) {
          fullscreen.cancel(viewportElement);
        } else {
          fullscreen.request(viewportElement);
        }
      });
      
      $(document).ready(function() {
        if (self.pause) {
          $(window).blur(function() {
            self.pause();
          });          
        }
        
        if (self.resume) {
          $(window).focus(function() {
            self.resume();
          });          
        }
      });
    };
    
    /**
     * 
     */
    Game.prototype.addScene = function(name, data) {
      var self = this;
      
      if (!name) {
        return this;
      }
      
      if (Array.isArray(name)) {
        for (var i = 0, j = name.length; i < j; i++) {
          (function(item) {
            if (typeof item === 'object') {
              self.addScene(item.name, item.data);
            } else {
              self.addScene(item);
            }
          })(name[i]);
        }
      }
      
      this.preloader.taskAsync(function(done) {
        self.director.add(name, data, done);
      });
      
      return this;
    };
    
    /**
     * 
     */
    Game.prototype.showScene = function(name) {
      this.director.show(name);
    };
    
    /**
     * @property Loop
     * @static
     * @type {Loop}
     */
    // Store the reference to the Lyria Loop at the Game object
    Game.Loop = Loop;

    return Game;

  })();

}); 
define('lyria/gameobject', ['mixedice', 'eventmap', './component', './log'], function(mixedice, EventMap, Component, Log) {
  'use strict';
  
  /**
   * @module lyria/gameobject
   */
  
  //Lyria.GameObject
  return (function() {
    
    // Constructor
    var GameObject = function() {
      mixedice([this, GameObject.prototype], new EventMap());
      
      var self = this;
      
      this.components = {};
      this.className = 'gameobject';
      
      this.template = {};
      this.template.source = '<div id="{{id}}" class="{{className}}"></div>';
      
      this.on('update', function(dt) {
        if (_.isEmpty(self.components)) {
          return;
        }
        
        _.each(self.components, function(key, value) {
          value.trigger('update', dt);
        });
      });
    };
    
    /**
     * Refreshes the game object
     *
     * @param {Object} val
     */
    GameObject.prototype.refresh = function(val) {
      if (val == null && this.template) {
        val = this.template.data;
      }

      if (this.template && this.template.source) {
        this.content = this.template.source(val);
      }

      this.trigger('refresh');
    };
    
    GameObject.prototype.add = function(component) {
      if (component instanceof Component) {
        this.components[component.name] = component;
      }
    };
    
    GameObject.prototype.execute = function(functionBody) {
      functionBody.apply(this, this);
    };
    
    GameObject.prototype.log = function(text) {
      Log.i('GameObject: ' + text);
    };
    
    return GameObject;
    
  })();
  
});
define('lyria/input', function() {
  'use strict';
  
  var Input = {};
  
  Input.key = {};
  Input.mouse = {};
  
  Input.key.down = function(key) {
    
  };
  
  Input.key.up = function(key) {
    
  };
  
  Input.mouse.down = function() {
    
  };
  
  Input.mouse.up = function() {
    
  };
  
  return Input;
});
define('lyria/input/key', function() {
  'use strict';
  
  var Key = {
    'backspace': 8,
    'tab': 9,
    'enter': 13,
    'shift': 16,
    'ctrl': 17,
    'alt': 18,
    'escape': 27,
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'insert': 45,
    'delete': 46,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 69,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,
    'numpad0': 96,
    'numpad1': 97,
    'numpad2': 98,
    'numpad3': 99,
    'numpad4': 100,
    'numpad5': 101,
    'numpad6': 102,
    'numpad7': 103,
    'numpad8': 104,
    'numpad9': 105,
    'f1': 112,
    'f2': 113,
    'f3': 114,
    'f4': 115,
    'f5': 116,
    'f6': 117,
    'f7': 118,
    'f8': 119,
    'f9': 120,
    'f10': 121,
    'f11': 122,
    'f12': 123,
    'semiColon': 186,
    'equalSign': 187,
    'comma': 188,
    'dash': 189,
    'period': 190,
    'forwardSlash': 191,
    'openBracket': 219,
    'backSlash': 220,
    'closeBraket': 221,
    'singleQuote': 222
  };
  
  Key.define = function(name, key) {
    if (name == null || key == null) {
      return;
    }
    
    if (!Object.hasOwnProperty.call(Key, name)) {
      if (typeof key === 'function') {
        Object.defineProperty(Key, name, {
          get: key
        });
      } else {
        Key[name] = key;        
      }
    }
  };

  return Key;

});

define('lyria/language', ['detectr', 'eventmap', './mixin/language'], function(detectr, EventMap, langMixin) {
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
define('lyria/layer', ['mixedice', './gameobject'], function(mixedice, GameObject) {
  'use strict';
  /**
   * @module lyria/layer
   */

  return (function() {

    /**
     * @class Layer
     * @extends Lyria.GameObject 
     * @constructor
     */
    var Layer = function() {
      mixedice(this.prototype, new GameObject());
    };

    return Layer;

  })();
}); 
define('lyria/localization/group', ['../localization'], function(Localization) {
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

define('lyria/localization', ['./language', './template/string', './mixin/language'], function(Language, templateString, langMixin) {
  'use strict';

  var Localization = (function() {
    var Localization = function(data) {
      if (data == null) {
        data = {};
      }
      
      this.data = data;

      var langValue = Language.language;

      langMixin('language', 'change')(this, langValue, this);
    };

    /**
     * Gets all localizable elements from a localization 
     */
    Localization.elements = function(localeData, localeLang, fallbackLang) {
      if (fallbackLang == null) {
        fallbackLang = 'en';
      }
      
      return function(name, parameter) {
        if (!localeData || Object.keys(localeData).length === 0) {
          return '[[No language data found]]';          
        }
        
        if (!localeData[localeLang] || Object.keys(localeData[localeLang]).length === 0) {
          localeLang = fallbackLang;
        }
        
        if (localeData[localeLang]) {
          
          if (localeData[localeLang][name] == null) {
            return '[[Missing localization for ' + name + ']]';
          }

          if ( typeof localeData[localeLang][name] === 'string') {
            return templateString.process(localeData[localeLang][name], parameter);
          } else {
            return {
              plural: function(n) {
                if (localeData[localeLang][name][n]) {
                  return templateString.process(localeData[localeLang][name][n], parameter);
                } else {
                  return templateString.process(localeData[localeLang][name]['n'], parameter);
                }
              }
            };
          }
        } else {
          return '[[No language definition found for ' + localeLang + ']]';
        }
      };
    };

    /**
     * Check if name does exist in the localization
     * 
     * @param {String} name
     */
    Localization.prototype.exists = function(name) {
      return !!(this.data && this.data[this.language] && this.data[this.language][name]);
    };

    /**
     * Shorthand function to use translation 
     */
    Localization.prototype.t = function() {
      return Localization.elements(this.data, this.language).apply(this, arguments);
    };

    return Localization;
  })();

  return Localization;
});
define('lyria/log', ['root'], function(root) {
  'use strict';
  /**
   * @module lyria/log
   */
  
  /**
   * @class Log 
   */
  var Log = (function() {

    var Log = {};

    Log.connector = null;

    Log.plugins = {};

    Log.plugins.console = {
      e: function() {
        if (root.console && root.console.error) {
          return root.console.error.apply(console, arguments);
        }
      },
      w: function() {
        if (root.console && root.console.warn) {
          return root.console.warn.apply(console, arguments);
        }
      },
      i: function() {
        if (root.console && root.console.info) {
          return root.console.info.apply(console, arguments);
        }
      },
      d: function() {
        if (root.console && root.console.log) {
          return root.console.log.apply(console, arguments);
        }
      },
      v: function() {
        if (root.console && root.console.log) {
          return root.console.log.apply(console, arguments);
        }
      }
    };

    Log.connector = Log.plugins.console;

    Log.logLevelMap = {
      'error': ['e'],
      'warn': ['w', 'e'],
      'info': ['i', 'w', 'e'],
      'debug': ['d', 'i', 'w', 'e'],
      'verbose': ['v', 'd', 'i', 'w', 'e']
    };

    Log.logLevel = 'verbose';

    var logFunctions = ['v', 'd', 'i', 'w', 'e'];

    for (var i = 0, j = logFunctions.length; i < j; i++) {

      (function(iterator) {
        Log[iterator] = function() {
          if (Log.logLevelMap[Log.logLevel].indexOf(iterator) >= 0) {
            Log.connector[iterator].apply(this, arguments);
          }
        };        
      })(logFunctions[i]);
      
    }

    return Log;

  })();

  // Map shorthand functions to Log.i
  root.log = root.out = Log.i;
  
  return Log;
});
define('lyria/loop', ['requestanimationframe', 'eventmap'], function(requestAnimationFrame, EventMap) {
  /**
   * @module lyria/loop
   */
  
  'use strict';
  
  var loopEvents = new EventMap();
  var pausedEvents = {};
  
  /**
   * @class Loop
   * @static 
   */
  return (function() {

    var isRunning = true;

    /**
     * @method run 
     */
    var run = function() {
      var time;

      (function loop() {
        requestAnimationFrame(loop);

        var now = performance.now() || Date.now();
        var dt = now - (time || now);

        time = now;

        if (!isRunning) {
          return;
        }

        var eventKeys = Object.keys(loopEvents.events);
        
        for (var i = 0, j = eventKeys.length; i < j; i++) {
          (function(key) {
            if (!pausedEvents[key]) {
              loopEvents.trigger(key, dt);
            }
          })(eventKeys[i]);
        }
      })();
    };

    /**
     * @method stop 
     */
    var stop = function() {
      isRunning = false;
    };

    var clear = function() {
      loopEvents.clear();
      pausedEvents = {};
    };
    
    var on = function(taskName, taskFunction) {
      loopEvents.on(taskName, taskFunction);
      pausedEvents[taskName] = false;
    };
    
    var off = function(taskName) {
      loopEvents.off(taskName);
      if (pausedEvents[taskName] != null) {
        delete pausedEvents[taskName];        
      }
    };

    var pause = function(taskName) {
      pausedEvents[taskName].paused = true;
    };

    var resume = function(taskName) {
      if (taskName == null) {
        isRunning = true;
        return;
      }
      
      pausedEvents[taskName].paused = false;
    };


    return {
      run: run,
      
      stop: stop,
      clear: clear,
      
      on: on,
      off: off,
      
      pause: pause,
      resume: resume
    };
  })();
  
});
/**
 * Mixin language property into objects
 * TODO: Refactor this to use mixedice library
 */

define('lyria/mixin/language', function() {
  'use strict';
  
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
define('lyria/mixin/templatable', function() {
  'use strict';
  
  return function() {
    
  };
});

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/prefab', ['./scene'], function(Scene) {
	'use strict';

  // TODO: Allow own Prefab.requireAlways similar to Scene.requireAlways

	//Lyria.Prefab
	return Scene;
  
});
define('lyria/prefab/manager', ['jqueryify', 'jquery', 'root'], function($ify, $, root) {
  'use strict';
  
  var PrefabManager = {};

  PrefabManager.prefabs = {};
  PrefabManager.viewport = null;
  PrefabManager.className = 'prefab';

  var createElement = function(type) {
    return function(options, data) {
      var name = options.name;
      var parent = options.parent;
      
      // TODO: Streamline the way of passing data to scenes and prefabs
      data = data || options.data || {};
      
      if (options.wrap == null) {
        options.wrap = true;
      }
      
      // TODO: Wrap typically wraps the content - this is default behavior right now
      var wrap = options.wrap;
      
      if (parent == null) {
        parent = ((PrefabManager.viewport) ? PrefabManager.viewport.$element :
        void 0) || 'body';
      }
      
      var prefab = null;
      
      var prefabId = PrefabManager.className + '-' + name + '-' + Date.now();
      
      data.id = prefabId;
      
      if (!PrefabManager.prefabs[name]) {
        throw new Error('No valid prefab called ' + name + ' found.');
      } else {
        prefab = PrefabManager.prefabs[name](data);
      }

      var $parent = $ify(parent);

      if ($parent) {
        if ($('#' + prefab.name).length === 0) {
          $parent[type]($(root.document.createElement('div')).attr('id', prefabId).attr('class', PrefabManager.className));
        }

        if (!prefab.isAsync) {
          prefab.trigger('added');
        }
      }
    };
  };

  PrefabManager.append = function() {
    createElement('append').apply(this, arguments);
  };

  PrefabManager.prepend = function() {
    createElement('prepend').apply(this, arguments);
  };
  
  PrefabManager.insert = function() {
    createElement('html').apply(this, arguments);
  };

  return PrefabManager;
});

define('lyria/preloader', ['root', 'mixedice', 'jquery', './resource', './log', 'eventmap'], function(root, mixedice, $, Resource, Log, EventMap) {'use strict';
  /**
   * @module lyria/preloader
   */

  /**
   * Provides a preloader to load assets before they are needed
   *
   * @class Preloader
   */
  var Preloader = (function() {

    /**
     * @constructor
     *
     * @param {Object} assetObject
     */
    var Preloader = function(assetObject) {
      mixedice([this, Preloader.prototype], new EventMap());

      /**
       * @property assets
       * @type {Array}
       */
      if (assetObject != null) {
        this.assets = assetObject;
      } else {
        this.assets = {};
      }

      /**
       * @property maxAssets
       * @type {Number}
       * @default 0
       */
      this.maxAssets = 0;

      /**
       * @property assetsLoaded
       * @type {Number}
       * @default 0
       */
      this.assetsLoaded = 0;

      /**
       * @property percentLoaded
       * @type {Number}
       * @default 0
       */
      this.percentLoaded = 0;

      /**
       * @property taskList
       * @type {Array}
       */
      this.taskList = [];
    };

    /**
     * Adds a custom task to the preloader
     *
     * @param {Function} taskFn
     */
    Preloader.prototype.task = function(taskFn) {
      if ( typeof taskFn === 'function') {
        this.taskList.push({
          task: taskFn,
          async: false
        });
      }
    };

    /**
     * Adds a custom asynchronous task to the preloader
     *
     * @param {Function} taskFn
     */
    Preloader.prototype.taskAsync = function(taskFn) {
      if ( typeof taskFn === 'function') {
        this.taskList.push({
          task: taskFn,
          async: true
        });
      }
    };

    /**
     * Starts the preloader and loads all assets asynchronously. Triggers
     * events when necessary.
     *
     * @method start
     */
    Preloader.prototype.start = function() {
      // Check if it's valid
      if (this.assets == null) {
        throw new Error('Assets should not be null. Pass at least an empty object.');
      }

      this.trigger('start');

      var totalSize = 0;

      // Trigger complete event if there is nothing to load
      if (Object.keys(this.assets).length > 0) {
        totalSize = this.assets.totalSize;
      }

      var currentProgress = 0;

      var hasLoadingScene = this.sceneDirector != null && this.loadingScene != null;

      if (hasLoadingScene) {
        this.sceneDirector.show(this.loadingScene);
      }

      var self = this;
      
      var loadCustomTasks = function(done) {
        var maxTasks = self.taskList.length;
        var currentTasks = 0;

        var checkIfComplete = function() {
          if (currentTasks === maxTasks) {
            done();
          }
        };
        
        var doneFn = function() {
          currentTasks++;
          checkIfComplete();
        };

        if (self.taskList.length === 0) {
          done();
        } else {
          for (var i = 0, j = self.taskList.length; i < j; i++) {
            (function(item) {
              if (item.async) {
                item.task.call(this, doneFn);
              } else {
                item.task();
                doneFn();
              }
            })(self.taskList[i]);
          }
        }

      };

      var loadingProgress = function() {

        var percentLoaded = 100;

        if (currentProgress !== totalSize) {
          percentLoaded = currentProgress / totalSize;
        }

        self.trigger('progress', percentLoaded);

        if (hasLoadingScene) {
          self.sceneDirector.currentScene.trigger('progress', percentLoaded, currentProgress, totalSize);
        }

        if (currentProgress >= totalSize) {
          loadCustomTasks(function() {
            if (hasLoadingScene) {
              self.sceneDirector.currentScene.trigger('complete');
            }
  
            self.trigger('complete');
          });
        }
      };

      if (Object.keys(this.assets).length > 0) {
        // Go through all assets and preload them
        $.each(this.assets, function(key, value) {

          if (value.files == null || !Array.isArray(value.files) || value.files.length === 0) {
            return true;
          }

          for (var i = 0, j = value.files.length; i < j; i++) {
            (function(iterator) {
              // TODO: Define separate functions for loading process and error handling

              // Handle images here
              if (iterator.type.indexOf('image') === 0) {
                // TODO: Reflect: Does it make sense to put the cached images into an object?
                var img = new root.Image();
                img.onload = function() {
                  currentProgress += iterator.size;

                  loadingProgress();
                };

                img.onerror = function(err) {
                  Log.e('Error while loading ' + iterator.name);
                };

                img.src = iterator.name;
              } else {
                // Handle audio here
                if (iterator.type.indexOf('audio') === 0) {
                  // TODO: Save preloaded files in the AudioManager
                  var audio = new root.Audio();
                  audio.src = iterator.name;
                  
                  audio.addEventListener('canplaythrough', function() {
                    currentProgress += iterator.size;

                    loadingProgress();
                  });
                  
                  audio.onerror = function(err) {
                    Log.e('Error while loading '+ iterator.name);
                  };
                } else {
                  $.ajax({
                    url: iterator.name,
                    dataType: 'text'
                  }).always(function() {
                    currentProgress += iterator.size;
  
                    loadingProgress();
                  }).error(function(err) {
                    Log.e('Error while loading ' + iterator.name + ': ' + err);
                  });
                }
              }

            })(value.files[i]);
          }
        });
      } else {
        loadingProgress();
      }

    };

    return Preloader;

  })();

  return Preloader;
});

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/resource', ['path'], function(Path) {
  'use strict';
  
  var Resource = {
    /**
     *
     */
    path: {
      assets: 'assets',
      audio: 'audio',
      data: 'data',
      image: 'images',
      scene: 'scenes',
      video: 'video',
      prefab: 'prefabs'
    },
  
    /**
     * Returns the relative filename to an asset by filename and type
     * 
     * @param {String} filename
     * @param {String} type
     */
    name: function(filename, type) {
      if (!filename) {
        return;
      }
  
      var assetPath = Resource.path['assets'];
      var typePath = (Resource.path[type]) ? (Resource.path[type]) : type;
      
      return Path.resolve(assetPath, [Path.dotToPath(typePath), filename]);
    }
    
  };
  
  return Resource;
}); 
/**
 * @module Lyria
 * @submodule Scene
 */
define('lyria/scene/director', ['root', 'mixedice', 'jquery', 'eventmap', '../scene', '../viewport'], function(root, mixedice, $, EventMap, Scene, Viewport) {'use strict';

  /**
   * The scene director is the manager for all scenes
   *
   */
  return (function() {

    /**
     * The scene director constructor
     * Attaches a scene director to a container, the parent is optional
     *
     * @class Director
     * @constructor
     *
     * @param {Object} container
     * @param {Object} parent
     */
    function SceneDirector(container, parent) {
      mixedice([this, SceneDirector.prototype], new EventMap());

      if ( container instanceof Viewport) {
        this.viewport = container;
      } else {
        this.viewport = new Viewport(container, {
          parent: parent
        });
      }

      /**
       * All scenes
       *
       * @property sceneList
       * @type {Object}
       */
      this.sceneList = {};

      /**
       * @property className
       * @type {String}
       */
      this.className = 'scene';

      /**
       * The current scene
       *
       * @property currentScene
       * @type {Scene}
       */
      this.currentScene = null;

      /**
       * The default scene
       *
       * @property defaultScene
       * @type {String}
       */
      this.defaultScene = null;

      /**
       * Define events for scene director
       *
       */
      this.on('render', function() {
        if (this.currentScene) {
          this.currentScene.trigger('render');
        }
      });

      this.on('update', function(dt) {
        if (this.currentScene) {
          this.currentScene.trigger('update', dt);
        }
      });
    }

    /**
     * Adds a scene to the scene director
     *
     * @method add
     * @param {Object} scene
     * @param {Object} data
     */
    SceneDirector.prototype.add = function(scene, data, done) {

      // Shorthand to add all scenes to the scene director
      if (scene === '*' && this.scenes) {
        scene = Object.keys(this.scenes);
      }

      // Allow array as scenes
      if (Array.isArray(scene)) {
        for (var i = 0, j = scene.length; i < j; i++) {
          this.add(scene[i], data, done);
        }
        return;
      }

      // Handle string - Check in scene list
      if (this.scenes && Object.keys(this.scenes).length > 0) {
        scene = this.scenes[scene](data);
      } else {
        // Scene object
        if ( scene instanceof Scene) {
          // Add to scenes if it's an actual scene
          if (data) {
            scene.data = data;
          }
          this.scenes[scene.name] = scene;
        } else {
          // Function
          if ( typeof scene === 'function') {
            var sceneObj = scene(data);

            this.scenes[sceneObj.name] = sceneObj;
          } else {
            // Well, if none of these - There is only one choice
            throw new Error('No valid scene found.');
          }
        }
      }

      // Set scene parent
      scene.parent = this;

      // Update reference to the game itself
      if (this.parent != null) {
        scene.game = this.parent;
      }

      // Add first scene as a default scene
      if (Object.keys(this.sceneList).length === 0) {
        this.defaultScene = scene.name;
      }

      // Set scene in sceneList
      this.sceneList[scene.name] = scene;

      if (this.viewport.$element) {
        if ($('#' + scene.name).length === 0) {
          this.viewport.$element.prepend($(root.document.createElement('div')).attr('id', scene.name).attr('class', this.className));
        }
      }

      scene.trigger('added', done);

      return this;
    };

    /**
     * Shows a specified scene
     *
     * @method show
     * @param {String} scene name of scene
     * @param {Object} options
     * @param {Function} callback
     */
    SceneDirector.prototype.show = function(sceneName, options, callback) {
      if (!sceneName) {
        return;
      }

      // More than one scene visible at the same time
      if ($('.' + this.className + ':visible')) {
        $('.' + this.className).hide();
      }

      if (this.currentScene) {
        if (this.currentScene.transition && this.currentScene.length) {
          $('#' + this.currentScene).hide(this.currentScene.transition.length, function() {
            $('.' + this.className).hide();
          });
        } else {
          $('.' + this.className).hide();
        }

        this.currentScene.trigger('deactivate', options);
      }

      var self = this;

      self.currentScene = this.sceneList[sceneName];

      if (self.currentScene.transition && self.currentScene.transition.length) {
        $('#' + sceneName).show(self.currentScene.transition.length);
      } else {
        $('#' + sceneName).show();
      }
      this.trigger('scene:change', sceneName);
      
      self.currentScene.trigger('active', options);

      if (callback) {
        callback(sceneName);
      }
    };

    /**
     * Refreshes a scene
     *
     * @method refresh
     * @param {String} scene
     */
    SceneDirector.prototype.refresh = function(scene) {
      var sceneObj = (scene) ? this.sceneList[scene] : this.currentScene;

      // Re-compile scene template
      sceneObj.refresh();
    };

    return SceneDirector;

  })();
}); 
/**
 * @module Lyria
 */
define('lyria/scene', ['jquery', 'mixedice', 'nexttick', './component', './gameobject', './log', './localization'], function($, mixedice, nextTick, Component, GameObject, Log, Localization) {'use strict';

  var createNamespace = function(obj, chain, value) {
    if (Array.isArray(chain)) {
      for (var c = 0, cl = chain.length; c < cl; c++) {
        createNamespace(obj, chain[c], value);
      }
      return;
    }
    
    var chainArr = chain.split('.');

    for (var i = 0, j = chainArr.length; i < j; i++) {
      (function(item, lastElem) {
        if (lastElem) {
          obj[item] = value;
        } else {
          obj[item] = obj[item] || {};
        }

        obj = obj[item];
      })(chainArr[i], i === j - 1);
    }
  };

  var Scene = (function() {

    /**
     * Scene constructor
     *
     * @class Scene
     * @constructor
     */
    
    // TODO: Having options as the last parameter is kinda unintuitive
    var Scene = function(sceneName, sceneDeps, sceneFunction, options) {
      if (!sceneName) {
        return;
      }

      if ( typeof sceneDeps === 'function') {
        options = sceneFunction;
        sceneFunction = sceneDeps;
        sceneDeps = {};
      }

      // Mixin event map into Scene
      // Sender: "scene:#{sceneName}"
      mixedice([this, Scene.prototype], new Component(sceneName));

      // We need a reference to the scene not being this
      var self = this;

      // Set type
      this.type = 'Scene';
      
      // Data
      this.data = options.data || {};

      // Default values
      this.localization = new Localization();

      // Default event value
      this.defaultEvent = 'click';
      
      // DOMEvents object
      this.DOMEvents = {};

      // Template values
      this.template = {};
      this.template.source = null;
      this.template.helpers = {};
      this.template.partials = {};
      
      // Collect all template values
      this.template.data = {};

      // Children object
      // TODO: This is not needed, if a scene is actually a component - maaagic!
      this.children = this.children || {};
      this.children.gameObjects = {};
      this.children.prefabs = {};
      
      // Set Id
      this.id = this.data.id || self.name;

      // Expose function for template values
      this.expose = function(obj) {
        if (!obj || $.isEmptyObject(obj)) {
          return;
        }

        self.template.data = $.extend(true, self.template.data, obj);
      };

      // Getter to have a safe way to the element of a scene
      Object.defineProperty(self, '$element', {
        get: function() {
          return $('#' + self.id);
        }
      });

      // Synchronizes events and scene view
      self.on('synchronize', function(callback) {
        self.refresh();

        if (self.DOMEvents && !$.isEmptyObject(self.DOMEvents)) {
          self.DOMEvents.delegate = '#' + self.id;
        }

        // Your typical stock-of-the-mill update function
        self.on('update', function(dt) {
          $.each(self.children, function(childKey, childValue) {
            if (!$.isEmptyObject(childValue)) {
              $.each(childValue, function(key, value) {
                value.trigger('update', dt);
              });
            }
          });
        });

        // Bind events
        if (self.DOMEvents && !$.isEmptyObject(self.DOMEvents)) {
          $.each(self.DOMEvents, function(key, value) {
            if (( typeof value === 'object') && (key !== 'delegate')) {
              $(self.DOMEvents.delegate).on(value, key, {
                scene: self
              });
            }
          });
        }

        // Data binding
        // TODO: Find a better way than using Object.watch
        if (self.template.data && !$.isEmptyObject(self.template.data)) {
          self.$element.find('[data-bind]').each(function() {
            var $dataElem = $(this);

            var prop = $dataElem.data('bind');

            self.template.data.watch(prop, function(id, oldval, newval) {
              if (oldval !== newval) {
                $dataElem.html(newval);
              }

              return newval;
            });
          });
        }
        
        if (callback) {
          callback();          
        }
      });

      var createScene = function(modules, callback) {
        var sceneDone = function(err, success) {
          if (err) {
            return console.error('Error while executing scene ' + self.name + ': ' + err);
          }

          self.trigger('synchronize', callback);
        };

        var async = false;

        var context = self;
        context.async = function() {
          async = true;

          return function() {
            nextTick(function() {
              sceneDone();
            });
          };
        };

        if (!self.hasOwnProperty('isAsync')) {
          Object.defineProperty(self, 'isAsync', {
            get: function() {
              return async;
            }
          });
        }

        context.modules = modules;

        try {
          var success = sceneFunction.apply(context, [context, modules]);

          if (!async) {
            sceneDone(null, success);
          }
        } catch (e) {
          sceneDone(e);
        }
      };

      // Call scene
      var reqModules = Object.keys(Scene.requireAlways) || [];

      self.on('added', function(callback) {
        require(reqModules, function() {
          var importedModules = {};
  
          for (var i = 0, j = arguments.length; i < j; i++) {
            (function(dep) {
              createNamespace(importedModules, Scene.requireAlways[reqModules[i]], dep);
            })(arguments[i]);
          }
  
          sceneDeps = sceneDeps || {};
          var reqSceneModules = Object.keys(sceneDeps) || [];
  
          if (reqSceneModules.length) {
            require(reqSceneModules, function() {
  
              for (var k = 0, l = arguments.length; k < l; k++) {
                (function(sceneDep) {
                  createNamespace(importedModules, sceneDeps[reqSceneModules[j]], sceneDep);
                })(arguments[j]);
              }
  
              createScene(importedModules, callback);
            });
          } else {
            createScene(importedModules, callback);
          }
  
        });
      });
      
    };

    /**
     * Adds a gameobject to the scene
     *
     * @method add
     * @param {Object} child
     */
    Scene.prototype.add = function(child) {
      var self = this;

      if ( child instanceof GameObject) {
        this.children.gameObjects[child.name] = child;

        this.template.data.gameobject = (function() {
          var array = [];

          $.each(self.children.gameObjects, function(key, value) {
            array.push(value);
          });

          return array;
        })();

        this.trigger('add');

        return true;
      }

      if ( child instanceof GameObject) {
        this.children.prefabs[child.name] = child;

        this.template.data.gameobject = (function() {
          var array = [];

          $.each(self.children.gameObjects, function(key, value) {
            array.push(value);
          });

          return array;
        })();

        this.trigger('add');

        return true;
      }

      return false;
    };

    /**
     * Refreshes the scene (Re-renders the template)
     *
     * @method refresh
     * @param {Object} val
     */
    Scene.prototype.refresh = function(val) {
      if (val == null && this.template) {
        val = this.template.data;
      }

      // Add default helpers
      this.template.helpers['translate'] = Localization.elements(this.localization.data, this.localization.language);

      if (this.template && this.template.source) {
        this.content = this.template.source(val, {
          partials: this.template.partials,
          helpers: this.template.helpers
        });
      }

      if (this.$element.length > 0) {
        this.$element.html(this.content);
      }

      this.trigger('refresh');
    };

    /**
     * Sets an event to the event object (DOM events)
     *
     * @method bindEvent
     * @param {String} selector
     * @param {String} eventName
     * @param {Function} eventFunction
     */
    Scene.prototype.bindEvent = function(selector, eventName, eventFunction) {
      if (selector == null) {
        return;
      }

      this.DOMEvents[selector] = this.DOMEvents[selector] || {};

      if ( typeof eventName === 'function') {
        this.DOMEvents[selector][this.defaultEvent] = eventName;
      } else {
        if (typeof eventName === 'string') {
          this.DOMEvents[selector][eventName] = eventFunction;          
        } else {
          throw new Error('If you meant to bind more than one event, please use Scene#bindEvents');
        }
      }
    };

    /**
     * Binds a lot of events instead of a single one
     * 
     * @method bindEvents
     * @param {Object} eventObject
     * @see bindEvent
     */
    Scene.prototype.bindEvents = function(eventObject) {
      if (eventObject == null) {
        return;
      }
      
      for (var key in eventObject) {
        if (Object.hasOwnProperty.call(eventObject, key)) {
          this.DOMEvents[key] = eventObject[key];
        }
      }
    };

    /*
     * Unbinds a previously bound event
     *
     * @method unbindEvent
     * @param {String} selector
     * @param {String} eventName
     * @param {Function} eventFunction
     */
    Scene.prototype.unbindEvent = function(selector, eventName) {
      if (selector == null) {
        return;
      }

      if (eventName == null) {
        delete this.DOMEvents[selector];
      } else {
        delete this.DOMEvents[selector][eventName];
      }
    };
    
    /**
     * Unbinds a lot of events
     * 
     * @method unbindEvents
     * @param [Object] eventObject
     */
    Scene.prototype.unbindEvents = function(eventObject) {
      if (eventObject == null || eventObject === '*') {
        this.DOMEvents = {};
        return;
      }
      
      if (Array.isArray(eventObject)) {
        for (var i = 0, j = eventObject.length; i < j; i++) {
          if (this.DOMEvents[eventObject[i]]) {
            delete this.DOMEvents[eventObject[i]];
          }
        }
      } else {
        for (var key in eventObject) {
          if (Object.hasOwnProperty.call(eventObject, key)) {
            var value = eventObject[key];
            
            if (Array.isArray(value)) {
              for (var k = 0, l = value.length; k < l; k++) {
                delete this.DOMEvents[key][value[k]];
              }
            } else {
              delete this.DOMEvents[key][value];
            }
          }
        }
      }
    };

    /**
     * Gets localized value
     *
     * @param {Object} lang
     */
    Scene.prototype.t = function() {
      if (this.localization && this.localization.t) {
        return this.localization.t.apply(this.localization, arguments);
      } else {
        return;
      }
    };

    Scene.requireAlways = {
      // Third-party modules
      'jquery': ['jQuery', '$'],
      
      // Lyria modules
      'lyria/achievement': 'Lyria.Achievement',
      'lyria/achievement/manager': 'Lyria.AchievementManager',
      'lyria/animation': 'Lyria.Animation',
      'lyria/audio': 'Lyria.Audio',
      'lyria/checkpoints': 'Lyria.Checkpoints',
      'lyria/component': 'Lyria.Component',
      'lyria/gameobject': 'Lyria.GameObject',
      'lyria/log': 'Lyria.Log',
      'lyria/loop': 'Lyria.Loop',
      'lyria/prefab/manager': 'Lyria.PrefabManager',
      'lyria/resource': 'Lyria.Resource',
      'lyria/tween': 'Lyria.Tween'
    };

    return Scene;

  })();

  return Scene;

});

define('lyria/serialize', ['jquery'], function($) {
  'use strict';
  
  /**
   *
   * @param {Object} anyObject
   *
   * @returns {String}
   */
  var serialize = function(anyObject) {
    if ((anyObject === undefined) || ( anyObject instanceof $)) {
      return;
    }
    
    if (typeof anyObject === 'function') {
      return anyObject.toString();
    }
    
    return JSON.stringify(anyObject, function(key, value) {
      if (value instanceof $) {
        return null;
      }
      
      if (typeof value === 'function') {
        value = value.toString();
      }
      
      return value;
    });
  };

  return serialize;
});

define('lyria/sprite', function() {
  'use strict';
  
  var Sprite = (function() {
    
    var Sprite = function() {
      
    };
    
    return Sprite;
    
  })();
  
  return Sprite;
});

define('lyria/sprite/manager', ['jquery', 'mixedice', '../component', '../sprite/renderer'], function($, mixedice, Component, Renderer) {
  'use strict';
  
  var SpriteManager = (function() {
    
    var SpriteManager = function() {
      var type = 'SpriteManager';
      
      mixedice([this, SpriteManager.prototype], new Component(type));
      this.type = type;
    };
    
    return SpriteManager;
    
  })();
  
  return SpriteManager;
  
});

define('lyria/sprite/renderer', function() {
  
});

 /**
 * @module Lyria
 * @submodule Template 
 */
define('lyria/template/connector', ['./methods'], function(templateMethods) {
  'use strict';
  
  var noop = function() {
  };

  return (function() {

    /**
     * @class Connector 
     * @constructor
     */
    var TemplateConnector = function(functionRefs) {
      if ( typeof functionRefs === 'object') {
        var key, value;

        for (key in functionRefs) {
          value = functionRefs[key];

          if ( typeof value === 'function') {
            this[key] = value;
          }
        }

      }
    };

    for (var i = 0, j = templateMethods.length; i < j; i++) {
      (function(iterator) {
        TemplateConnector.prototype[iterator] = noop;
      })(templateMethods[i]);
    }

    return TemplateConnector;

  })();
}); 
/**
 * @module Lyria
 * @submodule Template
 */
define('lyria/template/engine', ['hbs', './connector', './methods'], function(Handlebars, TemplateConnector, templateMethods) {
  'use strict';

  var noop = function() {
  };

  /**
   * @class Engine
   * @constructor
   *
   * @param {Object} templateConnector
   */
  var TemplateEngine = function(templateConnector) {
    if ( templateConnector instanceof TemplateConnector) {
      for (var i = 0, j = templateMethods.length; i < j; i++) {
        (function(iterator) {
          if ((templateConnector[iterator] != null) && ( typeof templateConnector[iterator] === 'function')) {
            TemplateEngine[iterator] = templateConnector[iterator];
          } else {
            TemplateEngine[iterator] = noop;
          }
        })(templateMethods[i]);
      }
    }
  };

  if (Handlebars) {
    var handlebarsConnector = new TemplateConnector({
      compile: function() {
        return Handlebars.template.apply(this, arguments);
      },
      globalHelpers: function() {
        return Handlebars.helpers;
      }
    });

    new TemplateEngine(handlebarsConnector);
  }
  
  return TemplateEngine;

});

/**
 * @module Lyria
 */

define('lyria/template/methods', function() {
  'use strict';
  
  return ['compile'];
});

define('lyria/template/string', ['objectify'], function(objectify) {
  'use strict';
  
  var templateString = {
    key: {
      start: '\\{{',
      end: '\\}}'
    },
    process: function(value, parameter) {
      if (value == null) {
        return;
      }
      
      if (parameter == null) {
        return value;
      }
      
      // Array or object
      if ( typeof parameter === 'object') {
        var templateObject = objectify(parameter);
        
        var keys = Object.keys(templateObject);
        
        for (var i = 0, j = keys.length; i < j; i++) {
          (function(num, item) {
            value = value.replace(new RegExp(templateString.key.start + num + templateString.key.end, 'g'), item);
          })(keys[i], templateObject[keys[i]]);
        }
        
      }

      return value;
    }
  };

  return templateString;
});

define('lyria/tween', ['eventmap', 'mixedice', 'options', 'jqueryify'], function(EventMap, mixedice, options, $fy) {
  'use strict';
  
  var Tween = (function() {
    var Tween = function(opts) {
      opts = options(opts, {
        elem: null,
        effects: [{
          property: null,
          target: null,
          easing: Tween.defaults.easing,
          duration: Tween.defaults.duration,
          delay: Tween.defaults.delay
        }]
      });
      
      this.$elem = $fy(opts.elem);
      this.effects = opts.effects;

      this.hwAccelerated = true;

      mixedice([this, Tween.prototype], new EventMap());

      var self = this;

      this.on('start', function() {
        if (self.$elem) {
          return;
        }
        
        var effects = [];
        var properties = {};
        
        for (var i = 0, j = self.effects.length; i < j; i++) {
          (function(item) {
            if (item.property == null || item.target == null) {
              return;
            }
            
            item.duration = item.duration || Tween.defaults.duration;
            item.easing = item.easing || Tween.defaults.easing;
            item.delay = item.delay || Tween.defaults.delay;
            
            effects.push([item.property, item.duration, item.easing, item.delay].join(' '));
            properties[item.property] = item.target;
          })(self.effects[i]);
        }
        
        properties['transition'] = effects.join(', ');
        self.$elem.css(properties);
        
        $(document).one('transitionend', function(e) {
          console.log(e.target);
        });
      });
    };
    
    Tween.defaults = {
      easing: 'linear',
      duration: '300ms',
      delay: '0ms'
    };

    return Tween;
  })();

  return Tween;
}); 
define('lyria/video', function() {
  'use strict';

  var Video =  (function() {
    var Video = function() {

    };

    Video.prototype.loadFromFile = function() {
      
    };
    
    Video.prototype.play = function() {
      
    };
    
    Video.prototype.pause = function() {
      
    };
    
    Video.prototype.stop = function() {
      
    };

    return Video;
  })();
  
  return Video;
  
});

/**
 * @module Lyria
 */
define('lyria/viewport', ['root', 'jquery', 'mixedice', 'eventmap'], function(root, $, mixedice, EventMap) {'use strict';

  return (function() {

    /**
     * @class Viewport
     * @constructor
     */
    function Viewport(container, options) {
      var defaultOptions = {
        parent: null,
        trigger: {
          element: window,
          event: 'resize'
        },
        scaleMode: 'scaleToFit'
      };

      options = $.extend(defaultOptions, options);
      
      mixedice([this, Viewport.prototype], new EventMap());

      this.scale = {};
      this.scale.mode = options.scaleMode;
      this.scale.x = 1.0;
      this.scale.y = 1.0;

      // Defaults container to the string 'viewport'
      if (container == null) {
        container = 'viewport';
      }
      
      Object.defineProperty(this, '$element', {
        get: function() {
          return $('#' + container);
        }
      });

      /**
       * The viewport element (jQuery object)
       *
       * @property $element
       * @type {jQuery}
       */
      if (this.$element.length === 0) {
        var createdElement = $(root.document.createElement('div')).attr('id', container).attr('class', 'viewport');

        if (options.parent) {
          $(options.parent).prepend(createdElement);
        } else {
          $('body').prepend(createdElement);
        }
      }

      Object.defineProperty(this, 'width', {
        get: function() {
          return this.$element.outerWidth();
        }
      });

      Object.defineProperty(this, 'height', {
        get: function() {
          return this.$element.outerHeight();
        }
      });

      var self = this;

      this.on('scale', function() {
        
        // TODO: Reset scaling to 1.0
        
        var scaleElement = function(scaleX, scaleY) {
          if (scaleY == null) {
            scaleY = scaleX;
          }
          
          var scaleExp = 'scale(' + scaleX + ', ' + scaleY + ')';
          self.$element.css('transform', scaleExp);
          
          if ((self.scale.x !== scaleX) || (self.scale.y !== scaleY)) {
            self.scale.x = scaleX;
            self.scale.y = scaleY;
            
            self.trigger('scale:change', self.scale.x, self.scale.y);            
          }
        };

        var scaleHeightToFit = function(doNotSetTransform) {
          var scaleFactor = 0;
          
          if (self.height > $(options.trigger.element).innerHeight()) {
            scaleFactor = $(options.trigger.element).innerHeight() / self.height;

            if (doNotSetTransform) {
              return scaleFactor;
            } else {
              scaleElement(scaleFactor);
              return scaleFactor;
            }
          }
          
          return 1.0;
        };

        var scaleWidthToFit = function(doNotSetTransform) {
          var scaleFactor = 0;
          
          if (self.width > $(options.trigger.element).innerWidth()) {
            scaleFactor = $(options.trigger.element).innerWidth() / self.width;
            
            if (doNotSetTransform) {
              return scaleFactor;
            } else {
              scaleElement(scaleFactor);
              return scaleFactor;
            }
          }
          
          return 1.0;
        };

        switch (self.scale.mode) {
          case 'stretch':
            break;
          case 'cover':
            break;
          case 'scaleToFit':
            var scaleX = 1;
            var scaleY = 1;
          
            if ($(options.trigger.element).innerHeight() < self.height) {
              scaleY = scaleHeightToFit(true);
            }
            
            if ($(options.trigger.element).innerWidth() < self.width) { 
              scaleX = scaleWidthToFit(true);                
            }
            
            scaleElement(Math.min(scaleX, scaleY));
            break;
          case 'scaleHeightToFit':
            scaleHeightToFit();
            break;
          case 'scaleWidthToFit':
            scaleWidthToFit();
            break;
          default:
            break;
        }
      });

      $(options.trigger.element).on(options.trigger.event, function() {
        self.trigger('scale');
      });
      
      // Call scale event
      self.trigger('scale');
    }

    return Viewport;

  })();
});

define('lyria/world', ['mixedice', 'eventmap'], function(mixedice, EventMap) {
  'use strict';

  return (function() {

    var World = function() {
      mixedice([this, World.prototype], new EventMap());
    };

    return World;

  })();

});

define('lyria/template/list', {
  'achievement-list': function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [4, '>= 1.0.0'];
    helpers = this.merge(helpers, Handlebars.helpers);
    partials = this.merge(partials, Handlebars.partials);
    data = data || {};
    var buffer = "",
      stack1, self = this;

    function program1(depth0, data) {

      var buffer = "",
        stack1;
      buffer += "\r\n    ";
      stack1 = self.invokePartial(partials.achievement, 'achievement', depth0, helpers, partials, data);
      if (stack1 || stack1 === 0) {
        buffer += stack1;
      }
      buffer += "\r\n  ";
      return buffer;
    }

    buffer += "<div class=\"achievement-list\">\r\n  ";
    stack1 = helpers.each.call(depth0, (depth0 && depth0.achievement), {
      hash: {},
      inverse: self.noop,
      fn: self.program(1, program1, data),
      data: data
    });
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += "\r\n</div>";
    return buffer;
  },
  'achievement': function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [4, '>= 1.0.0'];
    helpers = this.merge(helpers, Handlebars.helpers);
    data = data || {};
    var buffer = "",
      stack1, functionType = "function",
      escapeExpression = this.escapeExpression,
      self = this;

    function program1(depth0, data) {


      return "offscreen";
    }

    function program3(depth0, data) {

      var buffer = "",
        stack1;
      buffer += "\r\n  <div class=\"progress-status\">\r\n    <span class=\"current\">";
      if (stack1 = helpers.current) {
        stack1 = stack1.call(depth0, {
          hash: {},
          data: data
        });
      } else {
        stack1 = (depth0 && depth0.current);
        stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
          hash: {},
          data: data
        }) : stack1;
      }
      buffer += escapeExpression(stack1) + "</span>\r\n    <span class=\"separator\">";
      if (stack1 = helpers.separator) {
        stack1 = stack1.call(depth0, {
          hash: {},
          data: data
        });
      } else {
        stack1 = (depth0 && depth0.separator);
        stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
          hash: {},
          data: data
        }) : stack1;
      }
      buffer += escapeExpression(stack1) + "</span>\r\n    <span class=\"max\">";
      if (stack1 = helpers.max) {
        stack1 = stack1.call(depth0, {
          hash: {},
          data: data
        });
      } else {
        stack1 = (depth0 && depth0.max);
        stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
          hash: {},
          data: data
        }) : stack1;
      }
      buffer += escapeExpression(stack1) + "</span>\r\n  </div>\r\n  ";
      return buffer;
    }

    buffer += "<div id=\"";
    if (stack1 = helpers.id) {
      stack1 = stack1.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      stack1 = (depth0 && depth0.id);
      stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
        hash: {},
        data: data
      }) : stack1;
    }
    buffer += escapeExpression(stack1) + "\" class=\"achievement ";
    stack1 = helpers['if'].call(depth0, (depth0 && depth0.offscreen), {
      hash: {},
      inverse: self.noop,
      fn: self.program(1, program1, data),
      data: data
    });
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += "\">\r\n  <div class=\"title\">";
    if (stack1 = helpers.title) {
      stack1 = stack1.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      stack1 = (depth0 && depth0.title);
      stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
        hash: {},
        data: data
      }) : stack1;
    }
    buffer += escapeExpression(stack1) + "</div>\r\n  <div class=\"icon ";
    if (stack1 = helpers.className) {
      stack1 = stack1.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      stack1 = (depth0 && depth0.className);
      stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
        hash: {},
        data: data
      }) : stack1;
    }
    buffer += escapeExpression(stack1) + "\"></div>\r\n  <div class=\"description\">";
    if (stack1 = helpers.description) {
      stack1 = stack1.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      stack1 = (depth0 && depth0.description);
      stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
        hash: {},
        data: data
      }) : stack1;
    }
    buffer += escapeExpression(stack1) + "</div>\r\n  ";
    stack1 = helpers['if'].call(depth0, (depth0 && depth0.progressable), {
      hash: {},
      inverse: self.noop,
      fn: self.program(3, program3, data),
      data: data
    });
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += "\r\n</div>";
    return buffer;
  },
  'scene': function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [4, '>= 1.0.0'];
    helpers = this.merge(helpers, Handlebars.helpers);
    data = data || {};
    var stack1, functionType = "function",
      escapeExpression = this.escapeExpression,
      self = this;

    function program1(depth0, data) {

      var buffer = "",
        stack1;
      buffer += "\r\n  <canvas id=\"";
      if (stack1 = helpers.name) {
        stack1 = stack1.call(depth0, {
          hash: {},
          data: data
        });
      } else {
        stack1 = (depth0 && depth0.name);
        stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
          hash: {},
          data: data
        }) : stack1;
      }
      buffer += escapeExpression(stack1) + "\" class=\"";
      if (stack1 = helpers.type) {
        stack1 = stack1.call(depth0, {
          hash: {},
          data: data
        });
      } else {
        stack1 = (depth0 && depth0.type);
        stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
          hash: {},
          data: data
        }) : stack1;
      }
      buffer += escapeExpression(stack1) + "\"></canvas>\r\n";
      return buffer;
    }

    function program3(depth0, data) {

      var buffer = "",
        stack1;
      buffer += "\r\n  <div id=\"";
      if (stack1 = helpers.name) {
        stack1 = stack1.call(depth0, {
          hash: {},
          data: data
        });
      } else {
        stack1 = (depth0 && depth0.name);
        stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
          hash: {},
          data: data
        }) : stack1;
      }
      buffer += escapeExpression(stack1) + "\" class=\"";
      if (stack1 = helpers.type) {
        stack1 = stack1.call(depth0, {
          hash: {},
          data: data
        });
      } else {
        stack1 = (depth0 && depth0.type);
        stack1 = typeof stack1 === functionType ? stack1.call(depth0, {
          hash: {},
          data: data
        }) : stack1;
      }
      buffer += escapeExpression(stack1) + "\"></div>\r\n";
      return buffer;
    }

    stack1 = helpers['if'].call(depth0, (depth0 && depth0.canvas), {
      hash: {},
      inverse: self.program(3, program3, data),
      fn: self.program(1, program1, data),
      data: data
    });
    if (stack1 || stack1 === 0) {
      return stack1;
    } else {
      return '';
    }
  }
});