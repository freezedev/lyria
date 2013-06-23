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
  
  return Utils;
  
});
