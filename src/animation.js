define('lyria/animation', ['mixer', 'eventmap'], function(mixer, EventMap) {
  var Animation = (function() {
    var Animation = function($elem, options) {
      this.$elem = $elem;
      
      this.frame.width = 0 || options.width;
      this.frame.height = 0 || options.height;
      this.frame.current = 0;
      
      this.sprite.width;
      this.sprite.height;
      this.sprite.image = new Image();
      
      mixer([this, Animation.prototype], new EventMap());
    };
    
    Animation.prototype.reset = function() {
      
    };
  })();
  
  return Animation;
});
