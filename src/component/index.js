define(['mixedice', 'eventmap', './component/manager', './log'], function(mixedice, EventMap, ComponentManager, Log) {
  'use strict';
  
  /**
   * @module lyria/component
   * @requires eventmap
   * @requires lyria/component/manager
   * @requires lyria/log 
   */

  return (function() {
    
    /**
     * @class
     * @alias module:lyria/component
     * @lends module:eventmap 
     */

    var Component = function(name, factory) {
      mixedice([this, Component.prototype], new EventMap());
      
      this.name = name != null ? name : this.constructor.name;
      
      this.type = 'Component';
      
      this.children = {};
      
      if (factory) {
        factory.apply(this, [this]);        
      }
      
      this.on('update', function(dt) {
        for (var key in this.children) {
          var value = this.children[key];
          if (value && value.trigger) {
            value.trigger('update', dt);
          }
        }
      });
    };
    
    /**
     * Adds a component to this entity
     * 
     * @param {Object} child
     */
    Component.prototype.add = function(child) {
      var name = 'anonymous-' + Date.now();
      var childObject = null;
      
      if (typeof child === 'string') {
        name = child;
        childObject = ComponentManager.get(name);
      } else {
        name = child.name || name;
        childObject = child;
      }
      
      this.children[name] = childObject;
      
      this.trigger('add', name);
      childObject.trigger('added', this);
    };
    
    /**
     * Removes a component from the entity
     *  
     * @param {String} name
     */
    Component.prototype.remove = function(name) {
      if (name == null) {
        return;
      }
      
      delete this.children[name];
      
      this.trigger('remove', name);
    };
    
    /**
     * Logs from the component itself
     * 
     * @param {String} text
     */
    Component.prototype.log = function(text) {
      if (this.type === this.name) {
        Log.i(this.type + ': ' + text);                
      } else {
        Log.i('[' + this.type + '] ' + this.name + ': ' + text);        
      }
    };

    return Component;

  })();

});
