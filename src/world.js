define(['mixedice', 'eventmap'], function(mixedice, EventMap) {

  return (function() {

    var World = function() {
      mixedice([this, World.prototype], new EventMap());
    };

    return World;

  })();

});
