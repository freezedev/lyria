/**
 * @module Lyria
 */
define('lyria/preloader', ['root', 'mixer', 'jquery', 'lyria/resource', 'lyria/log', 'eventmap'], function(root, mixer, $, Resource, Log, EventMap) {'use strict';

  /**
   * Provides a preloader to load assets before they are needed
   * 
   * @class Preloader
   */
  var Preloader = (function() {

    /**
     * @constructor
     * 
     * @param {Object} assetArray
     */
    var Preloader = function(assetArray) {
      mixer(Preloader.prototype, new EventMap());

      /**
       * @property assets
       * @type {Array} 
       */
      if (assetArray != null) {
        this.assets = assetArray;
      } else {
        this.assets = [];
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
    };

    /**
     * Starts the preloader and loads all assets asynchronously. Triggers
     * events when necessary.
     * 
     * @method start 
     */
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