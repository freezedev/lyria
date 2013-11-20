define('lyria/template/string', ['objectify'], function(objectify) {
  var templateString = {
    key: {
      start: '\\{{',
      end: '\\}}'
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
        var templateObject = objectify(parameter);
        
        var keys = Object.keys(templateObject);
        
        for (var i = 0, j = keys.length; i < j; i++) {
          (function(num, item) {
            value = value.replace(new RegExp(templateString.key.start + num + templateString.key.end, 'g'), item);
          })(keys[i], templateObject[keys[i]]);
        }
        
      }

      return value;
    }
  };

  return templateString;
});
