define('lyria/animation', function() {
  var Animation = (function() {
    var Animation = function($elem, options) {
      this.$elem = $elem;
      
      this.frame.width = 0 || options.width;
      this.frame.height = 0 || options.height;
      this.frame.current = 0;
    };
    
    Animation.prototype.play = function() {
      
    };
    
    Animation.prototype.pause = function() {
      
    };
    
    Animation.prototype.resume = function() {
      
    };
    
    Animation.prototype.stop = function() {
      
    };
    
    Animation.prototype.reset = function() {
      
    };
  })();
  
  return Animation;
});
