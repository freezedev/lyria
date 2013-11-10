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
      
      mixer([this, Viewport.prototype], new EventMap());

      this.scale = {};
      this.scale.mode = options.scaleMode;
      this.scale.x = 1.0;
      this.scale.y = 1.0;

      // Defaults container to the string 'viewport'
      if (container == null) {
        container = 'viewport';
      }
      
      Object.defineProperty(this, '$element', {
        get: function() {
          return $('#' + container);
        }
      });

      /**
       * The viewport element (jQuery object)
       *
       * @property $element
       * @type {jQuery}
       */
      if (this.$element.length === 0) {
        var createdElement = $(root.document.createElement('div')).attr('id', container).attr('class', 'viewport');

        if (options.parent) {
          $(options.parent).prepend(createdElement);
        } else {
          $('body').prepend(createdElement);
        }
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
        
        // TODO: Reset scaling to 1.0
        
        var scaleElement = function(scaleX, scaleY) {
          if (scaleY == null) {
            scaleY = scaleX;
          }
          
          var scaleExp = 'scale(' + scaleX + ', ' + scaleY + ')';
          self.$element.css('transform', scaleExp);
          
          self.scale.x = scaleX;
          self.scale.y = scaleY;
        };

        var scaleHeightToFit = function(doNotSetTransform) {
          var scaleFactor = 0;
          
          if (self.height > $(options.trigger.element).innerHeight()) {
            scaleFactor = $(options.trigger.element).innerHeight() / self.height;

            if (doNotSetTransform) {
              return scaleFactor;
            } else {
              scaleElement(scaleFactor);
              return scaleFactor;
            }
          }
          
          return 1.0;
        };

        var scaleWidthToFit = function(doNotSetTransform) {
          var scaleFactor = 0;
          
          if (self.width > $(options.trigger.element).innerWidth()) {
            scaleFactor = $(options.trigger.element).innerWidth() / self.width;
            
            if (doNotSetTransform) {
              return scaleFactor;
            } else {
              scaleElement(scaleFactor);
              return scaleFactor;
            }
          }
          
          return 1.0;
        };

        switch (self.scale.mode) {
          case 'stretch':
            break;
          case 'cover':
            break;
          case 'scaleToFit':
            var scaleX = 1;
            var scaleY = 1;
          
            if ($(options.trigger.element).innerHeight() < self.height) {
              scaleY = scaleHeightToFit(true);
            }
            
            if ($(options.trigger.element).innerWidth() < self.width) { 
              scaleX = scaleWidthToFit(true);                
            }
            
            scaleElement(Math.min(scaleX, scaleY));
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
      
      // Call scale event
      self.trigger('scale');
    }

    return Viewport;

  })();
});
