define(['eventmap', 'mixedice', 'deleteitem', 'performance'], function(EventMap, mixedice, deleteItem, performance) {
  'use strict';

  /**
   * @module lyria/checkpoints
   * @requires eventmap
   * @requires mixedice
   * @requires deleteitem
   * @requires performance 
   */

  return (function() {
    
    /**
     * Checkpoints
     *
     * @class
     * @alias module:lyria/checkpoints
     */
    var Checkpoints = function() {
      // Mix-in eventmap
      mixedice([this, Checkpoints.prototype], new EventMap());

      // Set start time
      this.startTime = performance.now();
      
      // List of all passed checkpoints
      this.checkpointList = [];
    };

    /**
     * Pass a checkpoint
     * 
     * @param {String} name
     */
    Checkpoints.prototype.pass = function(name) {
      // A checkpoint can only be passed once
      if (this.hasPassed(name)) {
        return;
      }
      
      this.checkpointList.push(name);
      
      this.trigger('pass', name, (performance.now() - this.startTime));
    };

    /**
     * Checks if a checkpoint has been passed
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
      if (this.checkpointList.length === 0) {
        return;
      }
      
      if (name == null) {
        var oldList = this.checkpointList;
        this.checkpointList = [];
        this.trigger('reset', oldList);
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
  })();
  
});
