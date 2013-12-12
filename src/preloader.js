/**
 * @module Lyria
 */
define(['root', 'mixer', 'jquery', 'lyria/resource', 'lyria/log', 'eventmap'], function(root, mixer, $, Resource, Log, EventMap) {'use strict';

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
      mixer([this, Preloader.prototype], new EventMap());

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
       * @property steps
       * @type {Array}
       */
      this.steps = [];

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
        taskList.add({
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
    Preloader.prototype.task.async = function(taskFn) {
      if ( typeof taskFn === 'function') {
        taskList.add({
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

      if ((this.steps == null) || (this.steps.length === 0)) {

      }

      var hasLoadingScene = this.sceneDirector != null && this.loadingScene != null;

      if (hasLoadingScene) {
        this.sceneDirector.show(this.loadingScene);
      }

      var self = this;

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
          if (hasLoadingScene) {
            self.sceneDirector.currentScene.trigger('complete');
          }

          self.trigger('complete');
        }
      };

      var loadCustomTasks = function() {
        var maxTasks = taskList.length;
        var currentTasks = 0;

        var checkIfComplete = function() {
          if (currentTasks === maxTasks) {
            loadingComplete();
          }
        };
        
        var doneFn = function() {
          currentTasks++;
          checkIfComplete();
        };

        if (taskList.length === 0) {
          loadingComplete();
        } else {
          for (var i = 0, j = taskList.length; i < j; i++) {
            (function(item) {
              if (item.async) {
                item.task.call(this, doneFn);
              } else {
                item.task();
                doneFn();
              }
            })(taskList[i]);
          }
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

              if (iterator.type.indexOf('image') === 0) {
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
      } else {
        loadingProgress();
      }

    };

    return Preloader;

  })();

  return Preloader;
});
