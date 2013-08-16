(function(root) {
  // Shim for detecting performance timer
  var performance = root.performance;
  performance.now = performance.now || (function() {
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    
    var functionName = '';
    for (var i = 0, j = vendors.length; i < j; i++) {
      functionName = vendors[i] + 'Now';
      
      if (performance[functionName]) {
        return performance[functionName];
      }
    }
  });
})(this);
