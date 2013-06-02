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

define('lyria/achievement/manager', ['root', 'jquery', 'lyria/achievement'], function(root, $, Achievement) {
  
  var achievementStore = {};
  
  var AchievementManager = {
    add: function(achievement) {
      if (achievement instanceof Achievement) {
        achievementStore[achievement.name] = achievement;
      }
    },
    remove: function(achName) {
      if (Object.hasOwnProperty.call(achievementStore, achName)) {
        delete achievementStore[achName];
      }
    },
    list: function() {
      
    },
    show: function(achName) {
      
    }
  };
  
  return AchievementManager;
  
});

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/achievements', ['root', 'jquery'], function(root, $) {
  'use strict';
  
  // Achievement "Singleton": Revealing module pattern
  var Achievements = function() {
    //Private object "array" stores all achievements
    var array = {},
    // Private
    _localStorageKey,
    // Initializes the achievements object with the some juicy
    initialize = function(localStorageKey) {
      // Saves localStorage key internally
      _localStorageKey = localStorageKey;
  
      // Loads achievements from local storage if any
      if(root.localStorage) {
        if(root.localStorage[_localStorageKey]) {
          array = JSON.parse(root.localStorage[_localStorageKey]);                  
        }
      }
    }, register = function(text, description, icon) {
      array[text] = {
        active: false
      };
      if( typeof (description) !== "undefined")
        array[text]["description"] = description;
      if( typeof (icon) !== "undefined")
        array[text]["icon"] = icon;
    }, getCount = function() {
      return Object.keys(array).length;
    },
    /**
     * Gets the number of how many achievements have been unlocked
     *
     * @returns {number} The exact number of unlocked achievements
     */
    getUnlockedCount = function() {
      var count = 0;
      for(var i in array) {
        if(array[i]["active"])
          count++;
      }
      return count;
    },
    /**
     * Lists all achievements in a list of <div>s
     *
     * @returns {string} The markup for the list
     */
    list = function() {
      // Locked achievements will be shown in a grey-ish color
      var result = "";
      for(var i in array) {
        if(array[i]["active"])
          result += '<div class="ach_box unlocked"><span class="ach_unlocked">' + i + '</span><br /><span class="ach_details">' + array[i]["description"] + '</span></div><br /><br />';
        else
          result += '<div class="ach_box locked"><span class="ach_locked">' + i + '</span><br /><span class="ach_details">' + array[i]["description"] + '</span></div><br /><br />';
      }
  
      return result;
    },
    /**
     * Displays an achievement if it hasn't been displayed yet
     *
     * @param {string} text
     */
    show = function(text) {
      // If someone forget to register an achievement
      if(array[text] === "undefined")
        register(text);
  
      if(!array[text]["active"]) {
        if(!array[text].icon)
          $('.status.achievement').css("background-image", "url(" + array[text].icon + ")");
  
        $('.achievement .text').html(text);
        $('.status.achievement').css({
          opacity: 0.0
        }).animate({
          opacity: 1.0,
          bottom: '8px'
        }, 750).delay(2500).animate({
          opacity: 0.0,
          bottom: '-80px'
        }, 750);
  
        array[text].active = true;
      }
  
      if(root.localStorage)
        root.localStorage[_localStorageKey] = JSON.stringify(array);
    };
  
    return {
      initialize: initialize,
      getCount: getCount,
      getUnlockedCount: getUnlockedCount,
      list: list,
      register: register,
      show: show
    };
  }();
  
  return Achievements;
});
/**
 * @module Lyria
 */
