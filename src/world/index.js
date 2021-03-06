define(['mixedice', 'eventmap', 'lyria/world/data'], function(mixedice, EventMap, WorldData) {'use strict';

  var World = (function() {

    var World = function() {
      mixedice([this, World.prototype], new EventMap());
      
      this.events = new EventMap();
      this.data = new WorldData(this);

      this.register({
        name: 'state',
        value: ''
      });
    };

    World.prototype.register = function(options) {
      var name = options.name;
      var value = options.value;
      var isConstant = options.constant;

      var self = this;

      var getter = function(val) {
        self.trigger('value', name, value);
        self.trigger(name + ':value', value);

        return val;
      };

      var setter = function(val) {
        if (value !== val) {
          value = val;

          self.trigger('change', name, value);
          self.trigger(name + ':change', value);
        }
      };

      var propDef = {
        get: getter
      };

      if (isConstant) {
        propDef['set'] = setter;
      }

      Object.defineProperty(this, name, propDef);
    };
    
    World.prototype.initialize = function(obj) {
      
    };
    
    World.prototype.reset = function() {
      
    };

    World.prototype.serialize = function() {
      return JSON.stringify(this);
    };

    World.prototype.deserialize = function() {

    };

    return World;

  })();
  
  return World;

});
