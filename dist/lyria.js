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
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/resource', {
  /**
   *
   */
  path: {
    assets: "assets",
    audio: "audio",
    data: "data",
    image: "images",
    scene: "scenes",
    video: "video",
    prefab: "prefabs"
  },

  /**
   *
   *
   */
  name: function(filename, type) {
    if (!filename) {
      return;
    }

    var assetPath = Lyria.Resource.path['assets'];
    var typePath = "";

    if (Lyria.Resource.path[type]) {
      typePath = Lyria.Resource.path[type];
    } else {
      typePath = type;
    }

    if (typePath) {
      return [assetPath, typePath.split('.').join('/'), filename].join('/');
    } else {
      return [assetPath, filename].join('/');
    }
  }
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

define('lyria/component', function() {

  //Lyria.Component
  return (function() {

    function Component(name) {
      this.name = name != null ? name : this.constructor.name;
    }


    Component.prototype.register = function() {
    };

    Component.prototype.unregister = function() {
    };

    Component.prototype.render = function() {
    };

    Component.prototype.update = function(dt) {
    };

    return Component;

  })();

});

// Debug settings
define('lyria/debug', function() {
  return true;
});

// General constants
define('lyria/constants', {
  animSpeed: 300
});

define('lyria/language', ['root'], function(root) {
  // Fallback language
  var defaultLanguage = 'en';
  
  return detectr.Browser.language() || defaultLanguage;  
});

(function(root) {
  define('root', function() {
    return root;
  });
})(this);

define('requestAnimationFrame', ['root'], function(root) {
  // frameRate is only used if requestAnimationFrame is not available
  var frameRate = 60;

  var requestAnimationFrame = root.requestAnimationFrame;

  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    requestAnimationFrame = root[vendors[x] + 'RequestAnimationFrame'];
    
    if (requestAnimationFrame) {
      break;
    }
  }

  if (!requestAnimationFrame) {
    requestAnimationFrame = function(callback) {
      window.setTimeout(callback, ~~(1000 / window.frameRate));
    };
  }

  return requestAnimationFrame;
});

define('cancelAnimationFrame', ['root'], function(root) {

  var cancelAnimationFrame = root.cancelAnimationFrame;

  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    cancelRequestAnimationFrame = root[vendors[x] + 'CancelRequestAnimationFrame'];
  
    if (cancelAnimationFrame) {
      break;
    }
  }

  if (!cancelAnimationFrame) {
    cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
});

define('lyria/entity', function() {
  
  //Lyria.Entity
  return (function() {
    var functionList;
  
    functionList = {};
  
    function Entity(name) {
      this.name = name != null ? name : this.constructor.name;
      this.components = {};
      functionList = {};
    }
  
    Entity.prototype.add = function(component) {
      var componentInstance, componentName, key, value;
      if (!component) {
        return this;
      }
      componentName = component.name;
      componentInstance = this.components[componentName];
      if (!componentInstance) {
        componentInstance = component;
        if (typeof componentInstance.register === "function") {
          componentInstance.register();
        }
        for (key in componentInstance) {
          value = componentInstance[key];
          if (key === 'constructor') {
            continue;
          }
          if (typeof value === 'function') {
            if (!functionList[key]) {
              functionList[key] = [];
            }
            functionList[key].push(value);
            if (!this[key]) {
              this[key] = (function(key) {
                return function() {
                  var functions, _i, _len, _ref;
                  _ref = functionList[key];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    functions = _ref[_i];
                    functions.apply(this, arguments);
                  }
                  return this;
                };
              })(key);
            }
          }
        }
      }
      return this;
    };
  
    Entity.prototype.remove = function(componentName) {
      var _base;
      if (this.components[componentName]) {
        if (typeof (_base = this.components[componentName]).unregister === "function") {
          _base.unregister();
        }
        delete this.components[componentName];
      }
      return this;
    };
  
    Entity.prototype.render = function() {
      var key, value, _ref;
      _ref = this.components;
      for (key in _ref) {
        value = _ref[key];
        if (typeof value.render === "function") {
          value.render();
        }
      }
      return this;
    };
  
    Entity.prototype.update = function(dt) {
      var key, value, _ref;
      _ref = this.components;
      for (key in _ref) {
        value = _ref[key];
        if (typeof value.update === "function") {
          value.update(dt);
        }
      }
      return this;
    };
  
    return Entity;
  
  })();
  
});
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/eventmap', function() {'use strict';

  /**
   * This is directly taken from
   * https://github.com/elysion-powered/elyssa/blob/master/src/core/events.coffee
   * Just using a different namespace
   */
  var __slice = [].slice;

  // Lyria.EventMap
  return (function() {
    var eventFunctions, eventMap;

    eventMap = {};

    eventFunctions = {};

    function EventMap() {
      eventMap = {};
      eventFunctions = {};
    }


    EventMap.prototype.validEvents = [];

    EventMap.prototype.on = function(eventName, eventFunction) {
      if (!eventFunction) {
        return;
      }
      if (this.validEvents.length > 0) {
        if (validEvents.indexOf(eventName) === -1) {
          return;
        }
      }
      eventMap[eventName] = {
        event: eventFunction,
        id: -1,
        type: ''
      };
      return this;
    };

    EventMap.prototype.off = function(eventName) {
      if (!eventName) {
        return;
      }
      if (eventMap[eventName].type === 'once' || eventMap[eventName].type === 'repeat') {
        if (eventMap[eventName].type === 'repeat') {
          window.clearInterval(eventMap[eventName].id);
        }
        if (eventMap[eventName].type === 'once') {
          window.clearTimeout(eventMap[eventName].id);
        }
      }
      if (eventMap[eventName]) {
        delete eventMap[eventName];
      }
      return this;
    };

    EventMap.prototype.trigger = function() {
      var args, context, eventName, interval, name, repeat, triggerFunction;
      eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (eventName == null) {
        return;
      }
      if ( typeof eventName === 'object') {
        name = eventName.name, interval = eventName.interval, repeat = eventName.repeat, context = eventName.context;
      } else {
        name = eventName;
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
      triggerFunction = function() {
        if (eventMap[name]) {
          return eventMap[name].event.apply(context, args);
        }
      };
      if (interval) {
        if (repeat) {
          eventMap[name].type = 'repeat';
          eventMap[name].id = window.setInterval(triggerFunction, interval);
        } else {
          eventMap[name].type = 'once';
          eventMap[name].id = window.setTimeout(triggerFunction, interval);
        }
      } else {
        eventMap[name].type = 'direct';
        triggerFunction.call(this);
      }
      return this;
    };

    return EventMap;

  })();
});

