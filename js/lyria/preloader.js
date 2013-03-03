/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(global, Lyria, $, undefined) {
  'use strict';

  /**
   * 
   */
  Lyria.Preloader = {
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
  
        Lyria.Preloader.percentLoaded = Lyria.Preloader.assetsLoaded / Lyria.Preloader.maxAssets;
        if (Lyria.Preloader.onProgressChange) {
          Lyria.Preloader.onProgressChange(Lyria.Preloader.percentLoaded);
        }
  
        if (options.showLoadingScreen) {
          
        }
  
        if(Lyria.Preloader.assetsLoaded === Lyria.Preloader.maxAssets) {
          if (options.showLoadingScreen) {
            
          }
          
          if(Lyria.Preloader.complete && ( typeof Lyria.Preloader.complete === "function")) {
            // Callback
            Lyria.Preloader.complete();
          }
        }
      }
  
      // Check if it's an array
      if(assetArray.length) {
        Lyria.Preloader.maxAssets = assetArray.length;
  
        $.each(assetArray, function(key, value) {
          
          global.check(value, {
            object: function() {},
            string: function(arg) {
              if (arg.contains('/' + Lyria.Resource.path.image + '/')) {
                var img = new global.Image();
                img.onload = function() {
                  Lyria.Preloader.assetsLoaded++;
                  
                  loadingProgress();
                };
                
                img.onerror = function(err) {
                  global.Log.e('Error while loading ' + arg);
                };
                
                img.src = arg;
              } else {
                $.ajax({url: arg, dataType: 'text'}).always(function() {
                  Lyria.Preloader.assetsLoaded++;
                  
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
  
})(this, this.Lyria = this.Lyria || {}, this.jQuery);
