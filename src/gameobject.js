define(['mixedice', 'eventmap', './component', './log'], function(mixedice, EventMap, Component, Log) {
  'use strict';
  
  /**
   * @module lyria/gameobject
   * @requires mixedice
   * @requires eventmap
   * @requires lyria/component
   * @requires lyria/log
   */
  
  return (function() {
    
    /**
     * @class
     * @alias module:lyria/gameobject
     * 
     */
    var GameObject = function() {
      mixedice([this, GameObject.prototype], new EventMap());
      
      var self = this;
      
      this.components = {};
      this.className = 'gameobject';
      
      this.template = {};
      this.template.source = '<div id="{{id}}" class="{{className}}"></div>';
      
      this.on('update', function(dt) {
        if (_.isEmpty(self.components)) {
          return;
        }
        
        _.each(self.components, function(key, value) {
          value.trigger('update', dt);
        });
      });
    };
    
    /**
     * Refreshes the game object
     *
     * @param {Object} val
     */
    GameObject.prototype.refresh = function(val) {
      if (val == null && this.template) {
        val = this.template.data;
      }

      if (this.template && this.template.source) {
        this.content = this.template.source(val);
      }

      this.trigger('refresh');
    };
    
    /**
     * 
     * @param {module:lyria/component} component
     */
    GameObject.prototype.add = function(component) {
      if (component instanceof Component) {
        this.components[component.name] = component;
      }
    };
    
    /**
     * 
     * @param {Function} functionBody
     */
    GameObject.prototype.execute = function(functionBody) {
      functionBody.apply(this, this);
    };
    
    /**
     * Logs from the game object itself
     * 
     * @param {String} text
     */
    GameObject.prototype.log = function(text) {
      Log.i('GameObject: ' + text);
    };
    
    return GameObject;
    
  })();
  
});