define('lyria/sprite/manager', ['jquery', 'mixer', 'lyria/component', 'lyria/sprite/renderer'], function($, mixer, Component, Renderer) {
  
  var SpriteManager = (function() {
    
    var SpriteManager = function() {
      var type = 'SpriteManager';
      
      mixer([this, SpriteManager.prototype], new Component(type));
      this.type = type;
    };
    
    return SpriteManager;
    
  })();
  
  return SpriteManager;
  
});
