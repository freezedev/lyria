define('lyria/checkpoints', ['eventmap', 'mixer', 'deleteitem'], function(EventMap, mixer, deleteItem) {

  var Checkpoints = (function() {
    var Checkponts = function() {
      mixer([this, Checkpoints.prototype], new EventMap());

      this.startTime = performance.now();
      this.checkpointList = [];
    };

    /**
     * Pass a checkpoint
     * 
     * @param {String} name
     */
    Checkpoints.prototype.pass = function(name) {
      this.checkpointList.push(name);
      this.trigger('pass', name, performance.now() - startTime);
    };

    /**
     * Passes a checkpoint
     * 
     * @param {String} name
     */
    Checkpoints.prototype.hasPassed = function(name) {
      return (this.checkpointList.indexOf(name) !== -1);
    };

    /**
     * Reset a single or all checkpoints
     * 
     * @param {String} name
     */
    Checkpoints.prototype.reset = function(name) {
      if (name == null) {
        this.checkpointList = [];
        this.trigger('reset');
        return;
      }
      
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
