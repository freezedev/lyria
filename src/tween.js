define('lyria/tween', ['eventmap', 'mixer', 'options', 'jqueryify'], function(EventMap, mixer, options, $fy) {
  var Tween = (function() {
    var Tween = function(opts) {
      opts = options(opts, {
        elem: null,
        effects: [{
          property: null,
          target: null,
          easing: Tween.defaults.easing,
          duration: Tween.defaults.duration,
          delay: Tween.defaults.delay
        }]
      });
      
      this.$elem = $fy(opts.elem);
      this.effects = opts.effects;

      this.hwAccelerated = true;

      mixer(Tween.prototype, new EventMap());

      var self = this;

      this.on('start', function() {
        if (self.$elem) {
          return;
        }
        
        var effects = [];
        var properties = {};
        
        for (var i = 0, j = self.effects.length; i < j; i++) {
          (function(item) {
            if (item.property == null || item.target == null) {
              return;
            }
            
            item.duration = item.duration || Tween.defaults.duration;
            item.easing = item.easing || Tween.defaults.easing;
            item.delay = item.delay || Tween.defaults.delay;
            
            effects.push([item.property, item.duration, item.easing, item.delay].join(' '));
            properties[item.property] = item.target;
          })(self.effects[i]);
        }
        
        properties['transition'] = effects.join(', ');
        self.$elem.css(properties);
        
        $(document).one('transitionend', function(e) {
          console.log(e.target);
        });
      });
    };
    
    Tween.defaults = {
      easing: 'linear',
      duration: '300ms',
      delay: '0ms'
    };

    return Tween;
  })();

  return Tween;
}); 