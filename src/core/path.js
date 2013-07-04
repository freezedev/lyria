define('path', function() {
  var delimiter = '/';

  var Path = {
    join: function(arr) {
      var pathArray = (function() {
        var result = [];

        for (var i = 0, j = arr.length; i < j; i++) {
          if (arr[i] != null && arr[i] !== '') {
            result.push(arr[i]);
          }
        }

        return result;
      })();
      return pathArray.join(delimiter);
    },
    resolve: function(base, relativeStr) {
      if (!Array.isArray(relativeStr)) {
        relativeStr = relativeStr.split(delimiter);
      }

      var baseArray = base.split(delimiter);
      var result = [];

      var completeArr = baseArray.concat(relativeStr);

      // Last identifier should not be ..
      var lastElement = completeArr.length - 1;
      
      if ((completeArr[lastElement] === '..') || (completeArr[lastElement] === '.')) {
        completeArr[lastElement] = '';
      }

      for (var i = 0, j = completeArr.length; i < j; i++) {
        if (completeArr[i] != null && completeArr[i] !== '') {
          if (completeArr[i] === '.') {
            continue;
          }

          if (completeArr[i + 1] === '..') {
            completeArr[i] = '';
            completeArr[i + 1] = '';

            continue;
          }

          result.push(completeArr[i]);
        }
      }

      return Path.join(result);
    },
    dotToPath: function(str) {
      return Path.join(str.split('.'));
    }
  };

  return Path;
});
