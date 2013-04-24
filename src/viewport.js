/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/viewport', ['root'], function(root) {
  'use strict';

  // Lyria.Viewport
  return (function() {
    
    function Viewport(container, parent) {
      
      // Defaults container to the string 'viewport'
      if (container == null) {
        container = 'viewport';
      }

      if ($('#' + container).length > 0) {
        this.$container = $('#' + container);
      } else {
        var createdElement = $(root.document.createElement('div')).attr('id', container);
        
        if (parent) {
          $(parent).prepend(createdElement);
        } else {
          $('body').prepend(createdElement);
        }
        
        this.$container = $('#' + container);
      }
      
    }
    
    Viewport.prototype.scale = function(scaleX, scaleY) {
      if (scaleX == null) {
        return;
      }
      
      if (scaleY == null) {
        scaleY = scaleX;
      }
      
      this.$container.css('transform', 'scale(' + scaleX + ',' + scaleY + ')');
    };
    
    Viewport.prototype.center = function() {
      
    };
    
    Viewport.prototype.rotate = function(angle) {
      if (angle == null) {
        return;
      }
      
      this.$container.css('transform', 'rotate(' + angle + ')');
    };
    
    return Viewport;
    
  })();
});
