/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/preloader', ['root', 'check', 'mixin', 'jquery', 'lyria/resource', 'lyria/log', 'lyria/eventmap'], function(root, check, mixin, $, Resource, Log, EventMap) {'use strict';

  /**
   *
   */
  var Preloader = (function() {

    var Preloader = function(assetArray) {
      mixin(Preloader.prototype, new EventMap('Preloader'));

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
      // Check if it's an array
      if (!Array.isArray(this.assets) || this.assets.length === 0) {
        return;
      }

      this.trigger('start');

      var defaultOptions = {
        showLoadingScreen: true,
        loadingScreenClass: 'loading-screen',
        loadingBarClass: 'loading-bar'
      };
      options = $.extend(true, defaultOptions, options);

      var self = this;

      function loadingProgress() {

        self.percentLoaded = self.assetsLoaded / self.maxAssets;

        self.trigger('progresschange', self.percentLoaded);

        if (options.showLoadingScreen) {

        }

        if (self.assetsLoaded === self.maxAssets) {
          if (options.showLoadingScreen) {

          }

          self.trigger('complete');
        }
      }


      this.maxAssets = this.assets.length;

      $.each(this.assets, function(key, value) {

        check(value, {
          object: function() {
          },
          string: function(arg) {
            if (arg.indexOf('/' + Resource.path.image + '/') >= 0) {
              var img = new root.Image();
              img.onload = function() {
                self.assetsLoaded++;

                loadingProgress();
              };

              img.onerror = function(err) {
                Log.e('Error while loading ' + arg);
              };

              img.src = arg;
            } else {
              $.ajax({
                url: arg,
                dataType: 'text'
              }).always(function() {
                self.assetsLoaded++;

                loadingProgress();
              }).error(function(err) {
                Log.e('Error while loading ' + arg + ': ' + err);
              });
            }
          }
        });

      });
    };

    return Preloader;

  })();

  return Preloader;
});