define('lyria/audio', ['root', 'jquery'], function(root, $) {'use strict';

  /**
   * @class Audio
   * @static 
   */
  var Audio = function() {
    var muted = false;
    /**
     * Private audio elements
     *
     * @example : {
     *  filepath : 'assets/audio/example.ogg',
     *  playAfter : 'example2',
     *  loop : false,
     *  play : false
     * }
     */
    var audioElements = {};
    /**
     * Loads one or multiple audio files
     * @param {string}
     *    id      identifier of this sound (has to be unique!)
     * @param {object}
     *    filepath  filepath of the sound
     *    playAfter should sth be played after this sound has ended
     *    loop    loop this sound
     *    play    should this sound be played immediatelly?
     */
    var addAudioElement = function(id, fileObj) {
      if (!fileObj || typeof (fileObj) !== 'object')
        return;
      var audioElement = document.createElement('audio');
      audioElements[id] = fileObj;
      $(audioElement).attr('id', id).attr('preload', 'auto').append('<source src="' + fileObj.filepath + '" />');

      $('body').append(audioElement);
      if (fileObj.play) {
        this.play(id);
      }
    };
    var removeAudioElement = function(id) {
      if (!id || typeof (fileObj) != 'string')
        return;
      $('#' + id).remove();
      window.log('Lyria.audio.removeAudioElement: ' + id + ' removed');
    };
    /**
     * Plays the audio file
     *
     * @param {string} element identifier
     */
    var play = function(elem) {
      var sound = audioElements[elem];
      $('#' + elem).one('ended', {
        audioManager: this
      }, function(event) {
        if (window.chrome)
          $(this).load();
        else
          $(this).currentTime = 0;

        var id = $(this).attr('id');
        var sound = event.data.audioManager.getSound(id);
        // only play after song defined in playAfter if song is initialized
        if (sound.playAfter && $('#' + sound.playAfter).length > 0) {
          event.data.audioManager.play(sound.playAfter);
        }
        if (sound.loop) {
          event.data.audioManager.play($(this).attr('id'));
        }
      });
      $('#'+elem)[0].play();
      if (muted) {
        $('#'+elem)[0].volume = 0;
      }
    };
    /**
     * Get the audio file object
     *
     * @param {string} element identifier
     */
    var getSound = function(elem) {
      return audioElements[elem];
    };
    /**
     * Pauses the audio file
     *
     * @param {string} element identifier
     */
    var pause = function(elem) {
      if ($('#' + elem).length > 0) {
        $('#'+elem)[0].pause();
      } else {
        window.log('error', 'Lyria.Audio.pause: cant finde element ' + elem + ' to pause');
      }
    };
    /**
     * Stops playing the audio file
     *
     * @param {string} element identifier
     */
    var stop = function(elem) {
      if ($('#' + elem).length > 0 && $('#'+elem)[0] && $('#'+elem)[0].pause) {
        $('#'+elem)[0].pause();
        $('#'+elem)[0].currentTime = 0;
      }
    };
    /**
     * Get the length of the sound file
     *
     * @param {string} element identifier
     */
    var getLength = function(elem) {
      return $('#'+elem)[0].duration;
    };
    /**
     * Sets or gets the volume of the audio file
     *
     * @param {string} element identifier
     * @param {number} value (between 0 .. 1)
     */
    var volume = function(elem, value) {
      if ($('#' + elem).length > 0) {
        if ( typeof (value) === "number")
          $('#'+elem)[0].volume = value;
        else
          return $('#'+elem)[0].volume;
      } else {
        return 0;
      }

    };
    /**
     * Sets or gets the position of the audio file
     *
     * @param {string} element identifier
     * @param {number} value
     */
    var pos = function(elem, value) {
      if ( typeof (value) === "number")
        $('#'+elem)[0].currentTime = value;
      else
        return $('#'+elem)[0].currentTime;
    };
    /**
     * Sets or gets properties of the audio object
     * TODO: Method chaining
     *
     * @param {Object} prop
     * @param {Object} value (optional)
     */
    var attr = function(prop, value) {
      switch (prop) {
        case 'duration':
        case 'length':
          return getLength();

        case 'position':
        case 'pos':
          {
            if ( typeof (value) === "undefined")
              return pos();
            else
              pos(value);

          }
          break;

        case 'volume':
          {
            if ( typeof (value) === "undefined")
              return volume();
            else
              volume(value);

          }
          break;
      }
    };

    /**
     * Mute all sound of the game
     * @param {boolean} value
     */
    var muteSounds = function(value) {
      muted = value;
      for (var i in audioElements) {
        if (audioElements.hasOwnProperty(i)) {
          if ($('#' + i).length > 0) {
            $('#'+i)[0].volume = value ? 0 : 1;
          }
        }
      }
    };

    return {
      addAudioElement: addAudioElement,
      removeAudioElement: removeAudioElement,
      play: play,
      getSound: getSound,
      pause: pause,
      stop: stop,
      muteSounds: muteSounds,

      getLength: getLength,
      volume: volume,
      pos: pos,
      attr: attr
    };
  };
  
  return Audio;
});

define('lyria/audio/manager', function() {
  var AudioManager = {

  };

  return AudioManager;
});

define('lyria/component', ['mixin', 'lyria/eventmap'], function(mixin, EventMap) {

  //Lyria.Component
  return (function() {

    function Component(name) {
      mixin(Component.prototype, new EventMap());
      
      this.name = name != null ? name : this.constructor.name;
    }
    
    Component.prototype.update = function(dt) {
      this.trigger('update', dt);
    };

    return Component;

  })();

});

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

