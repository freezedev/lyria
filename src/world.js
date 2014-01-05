define(['mixedice', 'eventmap'], function(mixedice, EventMap) {
  'use strict';

  return (function() {

    var World = function() {
      mixedice([this, World.prototype], new EventMap());
    };
    
    World.prototype.serialize = function() {
      
    };
    
    World.prototype.deserialize = function() {
      
    };

    return World;

  })();

});
