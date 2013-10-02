define('lyria/component', ['mixer', 'eventmap'], function(mixer, EventMap) {

  //Lyria.Component
  return (function() {

    function Component(name) {
      mixer(Component.prototype, new EventMap());
      
      this.name = name != null ? name : this.constructor.name;
      
      this.children = {};
      
      this.on('update', function(dt) {
        for (var key in children) {
          var value = children[key];
          if (value && value.update) {
            value.update();
          }
        }
      });
    }

    return Component;

  })();

});
