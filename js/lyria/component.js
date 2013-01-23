(function(global, Lyria) {
  
  Lyria.Component = (function() {

  function Component(name) {
    this.name = name != null ? name : this.constructor.name;
  }

  Component.prototype.register = function() {};

  Component.prototype.unregister = function() {};

  Component.prototype.render = function() {};

  Component.prototype.update = function(dt) {};

  return Component;

})();
  
})(this, this.Lyria = this.Lyria || {});
