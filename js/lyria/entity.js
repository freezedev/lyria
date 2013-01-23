(function(global, Lyria) {
  
Lyria.Entity = (function() {
  var functionList;

  functionList = {};

  function Entity(name) {
    this.name = name != null ? name : this.constructor.name;
    this.components = {};
    functionList = {};
  }

  Entity.prototype.add = function(component) {
    var componentInstance, componentName, key, value;
    if (!component) {
      return this;
    }
    componentName = component.name;
    componentInstance = this.components[componentName];
    if (!componentInstance) {
      componentInstance = component;
      if (typeof componentInstance.register === "function") {
        componentInstance.register();
      }
      for (key in componentInstance) {
        value = componentInstance[key];
        if (key === 'constructor') {
          continue;
        }
        if (typeof value === 'function') {
          if (!functionList[key]) {
            functionList[key] = [];
          }
          functionList[key].push(value);
          if (!this[key]) {
            this[key] = (function(key) {
              return function() {
                var functions, _i, _len, _ref;
                _ref = functionList[key];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  functions = _ref[_i];
                  functions.apply(this, arguments);
                }
                return this;
              };
            })(key);
          }
        }
      }
    }
    return this;
  };

  Entity.prototype.remove = function(componentName) {
    var _base;
    if (this.components[componentName]) {
      if (typeof (_base = this.components[componentName]).unregister === "function") {
        _base.unregister();
      }
      delete this.components[componentName];
    }
    return this;
  };

  Entity.prototype.render = function() {
    var key, value, _ref;
    _ref = this.components;
    for (key in _ref) {
      value = _ref[key];
      if (typeof value.render === "function") {
        value.render();
      }
    }
    return this;
  };

  Entity.prototype.update = function(dt) {
    var key, value, _ref;
    _ref = this.components;
    for (key in _ref) {
      value = _ref[key];
      if (typeof value.update === "function") {
        value.update(dt);
      }
    }
    return this;
  };

  return Entity;

})();  
  
})(this, this.Lyria = this.Lyria || {});
