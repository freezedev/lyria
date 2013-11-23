define(['jquery'], function($) {
  
  /**
   *
   * @param {Object} anyObject
   *
   * @returns {String}
   */
  var serialize = function(anyObject) {
    if ((anyObject === undefined) || ( anyObject instanceof $)) {
      return;
    }
    
    if (typeof anyObject === 'function') {
      return anyObject.toString();
    }
    
    return JSON.stringify(anyObject, function(key, value) {
      if (value instanceof $) {
        return null;
      }
      
      if (typeof value === 'function') {
        value = value.toString();
      }
      
      return value;
    });
  };

  return serialize;
});
