define(['jquery', 'mixedice', 'eventmap'], function($, mixedice, EventMap) {
  'use strict';
  
  var Animation = (function() {
    var Animation = function($elem, options) {
      this.$elem = $elem;
      
      var defaultOptions = {
        frame: {
          width: 0,
          height: 0,
          current: 0
        },
        speed: 1
      };
      
      options = $.extend(true, defaultOptions, options);
      
      this.frame = {};
      this.frame.width = options.frame.width;
      this.frame.height = options.frame.height;
      this.frame.current = options.frame.current;
      this.speed = options.speed;
      
      this.sprite = {};
      this.sprite.width;
      this.sprite.height;
      this.sprite.image = new Image();
      
      // Mix-in eventmap
      mixedice([this, Animation.prototype], new EventMap());
      
      this.on('play', function() {
        
      });
      
      this.on('pause', function() {
        
      });
      
      this.on('reset', function() {
        
      });
      
      this.on('stop', function() {
        
      });
    };
    
    return Animation;
  })();
  
  return Animation;
});
