(function(root) {
  'use strict';  root.check = function(variable, checkObject) {
    var checkType, k, key, keyArray, result, stringedVar, typeFuncs, typeName, types, value, _i, _len;
    stringedVar = {}.toString.call(variable);
    typeName = stringedVar.slice(8, stringedVar.length - 1).toLowerCase();
    checkType = function(typeString, cb, inverse) {
      if (inverse) {
        if (typeName !== typeString) {
          if (typeof cb === "function") {
            cb(variable);
          }
        }
      } else {
        if (typeName === typeString) {
          if (typeof cb === "function") {
            cb(variable);
          }
        }
      }
      /*
        Else is a reserved keyword, while CoffeeScript interpolates it correctly,
        it can only be written as check(...).['else']...
        check(...).otherwise(...) is a better choice if using plain JavaScript
      */

      if (!checkObject) {
        result["else"] = result.otherwise = function(cb) {
          return checkType(typeString, cb, !inverse);
        };
        return result;
      }
    };
    types = function(inverse) {
      return {
        valid: function(cb) {
          if (inverse) {
            if (variable == null) {
              cb(variable);
            }
          } else {
            if (variable != null) {
              cb(variable);
            }
          }
          return this;
        },
        undefined: function(cb) {
          return checkType("undefined", cb, inverse);
        },
        "null": function(cb) {
          return checkType("null", cb, inverse);
        },
        string: function(cb) {
          return checkType("string", cb, inverse);
        },
        number: function(cb) {
          return checkType("number", cb, inverse);
        },
        object: function(cb) {
          return checkType("object", cb, inverse);
        },
        array: function(cb) {
          return checkType("array", cb, inverse);
        },
        "function": function(cb) {
          return checkType("function", cb, inverse);
        }
      };
    };
    if (checkObject) {
      typeFuncs = types(false);
      for (key in checkObject) {
        value = checkObject[key];
        if (key.indexOf(',') > -1) {
          keyArray = key.split(',');
          for (_i = 0, _len = keyArray.length; _i < _len; _i++) {
            k = keyArray[_i];
            typeFuncs[k.trim()](value);
          }
        } else {
          typeFuncs[key](value);
        }
      }
      result = void 0;
    } else {
      result = types(false);
      result.not = types(true);
    }
    return result;
  };
  if (typeof exports === "undefined" || exports === null) {
    return typeof root.define === "function" ? root.define('check', [], function() {
      return root.check;
    }) : void 0;
  }
})(typeof exports !== "undefined" && exports !== null ? exports : this);