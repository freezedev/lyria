define('lyria/component', ['mixin', 'lyria/eventmap'], function(mixin, EventMap) {

  //Lyria.Component
  return (function() {

    function Component(name) {
      mixin(Component.prototype, new EventMap());
      
      this.name = name != null ? name : this.constructor.name;
    }
    
    Component.prototype.update = function(dt) {
      this.trigger('update', dt);
    };

    return Component;

  })();

});
