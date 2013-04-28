/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/preloader', ['root', 'check', 'jquery', 'lyria/resource', 'lyria/log'], function(root, check, $, Resource, Log) {
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
          
          check(value, {
            object: function() {},
            string: function(arg) {
              if (arg.indexOf('/' + Resource.path.image + '/') >= 0) {
                var img = new root.Image();
                img.onload = function() {
                  Preloader.assetsLoaded++;
                  
                  loadingProgress();
                };
                
                img.onerror = function(err) {
                  Log.e('Error while loading ' + arg);
                };
                
                img.src = arg;
              } else {
                $.ajax({url: arg, dataType: 'text'}).always(function() {
                  Preloader.assetsLoaded++;
                  
                  loadingProgress();
                }).error(function(err) {
                  Log.e('Error while loading ' + arg + ': ' + err);
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