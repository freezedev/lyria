define(['mixedice', 'eventmap', 'lyria/component', 'lyria/log'], function(mixedice, EventMap, Component, Log) {
  'use strict';
  
  /**
   * @module lyria/gameobject
   */
  
  //Lyria.GameObject
  return (function() {
    
    // Constructor
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
    
    GameObject.prototype.add = function(component) {
      if (component instanceof Component) {
        this.components[component.name] = component;
      }
    };
    
    GameObject.prototype.execute = function(functionBody) {
      functionBody.apply(this, this);
    };
    
    GameObject.prototype.log = function(text) {
      Log.i('GameObject: ' + text);
    };
    
    return GameObject;
    
  })();
  
});