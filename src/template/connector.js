define(['./methods'], function(templateMethods) {
  'use strict';
  
  /**
   * @module lyria/template/connector
   * @requires lyria/template/methods 
   */
  
  var noop = function() {
  };

  return (function() {

    /**
     * @class
     * @alias module:lyria/template/connector
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