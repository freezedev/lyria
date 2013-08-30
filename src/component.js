define('lyria/component', ['mixer', 'eventmap'], function(mixer, EventMap) {

  //Lyria.Component
  return (function() {

    function Component(name) {
      mixer(Component.prototype, new EventMap());
      
      this.name = name != null ? name : this.constructor.name;
    }
    
    Component.prototype.update = function(dt) {
      this.trigger('update', dt);
    };

    return Component;

  })();

});
