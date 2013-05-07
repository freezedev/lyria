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
    };

    Preloader.prototype.start = function(options) {
      // Check if it's valid
      if (this.assets == null || Object.keys(this.assets).length === 0) {
        return;
      }

      this.trigger('start');

      var defaultOptions = {
        steps: ['image', 'audio'],
        showLoadingScreen: true,
        loadingScreenClass: 'loading-screen',
        loadingBarClass: 'loading-bar'
      };
      options = $.extend(true, defaultOptions, options);

      var totalSize = this.assets.totalSize;
      var currentProgress = 0;
      
      if ((options.steps == null) || (options.steps.length === 0)) {
        
      }
      
      
      
      /*for (var i = 0, j = this.assets.length; i < j; i++) {
        for (var k = 0, l = options.steps.length; k < l; k++) {
          
        }
      }*/
      
      /*for (var k = 0, l = options.steps.length; k < l; k++) {
        for (var i = 0, j = this.assets.length; i < j; i++) {
          (function(iterator) {
              if (iterator.indexOf('/' + Resource.path[options.steps[k]] + '/') >= 0) {
                assetSteps[options.steps[k]] = assetSteps[options.steps[k]] || {};
                assetSteps[options.steps[k]].assets = assetSteps[options.steps[k]].assets || [];
                assetSteps[options.steps[k]].assets.push(iterator);
                return;
              }
              
              assetSteps.queue.assets.push(iterator);
            })(this.assets[i]);
          }
        }*/
      
        
      
      //console.log(assetSteps);

      var self = this;

      function loadingProgress() {

        var percentLoaded = currentProgress / totalSize;

        self.trigger('progresschange', percentLoaded);

        if (options.showLoadingScreen) {

        }

        if (currentProgress === totalSize) {
          if (options.showLoadingScreen) {

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