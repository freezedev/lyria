 /**
 * @module Lyria
 * @submodule Template 
 */
define(['./methods'], function(templateMethods) {
  var noop = function() {
  };

  return (function() {

    /**
     * @class Connector 
     * @constructor
     */
    var TemplateConnector = function(functionRefs) {
      if ( typeof functionRefs === 'object') {
        var key, value;

        for (key in functionRefs) {
          value = functionRefs[key];

          if ( typeof value === 'function') {
            this[key] = value;
          }
        }

      }
    };

    for (var i = 0, j = templateMethods.length; i < j; i++) {
      (function(iterator) {
        TemplateConnector.prototype[iterator] = noop;
      })(templateMethods[i]);
    }

    return TemplateConnector;

  })();
}); 