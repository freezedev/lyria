define(['jquery', 'mixedice', '../component', '../sprite/renderer'], function($, mixedice, Component, Renderer) {
  'use strict';
  
  var SpriteManager = (function() {
    
    var SpriteManager = function() {
      var type = 'SpriteManager';
      
      mixedice([this, SpriteManager.prototype], new Component(type));
      this.type = type;
    };
    
    return SpriteManager;
    
  })();
  
  return SpriteManager;
  
});
