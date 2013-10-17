define('lyria/component', ['mixer', 'eventmap', 'lyria/component/manager', 'lyria/log'], function(mixer, EventMap, ComponentManager, Log) {

  //Lyria.Component
  return (function() {

    var Component = function(name, factory) {
      mixer([this, Component.prototype], new EventMap());
      
      this.name = name != null ? name : this.constructor.name;
      
      this.type = 'Component';
      
      this.children = {};
      
      factory.apply(this, [this]);
      
      this.on('update', function(dt) {
        for (var key in children) {
          var value = children[key];
          if (value && value.trigger) {
            value.trigger('update', dt);
          }
        }
      });
    };
    
    /**
     * Adds a component to this entity
     * 
     * @method add
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
      
      children[name] = childObject;
      
      this.trigger('add', name);
      childObject.trigger('added', this);
    };
    
    /**
     * Removes a component from the entity
     *  
     * @method remove
     * @param {String} name
     */
    Component.prototype.remove = function(name) {
      if (name == null) {
        return;
      }
      
      delete children[name];
      
      this.trigger('remove', name);
    };
    
    /**
     * Logs from the component itself
     * 
     * @method log
     * @param {String} text
     */
    Component.prototype.log = function(text) {
      Log.i(this.type + ': ' + text);
    };

    return Component;

  })();

});