(function() {
  var vendors;

  vendors = ['ms', 'moz', 'webkit', 'o'];
  define('requestAnimationFrame', ['root'], function(root) {
    var lastTime, requestAnimationFrame, x, _i, _len;

    lastTime = 0;
    requestAnimationFrame = root.requestAnimationFrame;
    if (!requestAnimationFrame) {
      for (_i = 0, _len = vendors.length; _i < _len; _i++) {
        x = vendors[_i];
        requestAnimationFrame = root["" + x + "RequestAnimationFrame"];
        if (requestAnimationFrame) {
          break;
        }
      }
    }
    if (!requestAnimationFrame) {
      requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall;

        currTime = Date.now();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = root.setTimeout((function() {
          return callback(currTime + timeToCall);
        }), timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    return requestAnimationFrame;
  });
  return define('cancelAnimationFrame', ['root'], function(root) {
    var cancelAnimationFrame, x, _i, _len;

    cancelAnimationFrame = root.cancelAnimationFrame;
    if (!cancelAnimationFrame) {
      for (_i = 0, _len = vendors.length; _i < _len; _i++) {
        x = vendors[_i];
        cancelAnimationFrame = root["" + x + "CancelAnimationFrame"] || root["" + x + "CancelRequestAnimationFrame"];
        if (cancelAnimationFrame) {
          break;
        }
      }
    }
    if (!cancelAnimationFrame) {
      cancelAnimationFrame = function(id) {
        return root.clearTimeout(id);
      };
    }
    return cancelAnimationFrame;
  });
})();
/*
  Cloning objects
*/
define('clone', function() {
  var clone = function(obj) {
    var flags, key, newInstance;

    if ((obj == null) || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      flags = '';
      if (obj.global != null) {
        flags += 'g';
      }
      if (obj.ignoreCase != null) {
        flags += 'i';
      }
      if (obj.multiline != null) {
        flags += 'm';
      }
      if (obj.sticky != null) {
        flags += 'y';
      }
      return new RegExp(obj.source, flags);
    }
    newInstance = new obj.constructor();
    for (key in obj) {
      newInstance[key] = clone(obj[key]);
    }
    return newInstance;
  };
  
  return clone;
});
define('each', function() {
  return function(obj, callback) {
    var i, num, objKeys, val, _i, _j, _len, _len1;

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return;
      }
      
      for ( num = _i = 0, _len = obj.length; _i < _len; num = ++_i) {
        i = obj[num];
        if (callback(num, i)) {
          continue;
        } else {
          break;
        }
      }
    } else {
      objKeys = Object.keys(obj);
      if (objKeys.length === 0) {
        return;
      }
      
      for ( num = _j = 0, _len1 = objKeys.length; _j < _len1; num = ++_j) {
        i = objKeys[num];
        val = obj[i];
        if (callback(i, val)) {
          continue;
        } else {
          break;
        }
      }
    }
    return null;
  };
});
/*define('extend', function() {
  var __slice = [].slice, __hasProp = {}.hasOwnProperty;

  var extend = function() {
    var deep, key, s, source, target, value, _i, _j, _len, _len1;

    deep = arguments[0], target = arguments[1], source = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if ( typeof deep === 'object') {
      target = deep;
      deep = false;
    }
    if (deep) {
      for ( _i = 0, _len = source.length; _i < _len; _i++) {
        s = source[_i];
        for (key in s) {
          if (!__hasProp.call(s, key))
            continue;
          value = s[key];
          if ( typeof value === 'object') {
            target[key] = extend(true, {}, value);
          } else {
            target[key] = value;
          }
        }
      }
    } else {
      for ( _j = 0, _len1 = source.length; _j < _len1; _j++) {
        s = source[_j];
        for (key in s) {
          if (!__hasProp.call(s, key))
            continue;
          value = s[key];
          target[key] = value;
        }
      }
    }
    return target;
  };

  return extend;
});*/

