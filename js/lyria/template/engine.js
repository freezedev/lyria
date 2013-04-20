define('lyria/template/engine', ['root', 'lyria/template/connector'], function(root, TemplateConnector) {

  var noop = function() {};

  var TemplateEngine = function(templateConnector) {
    if ( templateConnector instanceof Lyria.TemplateConnector) {
      for (var i = 0, j = templateMethods.length; i < j; i++) {
        (function(iterator) {
          if ((templateConnector[iterator] != null) && ( typeof templateConnector[iterator] === 'function')) {
            Lyria.TemplateEngine[iterator] = templateConnector[iterator];
          } else {
            Lyria.TemplateEngine[iterator] = noop;
          }
        })(templateMethods[i]);
      }
    }
  };

  if (root.Handlebars) {
    var handlebarsConnector = new Lyria.TemplateConnector({
      compile: function() {
        return root.Handlebars.template.apply(this, arguments);
      }
    });

    return TemplateEngine(handlebarsConnector);
  } else {
    return TemplateEngine;
  }

});
