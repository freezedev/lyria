/**
 * @module Lyria
 */
define('lyria/viewport', ['root', 'jquery', 'isemptyobject'], function(root, $, isEmptyObject) {
  'use strict';

  return (function() {
    
    
  /**
   * @class Viewport
   * @constructor
   */
    function Viewport(container, options) {
      var defaultOptions = {
        parent: null,
        trigger: {
          element: 'window',
          event: 'resize'
        },
        scaleMode: 'scaleToFit'
      };
      
      options = $.extend(options, defaultOptions);
      
      /**
       * The viewport width
       *
       * @property width
       * @type {Number} 
       * @default 800
       */
      this.width = 800;
      
      /**
       * The viewport height
       * 
       * @property height
       * @type {Number}
       * @default 600 
       */
      this.height = 600;
      
      this.transforms = {};
      
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
      
      var self = this;
      $(options.trigger.element).on(options.trigger.event, function() {
        switch (self.scaleMode) {
          // TODO: Implement logic
          case 'scaleToFit': break;
          default: break;
        }
      });
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
      if (isEmptyObject(this.transforms)) {
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
