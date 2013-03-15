(function(root, $, Lyria) {

  var noop = function() {
  };
  var templateMethods = ['compile'];

  Lyria.TemplateConnector = (function() {

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

  Lyria.TemplateEngine = function(templateConnector) {
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
        
      }
    });

    Lyria.TemplateEngine(handlebarsConnector);
  }

})(this, this.jQuery, this.Lyria = this.Lyria || {});
