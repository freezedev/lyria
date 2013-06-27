define('lyria/serialize', ['jquery'], function($) {
  
  // TODO: Use JSON.parse + reviver instead
  /**
   *
   * @param {Object} anyObject
   *
   * @returns {String}
   */
  var serialize = function(anyObject) {
    if (( typeof anyObject !== 'object') || ( anyObject instanceof $)) {
      return;
    }

    var str = '{';

    for (var p in anyObject) {
      if (anyObject.hasOwnProperty(p)) {
        if (anyObject[p] instanceof $) {
          continue;
        }

        var objKeys = Object.keys(anyObject);
        var commaStr = (objKeys.indexOf(p) === (objKeys.length - 1)) ? '' : ',';

        switch (typeof anyObject[p]) {
          case 'object':
            {
              str += p + ': ' + serialize(anyObject[p]) + commaStr + '\n';
            }
            break;
          case 'string':
            {
              str += p + ': "' + anyObject[p] + '"' + commaStr + '\n';
            }
            break;
          default:
            {
              str += p + ': ' + anyObject[p] + commaStr + '\n';
            }
            break;
        }
      }
    }
    str += '}';

    return str;
  };

  return serialize;
});
