;(function(global, Lyria, $) {
  
  /**
   *
   */
  Lyria.Base = {
    extend: function(extendedObject, options) {
      var defaultOptions = {
        initParameter: null,
        createFunction: false
      };
      options = $.extend(true, defaultOptions, options);
      
      var newObject = $.extend(true, {}, Lyria.Base, extendedObject);
      
      if (!options.createFunction) {
        if (newObject.init && (typeof newObject.init === "function")) {
          newObject.init(options.initParameter);
        }
      
        return newObject;
      } else {
        return function(parameter) { 
          if (newObject.init && (typeof newObject.init === "function")) {
            newObject.init.apply(this, arguments);
          }
          
          return newObject; 
        };
      }
    },
    log: function(message) {
      Lyria.Console.log(message);
    },
    name: 'Base',
    id: 0,
    init: function() {
    },
    has: function(key) {
      if( typeof key === "string") {
        return ( typeof this[key] === "undefined") ? false : true;
      }
  
      return false;
    },
    attr: function(key, value) {
      if( typeof value === "undefined") {
        // Getter
        return (this.has(key)) ? this[key] : null;
      } else {
        // Setter
        this[key] = value;
      }
    },
    toJSON: function() {
      function delFunctionInObject(object) {
        $.each(object, function(key, value) {
          if( typeof value === "function") {
            delete object[key];
          } else {
            if( typeof value === "object") {
              delFunctionInObject(value);
            }
          }
        });
      }
  
      var JSONObject = Lyria.Utils.cloneObject(this);
      delFunctionInObject(JSONObject);
  
      return JSONObject;
    },
    each: function(callback) {
      
    },
    save: function(name) {
      
    },
    load: function(name) {
      
    }
  }
  
})(this, this.Lyria = this.Lyria || {}, this.jQuery);
