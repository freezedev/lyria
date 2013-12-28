/**
 * @module Lyria
 * @submodule Template
 */
define(['hbs', './connector', './methods'], function(Handlebars, TemplateConnector, templateMethods) {
  'use strict';

  var noop = function() {
  };

  /**
   * @class Engine
   * @constructor
   *
   * @param {Object} templateConnector
   */
  var TemplateEngine = function(templateConnector) {
    if ( templateConnector instanceof TemplateConnector) {
      for (var i = 0, j = templateMethods.length; i < j; i++) {
        (function(iterator) {
          if ((templateConnector[iterator] != null) && ( typeof templateConnector[iterator] === 'function')) {
            TemplateEngine[iterator] = templateConnector[iterator];
          } else {
            TemplateEngine[iterator] = noop;
          }
        })(templateMethods[i]);
      }
    }
  };

  if (Handlebars) {
    var handlebarsConnector = new TemplateConnector({
      compile: function() {
        return Handlebars.template.apply(this, arguments);
      },
      globalHelpers: function() {
        return Handlebars.helpers;
      }
    });

    new TemplateEngine(handlebarsConnector);
  }
  
  return TemplateEngine;

});
