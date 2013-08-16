define('lyria/serialize', ['jquery'], function($) {
  
  /**
   *
   * @param {Object} anyObject
   *
   * @returns {String}
   */
  var serialize = function(anyObject) {
    if (( typeof anyObject !== 'object') || ( anyObject instanceof $)) {
      return;
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