define('lyria/events', ['lyria/eventmap'], function(EventMap) {
  var instance = instance || new EventMap();

  return instance;
});

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/game', ['lyria/viewport', 'lyria/scene/director'], function(Viewport, Director) {
  'use strict';
  
  // Lyria.Game
  return (function() {
    
    // Constructor
    var Game = function() {};
    
    Game.prototype.viewport = new Viewport();
    Game.prototype.director = new Director(Game.prototype.viewport);
    Game.prototype.preloader = null;
    
    return Game;
    
  })();
  
});
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/gameobject', function() {
  'use strict';
  
  //Lyria.GameObject
  return (function() {
    
    // Constructor
    var GameObject = function() {
      
    };
    
    GameObject.prototype.add = function(component) {
      
    };
    
    GameObject.prototype.execute = function(functionBody) {
      
    };
    
    GameObject.prototype.log = function() {
      
    };
    
    return GameObject;
    
  })();
  
});
/**
 * @module Lyria
 */
define('lyria/layer', ['lyria/gameobject'], function(GameObject) {
  'use strict';

  return (function(parent) {

    /**
     * @class Layer
     * @extends Lyria.GameObject 
     * @constructor
     */
    var Layer = function() {

    };

    Layer.prototype = parent.prototype;

    return Layer;

  })(GameObject);
}); 
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/localization', ['checkt', 'jquery', 'lyria/language'], function(check, $, language) {'use strict';

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
      
      global.check(localization, {
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

define('lyria/globallocalization', ['lyria/localization', 'lyria/resource'], function(Localization, Resource) {
  var instance = instance || new Localization(Resource.name("i18n.json"));
  
  return instance;
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
  root.log = root.out = Lyria.Log.i;
  
  return Log;
});
/**
 * @module Lyria
 */
define('lyria/loop', ['root', 'requestAnimationFrame'], function(root, requestAnimationFrame) {
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

        $.each(taskList, function(key, value) {
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
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/prefab', ['lyria/scene', 'jquery'], function(scene, $) {
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
		
		options = $.extend(true, defaultOptions, options);
		
		return Lyria.Scene(prefabName, options);
		
	};
  
});
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/preloader', ['checkt', 'jquery'], function(checkt, $) {
  'use strict';

  /**
   * 
   */
  var Preloader = {
    maxAssets: 0,
    assetsLoaded: 0,
    percentLoaded: 0,
    init: function(assetArray, options) {
      var defaultOptions = {
        showLoadingScreen: true,
        loadingScreenClass: 'loading-screen',
        loadingBarClass: 'loading-bar'
      };
      options = $.extend(true, defaultOptions, options);
      
      
      function loadingProgress() {
  
        Preloader.percentLoaded = Preloader.assetsLoaded / Preloader.maxAssets;
        if (Preloader.onProgressChange) {
          Preloader.onProgressChange(Preloader.percentLoaded);
        }
  
        if (options.showLoadingScreen) {
          
        }
  
        if(Preloader.assetsLoaded === Preloader.maxAssets) {
          if (options.showLoadingScreen) {
            
          }
          
          if(Preloader.complete && ( typeof Preloader.complete === "function")) {
            // Callback
            Preloader.complete();
          }
        }
      }
  
      // Check if it's an array
      if(assetArray.length) {
        Preloader.maxAssets = assetArray.length;
  
        $.each(assetArray, function(key, value) {
          
          global.check(value, {
            object: function() {},
            string: function(arg) {
              if (arg.contains('/' + Lyria.Resource.path.image + '/')) {
                var img = new global.Image();
                img.onload = function() {
                  Preloader.assetsLoaded++;
                  
                  loadingProgress();
                };
                
                img.onerror = function(err) {
                  global.Log.e('Error while loading ' + arg);
                };
                
                img.src = arg;
              } else {
                $.ajax({url: arg, dataType: 'text'}).always(function() {
                  Preloader.assetsLoaded++;
                  
                  loadingProgress();
                }).error(function(err) {
                  global.Log.e('Error while loading ' + arg + ': ' + err);
                });
              }              
            }
          });

        });
      }
    },
    /**
     * 
     */
    onProgressChange: function(value) {
      
    },
    /**
     * 
     */
    complete: function() {
  
    }
  };
  
  return Preloader;
});
/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/scene/director', ['root', 'jquery', 'lyria/scene', 'lyria/viewport'], function(root, $, Scene, Viewport) {
  'use strict';
  
  /**
   * The scene director is the manager for all scenes
   *
   */
  return (function() {

    function SceneDirector(container, parent) {

      if ( container instanceof Viewport) {
        this.viewport = container;
      } else {
        this.viewport = new Viewport(container, parent);
      }

      this.sceneList = {};
      this.currentScene = null;
      this.onSceneChange = function(scene) {
      };

    }

    // Properties
    SceneDirector.prototype.sceneClassName = 'scene';

    // Methods
    SceneDirector.prototype.add = function(scene, options) {

      if (!( scene instanceof Scene)) {
        if (Lyria && Lyria.Scenes && Lyria.Scenes[scene]) {
          scene = Lyria.Scenes[scene];
        } else {
          throw 'No valid scene found.';
        }
      }

      scene.parent = this;
      this.sceneList[scene.name] = scene;

      if (this.viewport.$container) {
        if ($('#' + scene.name).length === 0) {
          this.viewport.$container.prepend($(root.document.createElement('div')).attr('id', scene.name).attr('class', SceneDirector.prototype.sceneClassName));

          if (scene.content) {
            $('#' + scene.name).html(scene.content);
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
        }
      }

      return this;
    };

    SceneDirector.prototype.show = function(scene, options, callback) {

      if (this.onSceneChange) {
        this.onSceneChange(scene);
      }

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

        if (this.currentScene.onDeactivated) {
          this.currentScene.onDeactivated(options);
        }

      }

      $.each(this.sceneList, function(key, value) {
        if (key === scene) {

          if (scene.transition && scene.transition.length) {
            $('#' + scene).show(scene.transition.length);
          } else {
            $('#' + scene).show();
          }
          this.currentScene = value;
          if (this.currentScene.onActive) {
            this.currentScene.onActive(options);
          }

          if (callback)
            callback(scene);

          return false;
        }
      });
    };

    SceneDirector.prototype.render = function() {
      if (!this.currentScene.render) {
        return;
      }
      this.currentScene.render();
    };

    SceneDirector.prototype.update = function(dt) {
      if (!this.currentScene.update) {
        return;
      }
      this.currentScene.update(dt);
    };

    return SceneDirector;

  })();
});

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/scene', ['jquery', 'lyria/eventmap', 'lyria/gameobject'], function($, EventMap, GameObject) {
  'use strict';

  var sceneCache = {};

  //Lyria.Scene
  return (function() {
    
    var Scene = function(sceneName, sceneFunction, options) {
      if (!sceneName) {
        return;
      }
      
      // We need a reference to the scene not being this
      var self = this;
      
      // Set name
      this.name = sceneName;
      
      // Create new event map
      this.eventMap = new EventMap();
      
      // Default values
      this.localization = {};
      
      // Set a context object for sceneFunction to be called in
      var context = {};
      
      // Call scene
      var retValue = sceneFunction.call(context, this);
      
      // Mix in keys from context to the scene object
      $.each(context, function(key, value) {
        if (self[key]) {
          
        } else {
          self[key] = value;           
        }
      });
      
      
      /*if (this.localization) {
        var currentLocalization = this.localization['de'];
        
        retValue = $.extend(retValue, currentLocalization);
      }*/

      if (this.template) {
        this.content = this.template(retValue);
      }
      
      
      
      if (this.events) {
        if (options && options.isPrefab) {
          this.events.delegate = (options.target) ? options.target : 'body';              
        } else {
          this.events.delegate = '#' + sceneName;
        }        
      }
      
    };
    
    Scene.prototype.add = function(gameObject) {
      if (gameObject instanceof GameObject) {
        
      }
    };
    
    var methods = Object.keys(EventMap.prototype);
    
    for (var i = 0, j = methods.length; i < j; i++) {
      (function(iterator) {
        Scene.prototype[iterator] = function() {
          this.eventMap[iterator].apply(this, arguments);
        };
      })(methods[i]);
    }
    
    return Scene;
    
  })();
  
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
                str += p + ': ' + Lyria.Utils.serializeObject(anyObject[p]) + commaStr + '\n';
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
define('lyria/viewport', ['root'], function(root) {
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
