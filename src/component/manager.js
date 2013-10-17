define('lyria/component/manager', function() {

  var components = {};

  var ComponentManager = {};

  ComponentManager.add = function(component) {
    var name = component.name || 'anonymous-' + Date.now();

    components[name] = component;
  };

  ComponentManager.remove = function(name) {
    if (name == null) {
      return;
    }
    
    delete ComponentManager[name];
  };
  
  ComponentManager.get = function(name) {
    return components[name];
  };

  return ComponentManager;

});
