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