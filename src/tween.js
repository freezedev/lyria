define('lyria/tween', ['eventmap', 'mixer', 'jqueryify'], function(EventMap, mixer, $fy) {
  var Tween = (function() {
    var Tween = function(elem) {
      this.$elem = $fy(elem);
      
      mixer(Tween.prototype, new EventMap());
    };
    
    return Tween;
  })();
  
  return Tween;
});