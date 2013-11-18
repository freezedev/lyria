define('lyria/template/string', function() {
  var templateString = {
    key: {
      start: '{{',
      end: '}}'
    },
    process: function(value, parameter) {
      if (value == null) {
        return;
      }
      
      if (parameter == null) {
        return value;
      }

      // Array or object
      if ( typeof parameter === 'object') {
        if (Array.isArray(parameter)) {
          for (var i = 0, j = parameter.length; i < j; i++) {
            value = value.replace(new RegExp(templateString.key.start + i + templateString.key.end), parameter[i]);
          }
        } else {
          var paramKeys = Object.keys(parameter);

          for (var k = 0, l = paramKeys.length; k < l; k++) {
            (function(item) {
              value = value.replace(new RegExp(templateString.key.start + paramKeys[k] + templateString.key.end), item);
            })(parameter[paramKeys[k]]);
          }
        }
      }

      return value;
    }
  };

  return templateString;
});