define('extend', ['jquery'], function($) {
  return $.extend;
});
define('isEmptyObject', function() {
  return function(obj) {
    if ( typeof obj !== 'object') {
      return;
    }

    return (Object.keys(obj).length === 0);
  };
});
define('mixin', function() {
  var mixin;

  mixin = function() {
    var key, oldRef, s, source, target, value, _i, _len;

    target = arguments[0], source = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
    if (!(target || source)) {
      return;
    }
    for ( _i = 0, _len = source.length; _i < _len; _i++) {
      s = source[_i];
      for (key in s) {
        value = s[key];
        if (!Object.hasOwnProperty.call(target, key)) {
          target[key] = value;
        } /* else {
         oldRef = target[key];
         target[key] = (function() {
         if ( typeof oldRef === 'function' && typeof value === 'function') {
         return function() {
         oldRef.apply(this, arguments);
         return value.apply(this, arguments);
         };
         } else {
         return [oldRef, value];
         }
         })();
         } */
      }
    }
    return null;
  };

  return mixin;
});
(function(root) {
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
define('lyria/data/layer', function() {
  
});

define('lyria/data/store', ['lyria/eventmap'], function(EventMap) {

  var data = {};
  var eventMap = new EventMap();

  var DataStore = {
    has: function(key) {
      return data.hasOwnProperty('key');
    },
    get: function(key) {
      return data[key];
    },
    set: function(key, value) {
      data[key] = value;
    }
  };

  return DataStore;

});

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/eventmap', ['root'], function(root) {'use strict';

  /**
   * This is directly taken from
   * https://github.com/elysion-powered/elyssa/blob/master/src/core/events.coffee
   * Just using a different namespace
   */
  var EventMap = (function() {
    function EventMap(sender) {
      this.sender = sender;
      this.events = {};
      this.validEvents = [];
    }

    EventMap.prototype.on = function(eventName, eventFunction) {
      var eventDesc;

      if (!eventFunction) {
        return;
      }
      if (this.validEvents.length > 0) {
        if (this.validEvents.indexOf(eventName) === -1) {
          return;
        }
      }
      eventDesc = {
        event: eventFunction,
        id: -1,
        type: '',
        sender: this.sender
      };
      if (!this.events[eventName]) {
        this.events[eventName] = [eventDesc];
      } else {
        this.events[eventName].push(eventDesc);
      }
      return this;
    };

    EventMap.prototype.off = function(eventName) {
      if (!eventName) {
        return;
      }
      if (this.events[eventName].type === 'once' || this.events[eventName].type === 'repeat') {
        if (this.events[eventName].type === 'repeat') {
          root.clearInterval(this.events[eventName].id);
        }
        if (this.events[eventName].type === 'once') {
          root.clearTimeout(this.events[eventName].id);
        }
      }
      if (this.events[eventName]) {
        delete this.events[eventName];
      }
      return this;
    };

    EventMap.prototype.trigger = function() {
      var args, context, delay, eventName, i, interval, name, repeat, timeoutId, triggerEvent, triggerFunction, _i, _len, _ref;

      eventName = arguments[0], args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
      if (eventName == null) {
        return;
      }
      if (typeof eventName === 'object') {
        name = eventName.name, interval = eventName.interval, repeat = eventName.repeat, context = eventName.context, delay = eventName.delay;
      } else {
        name = eventName;
      }
      if (!this.events[name]) {
        return;
      }
      if (interval == null) {
        interval = 0;
      }
      if (repeat == null) {
        repeat = false;
      }
      if (context == null) {
        context = this;
      }
      if (delay == null) {
        delay = 0;
      }
      _ref = this.events[name];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        triggerFunction = function() {
          if (i.sender) {
            return i.event.apply(context, [].concat.apply([], [[i.sender], args]));
          } else {
            return i.event.apply(context, args);
          }
        };
        triggerEvent = function() {
          if (interval) {
            if (repeat) {
              i.type = 'repeat';
              i.id = root.setInterval(triggerFunction, interval);
            } else {
              i.type = 'once';
              i.id = root.setTimeout(triggerFunction, interval);
            }
          } else {
            i.type = 'direct';
            triggerFunction.call(this);
          }
          return null;
        };
        if (delay) {
          timeoutId = root.setTimeout(function() {
            triggerEvent.call(this);
            return root.clearTimeout(timeoutId);
          });
        } else {
          triggerEvent.call(this);
        }
      }
      return this;
    };

    return EventMap;

  })();
  
  return EventMap;
}); 
define('lyria/events', ['lyria/eventmap'], function(EventMap) {
  var instance = instance || new EventMap();

  return instance;
});

/**
 * Lyria namespace decleration
 * 
 * @namespace Lyria
 */
