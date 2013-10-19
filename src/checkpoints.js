define('lyria/checkpoints', ['eventmap', 'mixer', 'deleteitem'], function(EventMap, mixer, deleteItem) {

  var Checkpoints = (function() {
    var Checkponts = function() {
      mixer([this, Checkpoints.prototype], new EventMap());

      this.startTime = performance.now();
      this.checkpointList = [];
    };

    Checkpoints.prototype.pass = function(name) {
      this.checkpointList.push(name);
      this.trigger('pass', name, performance.now() - startTime);
    };

    Checkpoints.prototype.hasPassed = function(name) {
      return (this.checkpointList.indexOf(name) !== -1);
    };

    Checkpoints.prototype.reset = function(name) {
      var index = this.checkpointList.indexOf(name);

      if (index === -1) {
        return;
      }

      this.checkpointList = deleteItem(this.checkpointList, index);
      this.trigger('reset', name);
    };

    return Checkpoints;
  });
  
  return Checkpoints;

});
