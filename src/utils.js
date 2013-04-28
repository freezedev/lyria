/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/utils', ['jquery'], function($) {
  
  
  var Utils = {};
  
  /**
   *
   * @param {Object} filename
   *
   * @returns {Boolean}
   */
  Utils.isFile = function(filename) {
    var sepPos = filename.indexOf('.');
    if (sepPos === -1) {
      return false;
    }

    var filenameLength = filename.length;
    var diff = filenameLength - sepPos;

    // A filename extension is allowed to be one to four characters long.
    if ((diff > 1) && (diff <= 5)) {
      return true;
    } else {
      return false;
    }
  };
  /**
   *
   * @param {Object} anyObject
   *
   * @returns {Object}
   */
  Utils.cloneObject = function(anyObject) {
    return $.extend(true, {}, anyObject);
  };
  
  /**
   * 
   * @param {Object} anyObject
   * 
   * @returns {String}
   */
  Utils.serializeObject = function(anyObject) {
    if ((typeof anyObject !== 'object') || (anyObject instanceof $)) {
      return;
    }
    
      var str = '{';        
      
      for (var p in anyObject) {
          if (anyObject.hasOwnProperty(p)) {
            if (anyObject[p] instanceof $) {
              continue;
            }
            
            var objKeys = Object.keys(anyObject);
            var commaStr = (objKeys.indexOf(p) === (objKeys.length - 1)) ? '' : ',';
            
            switch (typeof anyObject[p]) {
              case 'object': {
                str += p + ': ' + Utils.serializeObject(anyObject[p]) + commaStr + '\n';
              }
                break;
              case 'string': {
                str += p + ': "' + anyObject[p] + '"' + commaStr + '\n';
              }
                break;
              default: {
                str += p + ': ' + anyObject[p] + commaStr + '\n';
              }
                break;
            }
          }
      }
      str += '}';
      
      return str;
  };
  
  return Utils;
  
});
