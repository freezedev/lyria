define('lyria/world', ['mixer', 'eventmap'], function(mixer, EventMap) {

  return (function() {

    var World = function() {
      mixer([this, World.prototype], new EventMap());
    };

    return World;

  })();

});
