define(['root', 'mixedice', 'jquery', './resource', './log', 'eventmap'], function(root, mixedice, $, Resource, Log, EventMap) {'use strict';
  /**
   * @module lyria/preloader
   * @requires root
   * @requires mixedice
   * @requires jquery
   * @requires lyria/resource
   * @requires lyria/log
   * @requires eventmap
   */

  /**
   * Provides a preloader to load assets before they are needed
   *
   * @class
   * @alias module:lyria/preloader
   * @augments module:eventmap
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
      
      var loadSuccess = function(iterator) {
        return function() {
          currentProgress += iterator.size;
          self.assetsLoaded++;

          loadingProgress();
        };
      };
      
      var loadError = function(iterator) {
        return function(err) {
          Log.e('Error while loading ' + iterator.name + ': ' + err);
        };
      };
      var supportedTypes = {
        'mp3' : 'audio/mpeg',
        'wav' : 'audio/wav',
        'ogg' : 'audio/ogg'
      };
      if (Object.keys(this.assets).length > 0) {
        // Go through all assets and preload them
        $.each(this.assets, function(key, value) {

          if (value.files == null || !Array.isArray(value.files) || value.files.length === 0) {
            return true;
          }
          
          self.maxAssets += value.files.length;

          for (var i = 0, j = value.files.length; i < j; i++) {
            (function(iterator) {
              // Handle images here
              if (iterator.type.indexOf('image') === 0) {
                // TODO: Reflect: Does it make sense to put the cached images into an object?
                var img = new root.Image();
                img.onload = loadSuccess(iterator);
                img.onerror = loadError(iterator);

                img.src = iterator.name;
              } else {
                // Handle audio here
                if (iterator.type.indexOf('audio') === 0) {
                  // TODO: Save preloaded files in the AudioManager
                  var audio = new root.Audio();
                  if (supportedTypes[fileExtension] && audio.canPlayType(supportedTypes[fileExtension])) {
                    audio.addEventListener('canplaythrough', loadSuccess(iterator));
                    audio.onerror = loadError(iterator);
                    
                    audio.src = iterator.name;
                    audio.load();
                  } else {
                    Log.w('Skipped unsupported audio file ('+supportedTypes[fileExtension]+') ' + iterator.name);
                    loadSuccess(iterator)();
                  }
                } else {
                  $.ajax({
                    url: iterator.name,
                    dataType: 'text'
                  }).always(loadSuccess(iterator)).error(loadError(iterator));
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
