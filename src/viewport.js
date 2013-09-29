/**
 * @module Lyria
 */
define('lyria/viewport', ['root', 'jquery', 'mixer', 'eventmap'], function(root, $, mixer, EventMap) {'use strict';

  return (function() {

    /**
     * @class Viewport
     * @constructor
     */
    function Viewport(container, options) {
      var defaultOptions = {
        parent: null,
        trigger: {
          element: window,
          event: 'resize'
        },
        scaleMode: 'scaleToFit'
      };

      options = $.extend(options, defaultOptions);
      
      mixer(Viewport.prototype, new EventMap());

      this.scaleMode = options.scaleMode;

      // Defaults container to the string 'viewport'
      if (container == null) {
        container = 'viewport';
      }

      /**
       * The viewport element (jQuery object)
       *
       * @property $element
       * @type {jQuery}
       */
      if ($('#' + container).length > 0) {
        this.$element = $('#' + container);
      } else {
        var createdElement = $(root.document.createElement('div')).attr('id', container).attr('class', 'viewport');

        if (options.parent) {
          $(options.parent).prepend(createdElement);
        } else {
          $('body').prepend(createdElement);
        }

        this.$element = $('#' + container);
      }

      Object.defineProperty(this, 'width', {
        get: function() {
          return this.$element.outerWidth();
        }
      });

      Object.defineProperty(this, 'height', {
        get: function() {
          return this.$element.outerHeight();
        }
      });

      var self = this;

      this.on('scale', function() {
        var scaleFactor = 0;
        var scaleExp = 0;

        var scaleHeightToFit = function() {
          if (self.height > $(options.trigger.element).innerHeight()) {
            scaleFactor = $(options.trigger.element).innerHeight() / self.height;
            scaleExp = 'scale(' + scaleFactor + ', ' + scaleFactor + ')';

            self.$element.css('transform', scaleExp);
          }
        };

        var scaleWidthToFit = function() {
          if (self.width > $(options.trigger.element).innerWidth()) {
            scaleFactor = $(options.trigger.element).innerWidth() / self.width;
            scaleExp = 'scale(' + scaleFactor + ', ' + scaleFactor + ')';

            self.$element.css('transform', scaleExp);
          }
        };

        switch (self.scaleMode) {
          case 'scaleToFit':
            if ($(options.trigger.element).innerWidth() > self.width) {
              scaleWidthToFit();
            } else {
              scaleHeightToFit();
            }
            break;
          case 'scaleHeightToFit':
            scaleHeightToFit();
            break;
          case 'scaleWidthToFit':
            scaleWidthToFit();
            break;
          default:
            break;
        }
      });

      $(options.trigger.element).on(options.trigger.event, self.trigger.bind(self, 'scale'));
    }

    /**
     * Adds a behaviour which will be triggered on certain events
     *
     * @method behaviour
     * @param {Object} fn
     */
    Viewport.prototype.behaviour = function(fn) {

    };

    /**
     * Reset all CSS transforms on the viewport
     *
     * @method resetTransforms
     */
    Viewport.prototype.resetTransforms = function() {
      this.transforms = {};
    };

    /**
     * Updated CSS transforms on the viewport
     *
     * @method updateTransforms
     */
    Viewport.prototype.updateTransforms = function() {
      if ($.isEmptyObject(this.transforms)) {
        return;
      }

      this.$element.css('transform', this.transforms.join(' '));
    };

    /**
     * Scales the viewport
     *
     * @method scale
     * @param {Object} scaleX
     * @param {Object} scaleY
     */
    Viewport.prototype.scale = function(scaleX, scaleY) {
      if (scaleX == null) {
        return;
      }

      if (scaleY == null) {
        scaleY = scaleX;
      }

      this.transforms.scale = this.transforms.scale || {};
      this.transforms.scale.x = scaleX;
      this.transforms.scale.y = scaleY;

      this.$element.css('transform', '');
    };

    /**
     * Sets an origin for the viewport
     *
     * @method origin
     * @param {Number} originX
     * @param {Number} originY
     */
    Viewport.prototype.origin = function(originX, originY) {

    };

    /**
     * Centers the viewport
     *
     * @method center
     */
    Viewport.prototype.center = function() {

    };

    /**
     * Rotate the viewport
     *
     * @method rotate
     * @param {Number} angle
     */
    Viewport.prototype.rotate = function(angle) {
      if (angle == null) {
        return;
      }

      this.transforms.rotate = angle;

      this.$element.css('transform', 'rotate(' + angle + ')');
    };

    return Viewport;

  })();
});
