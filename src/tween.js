define(['eventmap', 'mixedice', 'options', 'jqueryify'], function (EventMap, mixedice, options, $fy) {
  'use strict';

  /**
   * @module lyria/tween
   * @requires eventmap
   * @requires mixedice
   * @requires options
   * @requires jqueryify
   */

  var Tween = (function () {

    /**
     * @class
     * @alias module:lyria/tween
     *
     * @param {Object} opts
     * @param {String} opts.property - The property that gets animated
     * @param {String|jQuery} opts.target - The target of the tween
     * @param {String} opts.easing - The easing of the tween, for example linear
     * @param {Number} opts.duration - How long the tween is being animated
     * @param {Number} opts.delay - Delays the tween at the beginning
     */
    var Tween = function (opts) {
      opts = options(opts, {
        elem: null,
        effects: [
          {
            property: null,
            target: null,
            easing: Tween.defaults.easing,
            duration: Tween.defaults.duration,
            delay: Tween.defaults.delay
          }
        ]
      });

      this.$elem = $fy(opts.elem);
      this.effects = opts.effects;

      this.hwAccelerated = true;

      mixedice([this, Tween.prototype], new EventMap());

      var self = this;

      this.on('start', function () {
        if (self.$elem) {
          return;
        }

        var effects = [];
        var properties = {};

        for (var i = 0, j = self.effects.length; i < j; i++) {
          (function (item) {
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

        $(document).one('transitionend', function (e) {
          console.log(e.target);
        });
      });
    };

    /**
     * @member module:lyria/tween.defaults
     */
    Tween.defaults = {
      easing: 'linear',
      duration: '300ms',
      delay: '0ms'
    };

    return Tween;
  })();

  return Tween;

});