define('lyria/game', ['lyria/viewport', 'lyria/scene/director', 'lyria/preloader', 'lyria/loop'], function(Viewport, Director, Preloader, Loop) {
  'use strict';
  
  // Lyria.Game
  return (function() {
    
    // Constructor
    var Game = function() {
      var self = this;
      
      this.viewport = new Viewport();
      this.director = new Director(this.viewport);
      this.preloader = new Preloader();      
      this.preloader.sceneDirector = this.director;
      this.loop = Loop;
      
      Game.Loop.addTask('update', function(dt) {
        self.director.trigger('update', dt);
      });      
    };
    
    Game.Loop = Loop;
    
    
    return Game;
    
  })();
  
});
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/gameobject', ['mixin', 'isEmptyObject', 'each', 'lyria/eventmap', 'lyria/component', 'lyria/log'], function(mixin, isEmptyObject, each, EventMap, Component, Log) {
  'use strict';
  
  //Lyria.GameObject
  return (function() {
    
    // Constructor
    var GameObject = function() {
      mixin(GameObject.prototype, new EventMap());
      
      var self = this;
      
      this.components = {};
      
      this.on('update', function(dt) {
        if (isEmptyObject(self.components)) {
          return;
        }
        
        each(self.components, function(key, value) {
          value.trigger('update', dt);
        });
      });
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
/**
 * Lyria module
 *
 * @module Lyria
 */
define('lyria/layer', ['mixin', 'lyria/gameobject'], function(mixin, GameObject) {
  'use strict';

  return (function() {

    /**
     * @class Layer
     * @extends Lyria.GameObject 
     * @constructor
     */
    var Layer = function() {
      mixin(this.prototype, new GameObject());
    };

    return Layer;

  })();
}); 
define('lyria/localization/global', ['lyria/localization', 'lyria/resource'], function(Localization, Resource) {
  var instance = instance || new Localization(Resource.name("i18n.json"));
  
  return instance;
});
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/localization', ['check', 'jquery', 'lyria/language'], function(check, $, language) {'use strict';

  //Lyria.Localization
  return (function() {
    /**
     *
     * @param {Object} localization
     * @param {Object} options
     */
    var Localization = function(localization, options) {
      if (!localization) {
        return;
      }
      var localizeLangObject = {};
      var defaultOptions = {
        language: language
      };

      options = $.extend(true, defaultOptions, options);

      var localizeObject = {};
      
      check(localization, {
        object: function(arg) {
          localizeObject = arg;
        },
        string: function(arg) {
          // AJAX request to file
          // TODO: Promise object
          $.ajax({
            url: arg,
            async: false,
            dataType: 'json',
            success: function(data) {
              localizeObject = data;
            }
          });
        }
      });

      localizeLangObject = localizeObject[options.language];

      // Language not found, switch to default language if available
      if (!localizeLangObject) {
        localizeLangObject = localizeObject['en'];
      }
      
      this.localizeLangObject = localizeLangObject;
    };
    
    /**
     *
     * @param {Object} name
     * @param {Object} fallback
     */
    Localization.prototype.get = function(name, fallback) {   
      if (this.localizeLangObject) {
        if (this.localizeLangObject[name]) {
          return this.localizeLangObject[name];
        }

      }

      if ((!name) && (!fallback)) {
        return this.localizeLangObject;
      } else {
        if (!name) {
          return fallback;
        } else {

          if (fallback) {
            return fallback;
          } else {
            return name;
          }

        }
      }

    };
    
    return Localization;
    
  })();
  
});
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/log', ['root'], function(root) {
  'use strict';
  
  var Log = (function() {

    var Log = {};

    Log.Connector = null;

    Log.Plugins = {};

    Log.Plugins.Console = {
      e: function(text) {
        if (root.console && root.console.error) {
          root.console.error(text);
        }
      },
      w: function(text) {
        if (root.console && root.console.warn) {
          root.console.warn(text);
        }
      },
      i: function(text) {
        if (root.console && root.console.info) {
          root.console.info(text);
        }
      },
      d: function(text) {
        if (root.console && root.console.log) {
          root.console.log(text);
        }
      },
      v: function(text) {
        if (root.console && root.console.log) {
          root.console.log(text);
        }
      }
    };

    Log.Connector = Log.Plugins.Console;

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
            Log.Connector[iterator].apply(this, arguments);
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
/**
 * @module Lyria
 */
define('lyria/loop', ['root', 'each', 'requestAnimationFrame'], function(root, each, requestAnimationFrame) {
  'use strict';
  
  /**
   * @class Loop
   * @static 
   */
  return (function() {

    var taskList = {};
    var isRunning = true;

    /**
     * @method run 
     */
    var run = function() {
      var time;

      (function loop() {
        requestAnimationFrame(loop);

        var now = Date.now();
        var dt = now - (time || now);

        time = now;

        if (!isRunning) {
          return;
        }

        each(taskList, function(key, value) {
          if (!value.paused) {
            value.value(dt);
          }
        });
      })();
    };

    /**
     * @method stop 
     */
    var stop = function() {
      isRunning = false;
    };

    var clear = function() {
      taskList = {};
    };

    var addTask = function(taskName, taskFunction) {

      taskList[taskName] = {
        'paused': false,
        'value': taskFunction
      };
    };

    var pauseTask = function(taskName) {
      taskList[taskName].paused = true;
    };

    var resumeTask = function(taskName) {
      taskList[taskName].paused = false;
    };

    var removeTask = function(taskName) {
      delete taskList[taskName];
    };

    return {
      run: run,
      stop: stop,
      clear: clear,
      addTask: addTask,
      removeTask: removeTask,
      pauseTask: pauseTask,
      resumeTask: resumeTask
    };
  })();
  
});
define('lyria/math', function() {

  var Math = {
    clamp: function(value, min, max) {
      var _ref, _ref1;

      if ( typeof value === 'object') {
        _ref = value, min = _ref.min, max = _ref.max, value = _ref.value;
      }
      if (min == null) {
        min = 0.0;
      }
      if (max == null) {
        max = 1.0;
      }
      if (min > max) {
        _ref1 = [max, min], min = _ref1[0], max = _ref1[1];
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
    }
  };

  return Math;

});

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/prefab', ['extend', 'lyria/scene'], function(extend, Scene) {
	'use strict';

	//Lyria.Prefab
	return function(prefabName, options) {
		
		var defaultOptions = {
			target: null,
			template: 'prefab.html',
			data: 'prefab.js',
			path: 'prefab',
			isPrefab: true
		};
		
		options = extend(true, defaultOptions, options);
		
		return new Scene(prefabName, options);
		
	};
  
});
define('lyria/prefab/manager', function() {
  var PrefabManager = {};
  
  PrefabManager.create = function(name) {
    if (PrefabManager.precompiledPrefabs) {
      return PrefabManager.precompiledPrefabs[name];
    }
  };
  
  return PrefabManager;
});

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/preloader', ['root', 'mixin', 'jquery', 'lyria/resource', 'lyria/log', 'lyria/eventmap'], function(root, mixin, $, Resource, Log, EventMap) {'use strict';

  /**
   *
   */
  var Preloader = (function() {

    var Preloader = function(assetArray) {
      mixin(Preloader.prototype, new EventMap());

      if (assetArray != null) {
        this.assets = assetArray;
      } else {
        this.assets = [];
      }

      this.maxAssets = 0;
      this.assetsLoaded = 0;
      this.percentLoaded = 0;
      this.steps = [];
    };

    Preloader.prototype.start = function() {
      // Check if it's valid
      if (this.assets == null || Object.keys(this.assets).length === 0) {
        return;
      }

      this.trigger('start');

      var totalSize = this.assets.totalSize;
      var currentProgress = 0;
      
      if ((this.steps == null) || (this.steps.length === 0)) {
        
      }
      
      var hasLoadingScene = this.sceneDirector != null && this.loadingScene != null;
      
      if (hasLoadingScene) {
        this.sceneDirector.show(this.loadingScene);
      }
      
      
      var self = this;

      function loadingProgress() {

        var percentLoaded = currentProgress / totalSize;

        self.trigger('progresschange', percentLoaded);
        
        if (hasLoadingScene) {
          self.sceneDirector.currentScene.trigger('progresschange', percentLoaded);
        }

        if (currentProgress >= totalSize) {
          if (hasLoadingScene) {
            self.sceneDirector.currentScene.trigger('complete');
          }

          self.trigger('complete');
        }
      }


      $.each(this.assets, function(key, value) {
        
        if (value.files == null || !Array.isArray(value.files) || value.files.length === 0) {
          return false;
        }
        
        for (var i = 0, j = value.files.length; i < j; i++) {
          (function(iterator) {
            
            if (iterator.name.indexOf('/' + Resource.path.image + '/') >= 0) {
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
            
          })(value.files[i]);
        }


      });
    };

    return Preloader;

  })();

  return Preloader;
});
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/resource', function() {
  
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
     *
     *
     */
    name: function(filename, type) {
      if (!filename) {
        return;
      }
  
      var assetPath = Resource.path['assets'];
      var typePath = '';
  
      if (Resource.path[type]) {
        typePath = Resource.path[type];
      } else {
        typePath = type;
      }
  
      if (typePath) {
        return [assetPath, typePath.split('.').join('/'), filename].join('/');
      } else {
        return [assetPath, filename].join('/');
      }
    }
    
  };
  
  return Resource;
}); 
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/scene/director', ['root', 'mixin', 'jquery', 'lyria/eventmap', 'lyria/scene', 'lyria/viewport'], function(root, mixin, $, EventMap, Scene, Viewport) {'use strict';

  /**
   * The scene director is the manager for all scenes
   *
   */
  return (function() {

    function SceneDirector(container, parent) {
      mixin(SceneDirector.prototype, new EventMap());

      if ( container instanceof Viewport) {
        this.viewport = container;
      } else {
        this.viewport = new Viewport(container, parent);
      }

      this.sceneList = {};
      this.currentScene = null;
    }

    // Properties
    SceneDirector.prototype.sceneClassName = 'scene';

    // Methods
    SceneDirector.prototype.add = function(scene, options) {

      if (!( scene instanceof Scene)) {
        if (this.precompiledScenes) {
          scene = this.precompiledScenes[scene];
        } else {
          throw 'No valid scene found.';
        }
      }

      scene.parent = this;
      this.sceneList[scene.name] = scene;

      if (this.viewport.$container) {
        if ($('#' + scene.name).length === 0) {
          this.viewport.$container.prepend($(root.document.createElement('div')).attr('id', scene.name).attr('class', SceneDirector.prototype.sceneClassName));

          if (!scene.async) {
            if (scene.content) {
              $('#' + scene.name).html(scene.content);
            }
          }

          // Bind events
          if (scene.events && !$.isEmptyObject(scene.events)) {
            $.each(scene.events, function(key, value) {
              if (( typeof value === 'object') && (key !== 'delegate')) {
                $(scene.events.delegate).on(value, key, {
                  scene: scene
                });
              }
            });
          }

          // Data binding
          if (scene.template.data && !$.isEmptyObject(scene.template.data)) {
            $('#' + scene.name + ' [data-bind]').each(function() {
              var $dataElem = $(this);
              
              var prop = $dataElem.data('bind');

              scene.template.data.watch(prop, function(id, oldval, newval) {
                if (oldval !== newval) {
                  $dataElem.html(newval);
                }

                return newval;
              });
            });
          }
        }
      }

      return this;
    };

    SceneDirector.prototype.show = function(scene, options, callback) {
      this.trigger('scene:change', scene);

      // More than one scene visible at the same time
      if ($('.' + SceneDirector.prototype.sceneClassName + ':visible')) {
        $('.' + SceneDirector.prototype.sceneClassName).hide();
      }

      if (this.currentScene) {
        if (this.currentScene.transition && this.currentScene.length) {
          $('#' + this.currentScene).hide(this.currentScene.transition.length, function() {
            $('.' + SceneDirector.prototype.sceneClassName).hide();
          });
        } else {
          $('.' + SceneDirector.prototype.sceneClassName).hide();
        }

        this.currentScene.trigger('deactivate', options);
      }

      var self = this;

      $.each(this.sceneList, function(key, value) {
        if (key === scene) {

          if (scene.transition && scene.transition.length) {
            $('#' + scene).show(scene.transition.length);
          } else {
            $('#' + scene).show();
          }

          self.currentScene = value;

          self.currentScene.trigger('active', options);

          if (callback) {
            callback(scene);
          }

          return false;
        }
      });
    };

    SceneDirector.prototype.refresh = function(scene) {
      var sceneObj = (scene) ? this.sceneList[scene] : this.currentScene;

      // Re-compile scene template
      sceneObj.refresh();

      if (sceneObj.content) {
        $('#' + sceneObj.name).html(sceneObj.content);
      }
    };

    SceneDirector.prototype.render = function() {
      this.currentScene.trigger('render');
    };

    SceneDirector.prototype.update = function(dt) {
      this.currentScene.trigger('update', dt);
    };

    return SceneDirector;

  })();
});

