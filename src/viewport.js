define(['root', 'jquery', 'mixedice', 'eventmap'], function(root, $, mixedice, EventMap) {'use strict';

  /**
   * @module lyria/viewport
   * @requires root
   * @requires jquery
   * @requires mixedice
   * @requires eventmap 
   */

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

      options = $.extend(defaultOptions, options);
      
      mixedice([this, Viewport.prototype], new EventMap());

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
        // TODO: Set properties to set origin to center

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
          
          if ((self.scale.x !== scaleX) || (self.scale.y !== scaleY)) {
            self.scale.x = scaleX;
            self.scale.y = scaleY;
            
            self.trigger('scale:change', self.scale.x, self.scale.y);            
          }
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

      $(options.trigger.element).on(options.trigger.event, function() {
        self.trigger('scale');
      });
      
      // Call scale event
      self.trigger('scale');
    }
    
    // TODO: Reflect if it should be fitWidthToAspectRatio and fitHeightToAspectRatio
    // TODO: Reflect if this should be done when resizing (scale event)
    Viewport.prototype.fitToAspectRatio = function(dimension) {
      var windowRatio = $(window).width() / $(window).height();
      
      switch (dimension) {
        case 'width':
          var newWidth = this.height * windowRatio;
          this.$element.width(newWidth);
          this.$element.css('margin-left', (newWidth / (-2)) + 'px');
          break;
        case 'height':
          var newHeight = this.width / windowRatio;
          this.$element.height(newHeight);
          this.$element.css('margin-top', (newHeight / (-2)) + 'px');        
          break;
      }
    };

    return Viewport;

  })();
});
