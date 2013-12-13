define(['jquery', 'mixedice', 'lyria/component', 'lyria/sprite/renderer'], function($, mixedice, Component, Renderer) {
  
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
