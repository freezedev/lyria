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
