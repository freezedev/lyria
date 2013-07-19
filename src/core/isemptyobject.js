define('isemptyobject', function() {
  return function(obj) {
    if ( typeof obj !== 'object') {
      return;
    }

    return (Object.keys(obj).length === 0);
  };
});