/**
 * @module Lyria
 */
define('lyria/scene', ['isEmptyObject', 'each', 'extend', 'clone', 'mixin', 'lyria/eventmap', 'lyria/gameobject'], function(isEmptyObject, each, extend, clone, mixin, EventMap, GameObject) {
  'use strict';

  var sceneCache = {};

  var Scene = (function() {
    
    /**
     * Scene constructor
     * 
     * @class Scene
     * @constructor
     */
    var Scene = function(sceneName, sceneFunction, options) {
      if (!sceneName) {
        return;
      }
      
      // Mixin event map into Scene
      mixin(Scene.prototype, new EventMap('scene:' + sceneName));
      
      // We need a reference to the scene not being this
      var self = this;
      
      // Set name
      this.name = sceneName;
      
      this.async = false;
      
      // Default values
      this.localization = {};
      
      this.template = {};
      this.template.source = '';
      // Collect all template values
      this.template.data = {};
      
      this.children = this.children || {};
      this.children.gameObjects = {};
      this.children.prefabs = {};
      
      // Expose function for template values
      this.expose = function(obj) {
        if (!obj || isEmptyObject(obj)) {
          return;
        }
        
        self.template.data = extend(true, self.template.data, obj);
      };
      
      // Call scene
      require(['lyria/achievements', 'lyria/log', 'lyria/component', 'lyria/gameobject', 'lyria/events', 'lyria/resource', 'lyria/data/store'], function(Achievements, Log, Component, GameObject, Events, Resource, DataStore) {
        var LyriaObject = {
          Achievements: Achievements,
          Log: Log,
          Component: Component,
          GameObject: GameObject,
          Events: Events,
          Resource: Resource,
          DataStore: DataStore
        };
        
        sceneFunction.apply(self, [self, LyriaObject]);
        
        self.refresh();
        
        
        if (self.events) {
          if (options && options.isPrefab) {
            self.events.delegate = (options.target) ? options.target : 'body';              
          } else {
            self.events.delegate = '#' + sceneName;
          }        
        }
        
        self.on('update', function(dt) {
          each(self.children, function(childKey, childValue) {
            if (!isEmptyObject(childValue)) {
              each(childValue, function(key, value) {
                value.trigger('update', dt);
              });
            }
          });
        });
      });

      
      
    };
    
    /**
     * Adds a gameobject to the scene 
     * 
     * @param {Object} child
     */
    Scene.prototype.add = function(child) {
      var self = this;
      
      
      if (child instanceof GameObject) {
        this.children.gameObjects[child.name] = child;
        
        this.template.data.gameobject = (function() {
          var array = [];
          
          each(self.children.gameObjects, function(key, value) {
            array.push(value);
          });
          
          return array;
        })();
        
        this.trigger('add');
        
        return true;
      }
      
      if (child instanceof GameObject) {
        this.children.prefabs[child.name] = child;
        
        this.template.data.gameobject = (function() {
          var array = [];
          
          each(self.children.gameObjects, function(key, value) {
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
     * @param {Object} val
     */
    Scene.prototype.refresh = function(val) {
        if (val == null && this.template) {
          val = this.template.data;
        }
        
        if (this.template && this.template.source) {
          this.content = this.template.source(val);        
        }
        
        this.trigger('refresh');
      };
    
    return Scene;
    
  })();
  
  return Scene;
  
});
/**
 * @module Lyria
 * @submodule Template 
 */
define('lyria/template/connector', ['lyria/template/methods'], function(templateMethods) {
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
define('lyria/template/engine', ['root', 'lyria/template/connector', 'lyria/template/methods'], function(root, TemplateConnector, templateMethods) {

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

  if (root.Handlebars) {
    var handlebarsConnector = new TemplateConnector({
      compile: function() {
        return root.Handlebars.template.apply(this, arguments);
      }
    });

    TemplateEngine(handlebarsConnector);
  }
  
  return TemplateEngine;

});

/**
 * @module Lyria
 */

define('lyria/template/methods', function() {
  return ['compile'];
});

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/utils', ['jquery'], function($) {
  
  
  var Utils = {};
  
  /**
   *
   * @param {Object} filename
   *
   * @returns {Boolean}
   */
  Utils.isFile = function(filename) {
    var sepPos = filename.indexOf('.');
    if (sepPos === -1) {
      return false;
    }

    var filenameLength = filename.length;
    var diff = filenameLength - sepPos;

    // A filename extension is allowed to be one to four characters long.
    if ((diff > 1) && (diff <= 5)) {
      return true;
    } else {
      return false;
    }
  };
  /**
   *
   * @param {Object} anyObject
   *
   * @returns {Object}
   */
  Utils.cloneObject = function(anyObject) {
    return $.extend(true, {}, anyObject);
  };
  
  /**
   * 
   * @param {Object} anyObject
   * 
   * @returns {String}
   */
  Utils.serializeObject = function(anyObject) {
    if ((typeof anyObject !== 'object') || (anyObject instanceof $)) {
      return;
    }
    
      var str = '{';        
      
      for (var p in anyObject) {
          if (anyObject.hasOwnProperty(p)) {
            if (anyObject[p] instanceof $) {
              continue;
            }
            
            var objKeys = Object.keys(anyObject);
            var commaStr = (objKeys.indexOf(p) === (objKeys.length - 1)) ? '' : ',';
            
            switch (typeof anyObject[p]) {
              case 'object': {
                str += p + ': ' + Utils.serializeObject(anyObject[p]) + commaStr + '\n';
              }
                break;
              case 'string': {
                str += p + ': "' + anyObject[p] + '"' + commaStr + '\n';
              }
                break;
              default: {
                str += p + ': ' + anyObject[p] + commaStr + '\n';
              }
                break;
            }
          }
      }
      str += '}';
      
      return str;
  };
  
  return Utils;
  
});


define('lyria/video', function() {
  'use strict';


  return (function() {
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
  
});

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/viewport', ['root', 'jquery'], function(root, $) {
  'use strict';

  // Lyria.Viewport
  return (function() {
    
    function Viewport(container, parent) {
      
      // Defaults container to the string 'viewport'
      if (container == null) {
        container = 'viewport';
      }

      if ($('#' + container).length > 0) {
        this.$container = $('#' + container);
      } else {
        var createdElement = $(root.document.createElement('div')).attr('id', container);
        
        if (parent) {
          $(parent).prepend(createdElement);
        } else {
          $('body').prepend(createdElement);
        }
        
        this.$container = $('#' + container);
      }
      
    }
    
    Viewport.prototype.scale = function(scaleX, scaleY) {
      if (scaleX == null) {
        return;
      }
      
      if (scaleY == null) {
        scaleY = scaleX;
      }
      
      this.$container.css('transform', 'scale(' + scaleX + ',' + scaleY + ')');
    };
    
    Viewport.prototype.center = function() {
      
    };
    
    Viewport.prototype.rotate = function(angle) {
      if (angle == null) {
        return;
      }
      
      this.$container.css('transform', 'rotate(' + angle + ')');
    };
    
    return Viewport;
    
  })();
});
